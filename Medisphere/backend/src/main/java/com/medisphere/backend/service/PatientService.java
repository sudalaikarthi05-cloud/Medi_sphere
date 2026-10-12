package com.medisphere.backend.service;
 
import com.medisphere.backend.audit.AuditService;
import com.medisphere.backend.dto.PatientRequest;
import com.medisphere.backend.dto.PatientResponse;
import com.medisphere.backend.exception.ResourceNotFoundException;
import com.medisphere.backend.model.*;
import com.medisphere.backend.repository.PatientRepository;
import jakarta.annotation.PostConstruct;
import org.bson.Document;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.dao.DataAccessException;
import org.springframework.data.mongodb.core.FindAndModifyOptions;
import org.springframework.data.mongodb.core.MongoTemplate;
import org.springframework.data.mongodb.core.query.Criteria;
import org.springframework.data.mongodb.core.query.Query;
import org.springframework.data.mongodb.core.query.Update;
import org.springframework.http.HttpStatus;
import org.springframework.web.server.ResponseStatusException;
import org.springframework.stereotype.Service;
 
import java.util.*;
import java.util.concurrent.ConcurrentHashMap;
import java.util.concurrent.atomic.AtomicInteger;
import java.util.stream.Collectors;
 
@Service
public class PatientService {
 
    private static final Logger log = LoggerFactory.getLogger(PatientService.class);
 
    private static final String COUNTERS_COLLECTION = "counters";
    private static final String PATIENT_COUNTER_ID = "patient";
 
    private final PatientRepository patientRepository;
    private final VitalService vitalService;
    private final LabReportService labReportService;
    private final RiskService riskService;
    private final AuditService auditService;
    private final MongoTemplate mongoTemplate;
 
    // Resilient in-memory fallback cache when MongoDB is running in demo/offline mode
    private final Map<String, Patient> fallbackStore = new ConcurrentHashMap<>();
    // Used ONLY when MongoDB counter is not reachable
    private final AtomicInteger idCounter = new AtomicInteger(6);
    private boolean mongoAvailable = false;
 
    public PatientService(PatientRepository patientRepository,
                          VitalService vitalService,
                          LabReportService labReportService,
                          RiskService riskService,
                          AuditService auditService,
                          MongoTemplate mongoTemplate) {
        this.patientRepository = patientRepository;
        this.vitalService = vitalService;
        this.labReportService = labReportService;
        this.riskService = riskService;
        this.auditService = auditService;
        this.mongoTemplate = mongoTemplate;
    }

    public boolean isMongoAvailable() {
        return mongoAvailable;
    }
 
    @PostConstruct
    public void initSeedData() {
        List<Patient> seedPatients = List.of(
                new Patient("P001", "Arun Kumar", 52, "Male", "Hypertension", "Active", "Medium", 62),
                new Patient("P002", "Priya Sharma", 44, "Female", "Diabetes", "Monitoring", "Low", 28),
                new Patient("P003", "Rahul Raj", 61, "Male", "Cardiac Risk", "Active", "High", 84),
                new Patient("P004", "Meena Devi", 38, "Female", "Healthy", "Active", "Low", 14),
                new Patient("P005", "Karthik Anand", 56, "Male", "Type 2 Diabetes", "Monitoring", "Medium", 58)
        );
 
        for (Patient p : seedPatients) {
            fallbackStore.put(p.getId(), p);
        }
 
        try {
            mongoTemplate.updateMulti(
                    Query.query(Criteria.where("is_deleted").exists(false)),
                    new Update().set("is_deleted", 0),
                    Patient.class);

            if (patientRepository.count() == 0) {
                patientRepository.saveAll(seedPatients);
                log.info("Initialized MongoDB with 5 synthetic seed patients.");
            }
 
            // Make sure the MongoDB ID counter exists and is never behind the data.
            // $max only ever moves the counter forward, so restarts are always safe.
            Query counterQuery = Query.query(Criteria.where("_id").is(PATIENT_COUNTER_ID));
            mongoTemplate.upsert(counterQuery,
                    new Update().max("seq", findMaxPatientNumber()),
                    COUNTERS_COLLECTION);
 
            mongoAvailable = true;
        } catch (Exception e) {
            mongoAvailable = false;
            log.info("MongoDB not connected directly. Running in resilient DEMO MODE with synthetic seed data. Reason: {}", e.getMessage());
        }
    }
 
