package com.medisphere.backend.service;

import com.medisphere.backend.model.Patient;
import com.medisphere.backend.repository.PatientRepository;

import org.springframework.stereotype.Service;

import java.util.List;
import java.util.Optional;

@Service
public class PatientService {

    private final PatientRepository patientRepository;

    public PatientService(PatientRepository patientRepository) {
        this.patientRepository = patientRepository;
    }

    // Get all patients
    public List<Patient> getAllPatients() {
        return patientRepository.findAll();
    }

    // Get patient by ID
    public Optional<Patient> getPatientById(String id) {
        return patientRepository.findById(id);
    }

    // Add new patient
    public Patient addPatient(Patient patient) {
        return patientRepository.save(patient);
    }

    // Update patient
    public Patient updatePatient(String id, Patient updatedPatient) {

        Optional<Patient> existingPatient = patientRepository.findById(id);

        if (existingPatient.isPresent()) {

            Patient patient = existingPatient.get();

            patient.setName(updatedPatient.getName());
            patient.setAge(updatedPatient.getAge());
            patient.setGender(updatedPatient.getGender());
            patient.setCondition(updatedPatient.getCondition());

            return patientRepository.save(patient);
        }

        return null;
    }

    // Delete patient
    public boolean deletePatient(String id) {

        if (patientRepository.existsById(id)) {
            patientRepository.deleteById(id);
            return true;
        }

        return false;
    }
}