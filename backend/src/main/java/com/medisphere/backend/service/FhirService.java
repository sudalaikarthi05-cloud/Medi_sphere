package com.medisphere.backend.service;

import com.medisphere.backend.fhir.FhirObservationDto;
import com.medisphere.backend.fhir.FhirPatientDto;
import com.medisphere.backend.model.Patient;
import com.medisphere.backend.model.Vital;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
public class FhirService {

    private final PatientService patientService;
    private final VitalService vitalService;

    public FhirService(PatientService patientService, VitalService vitalService) {
        this.patientService = patientService;
        this.vitalService = vitalService;
    }

    public FhirPatientDto exportToFhirPatient(String patientId) {
        Patient patient = patientService.getPatientById(patientId);

        FhirPatientDto fhirPatient = new FhirPatientDto();
        fhirPatient.setId(patient.getId());
        fhirPatient.setActive(!"Discharged".equalsIgnoreCase(patient.getStatus()));
        fhirPatient.setGender(patient.getGender().toLowerCase());
        fhirPatient.setBirthDate(calculateBirthYear(patient.getAge()) + "-01-01");

        Map<String, Object> nameMap = new HashMap<>();
        nameMap.put("use", "official");
        nameMap.put("text", patient.getName());
        nameMap.put("family", extractFamilyName(patient.getName()));
        nameMap.put("given", List.of(extractGivenName(patient.getName())));
        fhirPatient.setName(List.of(nameMap));

        Map<String, Object> identifierMap = new HashMap<>();
        identifierMap.put("system", "https://medisphere.demo/patients");
        identifierMap.put("value", patient.getId());
        fhirPatient.setIdentifier(List.of(identifierMap));

        return fhirPatient;
    }

    public List<FhirObservationDto> exportToFhirObservations(String patientId) {
        Vital vitals = vitalService.getLatestVitals(patientId);
        List<FhirObservationDto> list = new ArrayList<>();

        // Heart Rate Observation (LOINC 8867-4)
        FhirObservationDto hr = new FhirObservationDto();
        hr.setId("obs-hr-" + patientId);
        hr.setStatus("final");
        hr.setSubject(Map.of("reference", "Patient/" + patientId));
        hr.setEffectiveDateTime(vitals.getTimestamp().toString());
        hr.setCode(Map.of(
                "coding", List.of(Map.of(
                        "system", "http://loinc.org",
                        "code", "8867-4",
                        "display", "Heart rate"
                )),
                "text", "Heart rate"
        ));
        hr.setValueQuantity(Map.of(
                "value", vitals.getHeartRate(),
                "unit", "beats/min",
                "system", "http://unitsofmeasure.org",
                "code", "/min"
        ));
        list.add(hr);

        // Blood Pressure Observation (LOINC 85354-9)
        FhirObservationDto bp = new FhirObservationDto();
        bp.setId("obs-bp-" + patientId);
        bp.setStatus("final");
        bp.setSubject(Map.of("reference", "Patient/" + patientId));
        bp.setEffectiveDateTime(vitals.getTimestamp().toString());
        bp.setCode(Map.of(
                "coding", List.of(Map.of(
                        "system", "http://loinc.org",
                        "code", "85354-9",
                        "display", "Blood pressure panel with all children optional"
                )),
                "text", "Blood pressure"
        ));
        bp.setValueQuantity(Map.of(
                "value", vitals.getSystolicBp(),
                "unit", "mmHg",
                "system", "http://unitsofmeasure.org",
                "code", "mm[Hg]"
        ));
        list.add(bp);

        return list;
    }

    private int calculateBirthYear(int age) {
        return 2026 - age;
    }

    private String extractGivenName(String fullName) {
        String[] parts = fullName.trim().split("\\s+");
        return parts[0];
    }

    private String extractFamilyName(String fullName) {
        String[] parts = fullName.trim().split("\\s+");
        return parts.length > 1 ? parts[parts.length - 1] : "";
    }
}
