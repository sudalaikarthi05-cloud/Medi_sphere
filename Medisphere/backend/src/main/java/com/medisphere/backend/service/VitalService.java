package com.medisphere.backend.service;

import com.medisphere.backend.audit.AuditService;
import com.medisphere.backend.model.Vital;
import com.medisphere.backend.repository.VitalRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.time.Instant;
import java.util.Map;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class VitalService {

    private static final Logger log = LoggerFactory.getLogger(VitalService.class);
    private final VitalRepository vitalRepository;
    private final AuditService auditService;
    private final Map<String, Vital> fallbackVitals = new ConcurrentHashMap<>();

    public VitalService(VitalRepository vitalRepository, AuditService auditService) {
        this.vitalRepository = vitalRepository;
        this.auditService = auditService;
    }

    @PostConstruct
    public void initSeedVitals() {
        // Seed vitals for patients P001 - P005
        fallbackVitals.put("P001", new Vital("P001", 72, 128, 82, 98.0, 98.4));
        fallbackVitals.put("P002", new Vital("P002", 78, 122, 78, 99.0, 98.6));
        fallbackVitals.put("P003", new Vital("P003", 88, 154, 94, 96.5, 99.1));
        fallbackVitals.put("P004", new Vital("P004", 68, 118, 76, 99.5, 98.2));
        fallbackVitals.put("P005", new Vital("P005", 76, 134, 84, 97.5, 98.7));

        try {
            if (vitalRepository.count() == 0) {
                vitalRepository.saveAll(fallbackVitals.values());
            }
        } catch (Exception e) {
            log.debug("VitalRepository in demo mode: {}", e.getMessage());
        }
    }

    public Vital getLatestVitals(String patientId) {
        Vital vital = null;
        try {
            vital = vitalRepository.findFirstByPatientIdOrderByTimestampDesc(patientId).orElse(null);
        } catch (Exception e) {
            // fallback
        }

        if (vital == null) {
            vital = fallbackVitals.get(patientId);
        }

        if (vital == null) {
            vital = initializePatientVitals(patientId);
        }

        auditService.logAction("READ_VITALS", "Vital", patientId, "Dr. Ananya Sharma", "CLINICIAN", "127.0.0.1", "SUCCESS", "Telemetry reading: HR " + vital.getHeartRate());
        return vital;
    }

    public Vital initializePatientVitals(String patientId) {
        Vital v = new Vital(patientId, 72, 120, 80, 98.5, 98.6);
        fallbackVitals.put(patientId, v);
        try {
            vitalRepository.save(v);
        } catch (Exception e) {
            // demo mode
        }
        return v;
    }

    public Vital updateVitals(Vital vital) {
        vital.setTimestamp(Instant.now());
        vital.evaluateStatus();
        fallbackVitals.put(vital.getPatientId(), vital);
        try {
            vitalRepository.save(vital);
        } catch (Exception e) {
            // demo mode
        }
        auditService.logAction("UPDATE_VITALS", "Vital", vital.getPatientId(), "System/Kafka", "INTEGRATION", "127.0.0.1", "SUCCESS", "Updated vitals HR: " + vital.getHeartRate());
        return vital;
    }
}
