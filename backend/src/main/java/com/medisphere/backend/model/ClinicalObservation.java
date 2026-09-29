package com.medisphere.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "clinical_observations")
public class ClinicalObservation {
    @Id
    private String id;
    private String patientId;
    private String category; // "vital-signs", "laboratory", "exam"
    private String code;     // LOINC or SNOMED-CT code
    private String display;
    private String value;
    private String unit;
    private Instant effectiveDateTime;

    public ClinicalObservation() {
        this.effectiveDateTime = Instant.now();
    }

    public ClinicalObservation(String patientId, String category, String code, String display, String value, String unit) {
        this.patientId = patientId;
        this.category = category;
        this.code = code;
        this.display = display;
        this.value = value;
        this.unit = unit;
        this.effectiveDateTime = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getCategory() { return category; }
    public void setCategory(String category) { this.category = category; }

    public String getCode() { return code; }
    public void setCode(String code) { this.code = code; }

    public String getDisplay() { return display; }
    public void setDisplay(String display) { this.display = display; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public Instant getEffectiveDateTime() { return effectiveDateTime; }
    public void setEffectiveDateTime(Instant effectiveDateTime) { this.effectiveDateTime = effectiveDateTime; }
}
