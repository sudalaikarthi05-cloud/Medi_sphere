package com.medisphere.backend.repository;

import com.medisphere.backend.model.Vital;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;
import java.util.Optional;

@Repository
public interface VitalRepository extends MongoRepository<Vital, String> {
    List<Vital> findByPatientIdOrderByTimestampDesc(String patientId);
    Optional<Vital> findFirstByPatientIdOrderByTimestampDesc(String patientId);
}
