package com.medisphere.backend.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.Instant;

public class BookingRequest {
    @NotBlank
    private String patientId;
    private String doctor;
    private String department;
    @NotNull
    private Instant appointmentDateTime;
    private String reason;
    private String status;
    
    public BookingRequest() {}
    
    // Getters and Setters
    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }
    
    public String getDoctor() { return doctor; }
    public void setDoctor(String doctor) { this.doctor = doctor; }
    
    public String getDepartment() { return department; }
    public void setDepartment(String department) { this.department = department; }
    
    public Instant getAppointmentDateTime() { return appointmentDateTime; }
    public void setAppointmentDateTime(Instant appointmentDateTime) { this.appointmentDateTime = appointmentDateTime; }
    
    public String getReason() { return reason; }
    public void setReason(String reason) { this.reason = reason; }
    
    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}