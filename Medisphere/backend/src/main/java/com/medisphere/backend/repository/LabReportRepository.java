package com.medisphere.backend.repository;

import com.medisphere.backend.model.LabReport;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface LabReportRepository extends MongoRepository<LabReport, String> {
    List<LabReport> findByPatientId(String patientId);
}
