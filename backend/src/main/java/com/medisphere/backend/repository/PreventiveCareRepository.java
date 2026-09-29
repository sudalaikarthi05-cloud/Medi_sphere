package com.medisphere.backend.repository;

import com.medisphere.backend.model.PreventiveCare;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface PreventiveCareRepository extends MongoRepository<PreventiveCare, String> {
    List<PreventiveCare> findByPatientId(String patientId);
}
