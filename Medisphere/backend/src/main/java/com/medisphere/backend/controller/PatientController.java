package com.medisphere.backend.controller;

import com.medisphere.backend.dto.PatientRequest;
import com.medisphere.backend.dto.PatientResponse;
import com.medisphere.backend.model.Patient;
import com.medisphere.backend.service.PatientService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients")
@CrossOrigin
public class PatientController {

    private final PatientService patientService;

    public PatientController(PatientService patientService) {
        this.patientService = patientService;
    }

    @GetMapping
    public ResponseEntity<List<Patient>> getPatients(
            @RequestParam(required = false) String search,
            @RequestParam(required = false) String condition,
            @RequestParam(required = false) String status,
            @RequestParam(required = false) String risk) {
        List<Patient> patients = patientService.getAllPatients(search, condition, status, risk);
        return ResponseEntity.ok(patients);
    }

    @GetMapping("/{id}")
    public ResponseEntity<Patient> getPatientById(@PathVariable String id) {
        Patient patient = patientService.getPatientById(id);
        return ResponseEntity.ok(patient);
    }

    @GetMapping("/{id}/360")
    public ResponseEntity<PatientResponse> getPatient360(@PathVariable String id) {
        PatientResponse response = patientService.getPatient360(id);
        return ResponseEntity.ok(response);
    }

    @PostMapping
    public ResponseEntity<Patient> createPatient(@Valid @RequestBody PatientRequest request) {
        Patient created = patientService.createPatient(request);
        return new ResponseEntity<>(created, HttpStatus.CREATED);
    }

    @PutMapping("/{id}")
    public ResponseEntity<Patient> updatePatient(@PathVariable String id, @Valid @RequestBody PatientRequest request) {
        Patient updated = patientService.updatePatient(id, request);
        return ResponseEntity.ok(updated);
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deletePatient(@PathVariable String id) {
        patientService.deletePatient(id);
        return ResponseEntity.noContent().build();
    }
}
