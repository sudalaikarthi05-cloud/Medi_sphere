package com.medisphere.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;

@Document(collection = "preventive_care")
public class PreventiveCare {
    @Id
    private String id;
    private String patientId;
    private String title;
    private String description;
    private String priority; // "High", "Medium", "Routine"
    private String status; // "Scheduled", "Pending", "Active", "Completed"
    private String interval;

    public PreventiveCare() {}

    public PreventiveCare(String id, String patientId, String title, String description, String priority, String status, String interval) {
        this.id = id;
        this.patientId = patientId;
        this.title = title;
        this.description = description;
        this.priority = priority;
        this.status = status;
        this.interval = interval;
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getDescription() { return description; }
    public void setDescription(String description) { this.description = description; }

    public String getPriority() { return priority; }
    public void setPriority(String priority) { this.priority = priority; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getInterval() { return interval; }
    public void setInterval(String interval) { this.interval = interval; }
}
