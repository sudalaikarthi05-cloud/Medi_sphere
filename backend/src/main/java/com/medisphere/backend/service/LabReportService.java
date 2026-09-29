package com.medisphere.backend.service;

import com.medisphere.backend.model.LabReport;
import com.medisphere.backend.model.PreventiveCare;
import com.medisphere.backend.repository.LabReportRepository;
import com.medisphere.backend.repository.PreventiveCareRepository;
import jakarta.annotation.PostConstruct;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.*;
import java.util.concurrent.ConcurrentHashMap;

@Service
public class LabReportService {

    private static final Logger log = LoggerFactory.getLogger(LabReportService.class);

    private final LabReportRepository labReportRepository;
    private final PreventiveCareRepository preventiveCareRepository;

    private final Map<String, List<LabReport>> fallbackLabs = new ConcurrentHashMap<>();
    private final Map<String, List<PreventiveCare>> fallbackPreventive = new ConcurrentHashMap<>();

    public LabReportService(LabReportRepository labReportRepository, PreventiveCareRepository preventiveCareRepository) {
        this.labReportRepository = labReportRepository;
        this.preventiveCareRepository = preventiveCareRepository;
    }

    @PostConstruct
    public void initSeedLabs() {
        // P001 Arun Kumar
        fallbackLabs.put("P001", List.of(
                new LabReport("L001", "P001", "Blood Glucose", "112", "mg/dL", "Attention", "70 - 99 mg/dL", "2026-09-08"),
                new LabReport("L002", "P001", "Hemoglobin", "13.8", "g/dL", "Normal", "13.2 - 16.6 g/dL", "2026-09-08"),
                new LabReport("L003", "P001", "Cholesterol", "188", "mg/dL", "Normal", "< 200 mg/dL", "2026-09-08"),
                new LabReport("L004", "P001", "Serum Creatinine", "1.0", "mg/dL", "Normal", "0.7 - 1.3 mg/dL", "2026-09-08")
        ));

        // P003 Rahul Raj (High Risk)
        fallbackLabs.put("P003", List.of(
                new LabReport("L005", "P003", "Troponin I", "0.05", "ng/mL", "Attention", "< 0.04 ng/mL", "2026-09-10"),
                new LabReport("L006", "P003", "Total Cholesterol", "242", "mg/dL", "Elevated", "< 200 mg/dL", "2026-09-10"),
                new LabReport("L007", "P003", "LDL Cholesterol", "162", "mg/dL", "Elevated", "< 100 mg/dL", "2026-09-10"),
                new LabReport("L008", "P003", "Blood Glucose", "128", "mg/dL", "Attention", "70 - 99 mg/dL", "2026-09-10")
        ));

        // Standard Preventive Care guidelines for P001
        fallbackPreventive.put("P001", List.of(
                new PreventiveCare("PR001", "P001", "Blood pressure monitoring", "Twice daily home systolic/diastolic recording", "High", "Active", "Daily"),
                new PreventiveCare("PR002", "P001", "Routine glucose screening", "Fasting blood glucose panel follow-up", "Medium", "Pending", "Quarterly"),
                new PreventiveCare("PR003", "P001", "Annual cardiovascular assessment", "Echocardiogram and resting ECG examination", "Medium", "Scheduled", "Annual"),
                new PreventiveCare("PR004", "P001", "Healthy lifestyle review", "Sodium reduction counselling and dietary DASH regimen", "Routine", "Active", "Ongoing")
        ));

        // Standard Preventive Care guidelines for P003
        fallbackPreventive.put("P003", List.of(
                new PreventiveCare("PR005", "P003", "Continuous cardiac rhythm evaluation", "Holter ambulatory telemetry monitoring", "High", "Active", "Continuous"),
                new PreventiveCare("PR006", "P003", "Lipid profile reassessment", "Post-statin therapy lipid panel verification", "High", "Scheduled", "Monthly"),
                new PreventiveCare("PR007", "P003", "Cardiology specialist consultation", "Review ventricular wall motion and exercise tolerance", "High", "Scheduled", "Bi-weekly"),
                new PreventiveCare("PR008", "P003", "Cardiac rehabilitation program", "Supervised aerobic exercise and stress reduction protocol", "Medium", "Active", "Weekly")
        ));
    }

    public List<LabReport> getLabsByPatientId(String patientId) {
        try {
            List<LabReport> list = labReportRepository.findByPatientId(patientId);
            if (list != null && !list.isEmpty()) {
                return list;
            }
        } catch (Exception e) {
            // fallback
        }
        return fallbackLabs.getOrDefault(patientId, getDefaultLabs(patientId));
    }

    public List<PreventiveCare> getPreventiveCare(String patientId) {
        try {
            List<PreventiveCare> list = preventiveCareRepository.findByPatientId(patientId);
            if (list != null && !list.isEmpty()) {
                return list;
            }
        } catch (Exception e) {
            // fallback
        }
        return fallbackPreventive.getOrDefault(patientId, getDefaultPreventive(patientId));
    }

    public void initializePatientLabs(String patientId, String condition) {
        List<LabReport> labs = getDefaultLabs(patientId);
        fallbackLabs.put(patientId, labs);

        List<PreventiveCare> preventive = getDefaultPreventive(patientId);
        fallbackPreventive.put(patientId, preventive);
    }

    private List<LabReport> getDefaultLabs(String patientId) {
        return List.of(
                new LabReport(UUID.randomUUID().toString(), patientId, "Blood Glucose", "94", "mg/dL", "Normal", "70 - 99 mg/dL", "2026-09-09"),
                new LabReport(UUID.randomUUID().toString(), patientId, "Hemoglobin", "14.2", "g/dL", "Normal", "13.2 - 16.6 g/dL", "2026-09-09"),
                new LabReport(UUID.randomUUID().toString(), patientId, "Cholesterol", "176", "mg/dL", "Normal", "< 200 mg/dL", "2026-09-09"),
                new LabReport(UUID.randomUUID().toString(), patientId, "Serum Creatinine", "0.9", "mg/dL", "Normal", "0.7 - 1.3 mg/dL", "2026-09-09")
        );
    }

    private List<PreventiveCare> getDefaultPreventive(String patientId) {
        return List.of(
                new PreventiveCare(UUID.randomUUID().toString(), patientId, "Blood pressure monitoring", "Routine weekly clinical verification", "Medium", "Active", "Weekly"),
                new PreventiveCare(UUID.randomUUID().toString(), patientId, "Routine glucose screening", "Annual metabolic panel inspection", "Routine", "Pending", "Annual"),
                new PreventiveCare(UUID.randomUUID().toString(), patientId, "Annual cardiovascular assessment", "Preventive biometric review", "Routine", "Scheduled", "Annual"),
                new PreventiveCare(UUID.randomUUID().toString(), patientId, "Healthy lifestyle review", "Hydration and balanced nutritional guidance", "Routine", "Active", "Ongoing")
        );
    }
}