    /** Highest numeric part of existing patient IDs (P008 -> 8). Runs once at startup. */
    private int findMaxPatientNumber() {
        return patientRepository.findAll().stream()
                .map(Patient::getId)
                .filter(id -> id != null && id.matches("P\\d+"))
                .mapToInt(id -> Integer.parseInt(id.substring(1)))
                .max()
                .orElse(0);
    }
 
    /** Returns a new unique patient ID. Never repeats, even after restarts. */
    private String generateUniqueId() {
        if (mongoAvailable) {
            try {
                Document d = mongoTemplate.findAndModify(
                        Query.query(Criteria.where("_id").is(PATIENT_COUNTER_ID)),
                        new Update().inc("seq", 1),
                        FindAndModifyOptions.options().returnNew(true).upsert(true),
                        Document.class,
                        COUNTERS_COLLECTION);
                long seq = ((Number) d.get("seq")).longValue();
                return String.format("P%03d", seq);
            } catch (Exception e) {
                log.warn("Mongo counter unavailable, using in-memory ID: {}", e.getMessage());
            }
        }
 
        // Fallback (demo mode / Mongo down): skip any ID already in memory
        String id;
        do {
            id = String.format("P%03d", idCounter.getAndIncrement());
        } while (fallbackStore.containsKey(id));
        return id;
    }
 
    public List<Patient> getAllPatients(String search, String condition, String status, String risk) {
        List<Patient> list;
        try {
            if (mongoAvailable) {
                list = patientRepository.findByIsDeleted(0);
            } else {
                list = new ArrayList<>(fallbackStore.values());
            }
        } catch (Exception e) {
            list = new ArrayList<>(fallbackStore.values());
        }

        list.sort(Comparator.comparing(
                Patient::getCreatedAt,
                Comparator.nullsLast(Comparator.naturalOrder())));
 
        // Apply filters
        if (search != null && !search.isBlank()) {
            String query = search.trim().toLowerCase();
            list = list.stream().filter(p ->
                    p.getName().toLowerCase().contains(query) ||
                    p.getId().toLowerCase().contains(query) ||
                    p.getCondition().toLowerCase().contains(query)
            ).collect(Collectors.toList());
        }
 
        if (condition != null && !condition.isBlank()) {
            list = list.stream().filter(p -> p.getCondition().equalsIgnoreCase(condition)).collect(Collectors.toList());
        }
 
        if (status != null && !status.isBlank()) {
            list = list.stream().filter(p -> p.getStatus().equalsIgnoreCase(status)).collect(Collectors.toList());
        }
 
        if (risk != null && !risk.isBlank()) {
            list = list.stream().filter(p -> p.getRiskLevel().equalsIgnoreCase(risk)).collect(Collectors.toList());
        }
 
        auditService.logAction("READ_PATIENTS_LIST", "Patient", "ALL", "Dr. Ananya Sharma", "CLINICIAN", "127.0.0.1", "SUCCESS", "Retrieved " + list.size() + " patients");
        return list;
    }
 
    public Patient getPatientById(String id) {
        Patient patient = null;
        try {
            if (mongoAvailable) {
                patient = patientRepository.findByIdAndIsDeleted(id, 0).orElse(null);
            }
        } catch (Exception e) {
            // fallback
        }
 
        if (patient == null && !mongoAvailable) {
            patient = fallbackStore.get(id);
        }
 
        if (patient == null) {
            auditService.logAction("READ_PATIENT", "Patient", id, "Dr. Ananya Sharma", "CLINICIAN", "127.0.0.1", "FAILED", "Patient not found");
            throw new ResourceNotFoundException("Patient with ID " + id + " was not found in the clinical registry.");
        }
 
        auditService.logAction("READ_PATIENT", "Patient", id, "Dr. Ananya Sharma", "CLINICIAN", "127.0.0.1", "SUCCESS", "Accessed clinical profile for " + patient.getName());
        return patient;
    }
 
