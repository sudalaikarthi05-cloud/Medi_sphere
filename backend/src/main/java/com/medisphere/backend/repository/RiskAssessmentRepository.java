package com.medisphere.backend.repository;

import com.medisphere.backend.model.RiskAssessment;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface RiskAssessmentRepository extends MongoRepository<RiskAssessment, String> {
    List<RiskAssessment> findByPatientIdOrderByEvaluatedAtDesc(String patientId);
    Optional<RiskAssessment> findFirstByPatientIdOrderByEvaluatedAtDesc(String patientId);
}
