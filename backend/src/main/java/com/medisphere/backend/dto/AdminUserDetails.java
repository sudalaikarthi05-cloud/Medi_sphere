package com.medisphere.backend.dto;

import com.medisphere.backend.model.Booking;
import com.medisphere.backend.model.Patient;
import java.util.List;

public class AdminUserDetails {
    private List<Patient> patients;
    private List<Booking> bookings;
    
    public AdminUserDetails() {}
    
    public AdminUserDetails(List<Patient> patients, List<Booking> bookings) {
        this.patients = patients;
        this.bookings = bookings;
    }
    
    public List<Patient> getPatients() { return patients; }
    public void setPatients(List<Patient> patients) { this.patients = patients; }
    
    public List<Booking> getBookings() { return bookings; }
    public void setBookings(List<Booking> bookings) { this.bookings = bookings; }
}