    public Patient createPatient(PatientRequest request) {
        if (!mongoAvailable) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "MongoDB is unavailable. Patient was not saved.");
        }

        String newId = generateUniqueId();
        String initialStatus = request.getStatus() != null && !request.getStatus().isBlank() ? request.getStatus() : "Active";
 
        // Determine baseline risk from condition and age
        int baseScore = 20;
        String riskLevel = "Low";
        if (request.getCondition().toLowerCase().contains("cardiac")) {
            baseScore = 75;
            riskLevel = "High";
        } else if (request.getCondition().toLowerCase().contains("diabetes") || request.getCondition().toLowerCase().contains("hypertension")) {
            baseScore = 55;
            riskLevel = "Medium";
        }
        if (request.getAge() > 60) {
            baseScore = Math.min(100, baseScore + 10);
            if (baseScore > 70) riskLevel = "High";
        }
 
        Patient patient = new Patient(newId, request.getName(), request.getAge(), request.getGender(), request.getCondition(), initialStatus, riskLevel, baseScore);
 
        try {
            // insert() never overwrites: a duplicate ID throws instead of deleting old data
            patientRepository.insert(patient);
        } catch (DataAccessException e) {
            mongoAvailable = false;
            log.error("Failed to save patient {} to MongoDB.", newId, e);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "MongoDB could not save the patient. Please retry after the database is available.", e);
        }

        fallbackStore.put(newId, patient);

        // Initialize corresponding baseline vitals, labs, and risk assessment
        vitalService.initializePatientVitals(newId);
        labReportService.initializePatientLabs(newId, request.getCondition());
        riskService.evaluateRisk(newId, patient);
 
        auditService.logAction("CREATE_PATIENT", "Patient", newId, "Dr. Ananya Sharma", "CLINICIAN", "127.0.0.1", "SUCCESS", "Registered new patient: " + patient.getName());
        return patient;
    }
 
    public Patient updatePatient(String id, PatientRequest request) {
        if (!mongoAvailable) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "MongoDB is unavailable. Patient was not updated.");
        }

        Patient existing = getPatientById(id);
        Patient patient = new Patient();
        patient.setId(existing.getId());
        patient.setName(request.getName());
        patient.setAge(request.getAge());
        patient.setGender(request.getGender());
        patient.setCondition(request.getCondition());
        patient.setRiskLevel(existing.getRiskLevel());
        patient.setRiskScore(existing.getRiskScore());
        patient.setAssignedDoctor(existing.getAssignedDoctor());
        patient.setRoomNumber(existing.getRoomNumber());
        patient.setCreatedAt(existing.getCreatedAt());
        patient.setIsDeleted(existing.getIsDeleted());
        if (request.getStatus() != null) {
            patient.setStatus(request.getStatus());
        } else {
            patient.setStatus(existing.getStatus());
        }
        patient.setUpdatedAt(java.time.Instant.now());
 
        try {
            patientRepository.save(patient);
        } catch (DataAccessException e) {
            mongoAvailable = false;
            log.error("Failed to update patient {} in MongoDB.", id, e);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "MongoDB could not update the patient. Please retry after the database is available.", e);
        }
        fallbackStore.put(id, patient);
 
        auditService.logAction("UPDATE_PATIENT", "Patient", id, "Dr. Ananya Sharma", "CLINICIAN", "127.0.0.1", "SUCCESS", "Updated patient details");
        return patient;
    }
 
    public void deletePatient(String id) {
        if (!mongoAvailable) {
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "MongoDB is unavailable. Patient was not deleted.");
        }

        try {
            Patient patient = patientRepository.findByIdAndIsDeleted(id, 0)
                    .orElseThrow(() -> new ResourceNotFoundException(
                            "Patient with ID " + id + " was not found in the clinical registry."));
            patient.setIsDeleted(1);
            patient.setUpdatedAt(java.time.Instant.now());
            patientRepository.save(patient);
        } catch (DataAccessException e) {
            mongoAvailable = false;
            log.error("Failed to delete patient {} from MongoDB.", id, e);
            throw new ResponseStatusException(HttpStatus.SERVICE_UNAVAILABLE,
                    "MongoDB could not delete the patient. Please retry after the database is available.", e);
        }
        fallbackStore.remove(id);
        auditService.logAction("DELETE_PATIENT", "Patient", id, "Dr. Ananya Sharma", "CLINICIAN", "127.0.0.1", "SUCCESS", "Discharged and archived patient");
    }
 
    public PatientResponse getPatient360(String id) {
        Patient patient = getPatientById(id);
        Vital vitals = vitalService.getLatestVitals(id);
        RiskAssessment risk = riskService.getLatestRisk(id);
        List<LabReport> labs = labReportService.getLabsByPatientId(id);
        List<PreventiveCare> preventive = labReportService.getPreventiveCare(id);
 
        String source = mongoAvailable ? "LIVE_CLINICAL" : "SYNTHETIC_DEMO";
        return new PatientResponse(patient, vitals, risk, labs, preventive, source);
    }
}
 
