package com.medisphere.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "audit_logs")
public class AuditLog {
    @Id
    private String id;
    private String action; // "READ_PATIENT", "UPDATE_VITALS", "CREATE_PATIENT", "LOGIN", "EXPORT_FHIR"
    private String resourceType; // "Patient", "Vital", "RiskAssessment"
    private String resourceId;
    private String performedBy;
    private String userRole;
    private String ipAddress;
    private String status; // "SUCCESS", "UNAUTHORIZED", "FAILED"
    private String details;
    private Instant timestamp;

    public AuditLog() {
        this.timestamp = Instant.now();
    }

    public AuditLog(String action, String resourceType, String resourceId, String performedBy, String userRole, String ipAddress, String status, String details) {
        this.action = action;
        this.resourceType = resourceType;
        this.resourceId = resourceId;
        this.performedBy = performedBy;
        this.userRole = userRole;
        this.ipAddress = ipAddress;
        this.status = status;
        this.details = details;
        this.timestamp = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getAction() { return action; }
    public void setAction(String action) { this.action = action; }

    public String getResourceType() { return resourceType; }
    public void setResourceType(String resourceType) { this.resourceType = resourceType; }

    public String getResourceId() { return resourceId; }
    public void setResourceId(String resourceId) { this.resourceId = resourceId; }

    public String getPerformedBy() { return performedBy; }
    public void setPerformedBy(String performedBy) { this.performedBy = performedBy; }

    public String getUserRole() { return userRole; }
    public void setUserRole(String userRole) { this.userRole = userRole; }

    public String getIpAddress() { return ipAddress; }
    public void setIpAddress(String ipAddress) { this.ipAddress = ipAddress; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getDetails() { return details; }
    public void setDetails(String details) { this.details = details; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
