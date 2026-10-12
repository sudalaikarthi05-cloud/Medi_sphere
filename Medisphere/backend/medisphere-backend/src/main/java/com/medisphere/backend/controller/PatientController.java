package com.medisphere.backend.controller;

import com.medisphere.backend.model.Patient;
import com.medisphere.backend.service.PatientService;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin(origins = "http://localhost:5173")
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    // Get all patients
    @GetMapping
    public List<Patient> getAllPatients() {
        return patientService.getAllPatients();
    }

    // Get patient by ID
    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable String id) {

        return patientService.getPatientById(id)
                .map(ResponseEntity::ok)
                .orElse(ResponseEntity.notFound().build());
    }

    // Add patient
    @PostMapping
    public ResponseEntity<Patient> addPatient(
            @RequestBody Patient patient) {

        Patient savedPatient = patientService.addPatient(patient);

        return ResponseEntity.ok(savedPatient);
    }

    // Update patient
    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(
            @PathVariable String id,
            @RequestBody Patient patient) {

        Patient updatedPatient =
                patientService.updatePatient(id, patient);

        if (updatedPatient == null) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.ok(updatedPatient);
    }

    // Delete patient
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(
            @PathVariable String id) {

        boolean deleted = patientService.deletePatient(id);

        if (!deleted) {
            return ResponseEntity.notFound().build();
        }

        return ResponseEntity.noContent().build();
    }
}