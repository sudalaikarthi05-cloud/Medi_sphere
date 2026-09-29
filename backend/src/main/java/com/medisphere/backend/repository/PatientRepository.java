package com.medisphere.backend.repository;

import com.medisphere.backend.model.Patient;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PatientRepository extends MongoRepository<Patient, String> {
    List<Patient> findByNameContainingIgnoreCase(String name);
    List<Patient> findByConditionContainingIgnoreCase(String condition);
    List<Patient> findByStatus(String status);
    List<Patient> findByRiskLevel(String riskLevel);
}
