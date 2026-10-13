package com.medisphere.backend.dto;

import java.time.Instant;

public class UserDto {
    private String name;
    private String email;
    private String role;
    private Instant joinedDate;
    private long patientCount;
    private long bookingCount;
    
    public UserDto() {}
    
    // Getters and Setters
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public Instant getJoinedDate() { return joinedDate; }
    public void setJoinedDate(Instant joinedDate) { this.joinedDate = joinedDate; }
    
    public long getPatientCount() { return patientCount; }
    public void setPatientCount(long patientCount) { this.patientCount = patientCount; }
    
    public long getBookingCount() { return bookingCount; }
    public void setBookingCount(long bookingCount) { this.bookingCount = bookingCount; }
}