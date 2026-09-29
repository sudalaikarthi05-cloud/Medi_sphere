package com.medisphere.backend.fhir;

import java.util.List;
import java.util.Map;

public class FhirPatientDto {
    private String resourceType = "Patient";
    private String id;
    private List<Map<String, Object>> identifier;
    private boolean active;
    private List<Map<String, Object>> name;
    private String gender;
    private String birthDate;

    public FhirPatientDto() {}

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public List<Map<String, Object>> getIdentifier() { return identifier; }
    public void setIdentifier(List<Map<String, Object>> identifier) { this.identifier = identifier; }

    public boolean isActive() { return active; }
    public void setActive(boolean active) { this.active = active; }

    public List<Map<String, Object>> getName() { return name; }
    public void setName(List<Map<String, Object>> name) { this.name = name; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getBirthDate() { return birthDate; }
    public void setBirthDate(String birthDate) { this.birthDate = birthDate; }
}
