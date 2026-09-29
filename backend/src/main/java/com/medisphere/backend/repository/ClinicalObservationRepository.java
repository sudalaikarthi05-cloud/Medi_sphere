package com.medisphere.backend.repository;

import com.medisphere.backend.model.ClinicalObservation;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface ClinicalObservationRepository extends MongoRepository<ClinicalObservation, String> {
    List<ClinicalObservation> findByPatientId(String patientId);
    List<ClinicalObservation> findByPatientIdAndCategory(String patientId, String category);
}
