package com.medisphere.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.LocalDate;

@Document(collection = "lab_reports")
public class LabReport {
    @Id
    private String id;
    private String patientId;
    private String testName;
    private String value;
    private String unit;
    private String status; // "Normal", "Attention", "Elevated", "Critical"
    private String referenceRange;
    private String date;

    public LabReport() {}

    public LabReport(String id, String patientId, String testName, String value, String unit, String status, String referenceRange, String date) {
        this.id = id;
        this.patientId = patientId;
        this.testName = testName;
        this.value = value;
        this.unit = unit;
        this.status = status;
        this.referenceRange = referenceRange;
        this.date = date;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getTestName() { return testName; }
    public void setTestName(String testName) { this.testName = testName; }

    public String getValue() { return value; }
    public void setValue(String value) { this.value = value; }

    public String getUnit() { return unit; }
    public void setUnit(String unit) { this.unit = unit; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getReferenceRange() { return referenceRange; }
    public void setReferenceRange(String referenceRange) { this.referenceRange = referenceRange; }

    public String getDate() { return date; }
    public void setDate(String date) { this.date = date; }
}
