package com.medisphere.backend.security;

import com.medisphere.backend.exception.ResourceNotFoundException;
import com.medisphere.backend.model.Patient;
import com.medisphere.backend.repository.PatientRepository;
import org.springframework.stereotype.Service;

/**
 * Central ownership enforcement. Admins bypass ownership checks; a normal user
 * may only touch patients they own. Unauthorized access always surfaces as 404
 * so the existence of another user's record is never revealed.
 */
@Service
public class AccessControlService {

    private final PatientRepository patientRepository;
    private final CurrentUserService currentUserService;

    public AccessControlService(PatientRepository patientRepository, CurrentUserService currentUserService) {
        this.patientRepository = patientRepository;
        this.currentUserService = currentUserService;
    }

    public String currentEmail() {
        return currentUserService.getEmail();
    }

    public boolean isAdmin() {
        return currentUserService.isAdmin();
    }

    /** Throws 404 unless the current user owns the patient (admins bypass). */
    public void assertCanAccess(Patient patient) {
        if (patient == null) {
            throw new ResourceNotFoundException("Patient was not found in the clinical registry.");
        }
        if (isAdmin()) {
            return;
        }
        String email = currentEmail();
        if (patient.getOwnerEmail() == null || !patient.getOwnerEmail().equalsIgnoreCase(email)) {
            throw new ResourceNotFoundException("Patient with ID " + patient.getId() + " was not found in the clinical registry.");
        }
    }

    /** Loads a live (non-deleted) patient and verifies the caller owns it. */
    public Patient requireAccess(String patientId) {
        Patient patient = patientRepository.findByIdAndIsDeleted(patientId, 0)
                .orElseThrow(() -> new ResourceNotFoundException(
                        "Patient with ID " + patientId + " was not found in the clinical registry."));
        assertCanAccess(patient);
        return patient;
    }
}