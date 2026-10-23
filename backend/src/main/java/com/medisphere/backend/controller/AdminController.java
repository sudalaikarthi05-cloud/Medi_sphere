package com.medisphere.backend.controller;

import com.medisphere.backend.dto.AdminUserDetails;
import com.medisphere.backend.dto.UserDto;
import com.medisphere.backend.model.Booking;
import com.medisphere.backend.model.Patient;
import com.medisphere.backend.service.AdminService;
import org.springframework.http.ResponseEntity;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin")
@CrossOrigin
@PreAuthorize("hasRole('ADMIN')")
public class AdminController {

    private final AdminService adminService;

    public AdminController(AdminService adminService) {
        this.adminService = adminService;
    }

    @GetMapping("/users")
    public ResponseEntity<List<UserDto>> getUsers() {
        return ResponseEntity.ok(adminService.listUsers());
    }

    @GetMapping("/users/{email}/details")
    public ResponseEntity<AdminUserDetails> getUserDetails(@PathVariable String email) {
        return ResponseEntity.ok(adminService.getUserDetails(email));
    }

    @GetMapping("/patients")
    public ResponseEntity<List<Patient>> getAllPatients(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String risk,
            @RequestParam(required = false) String owner) {
        return ResponseEntity.ok(adminService.getAllPatients(search, condition, status, risk, owner));
    }

    @GetMapping("/patients/active-count")
    public ResponseEntity<Long> getActivePatientCount() {
        return ResponseEntity.ok(adminService.countActivePatients());
    }

    @GetMapping("/bookings")
    public ResponseEntity<List<Booking>> getAllBookings(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String owner) {
        return ResponseEntity.ok(adminService.getAllBookings(search, status, owner));
    }
}