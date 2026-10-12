package com.medisphere.backend.fhir;

import java.util.Map;

public class FhirObservationDto {
    private String resourceType = "Observation";
    private String id;
    private String status; // "final", "preliminary"
    private Map<String, Object> code; // LOINC coding
    private Map<String, Object> subject; // reference to Patient
    private String effectiveDateTime;
    private Map<String, Object> valueQuantity;

    public FhirObservationDto() {}

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Map<String, Object> getCode() { return code; }
    public void setCode(Map<String, Object> code) { this.code = code; }

    public Map<String, Object> getSubject() { return subject; }
    public void setSubject(Map<String, Object> subject) { this.subject = subject; }

    public String getEffectiveDateTime() { return effectiveDateTime; }
    public void setEffectiveDateTime(String effectiveDateTime) { this.effectiveDateTime = effectiveDateTime; }

    public Map<String, Object> getValueQuantity() { return valueQuantity; }
    public void setValueQuantity(Map<String, Object> valueQuantity) { this.valueQuantity = valueQuantity; }
}
