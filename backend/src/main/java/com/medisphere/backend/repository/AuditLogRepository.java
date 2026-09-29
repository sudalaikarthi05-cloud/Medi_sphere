package com.medisphere.backend.repository;

import com.medisphere.backend.model.AuditLog;
import org.springframework.data.mongodb.repository.MongoRepository;
import org.springframework.stereotype.Repository;
import java.util.List;

@Repository
public interface AuditLogRepository extends MongoRepository<AuditLog, String> {
    List<AuditLog> findByResourceIdOrderByTimestampDesc(String resourceId);
    List<AuditLog> findTop50ByOrderByTimestampDesc();
}
