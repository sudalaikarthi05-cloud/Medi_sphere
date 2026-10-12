package com.medisphere.backend.audit;

import com.medisphere.backend.model.AuditLog;
import com.medisphere.backend.repository.AuditLogRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class AuditService {

    private static final Logger log = LoggerFactory.getLogger(AuditService.class);
    private final AuditLogRepository auditLogRepository;

    public AuditService(AuditLogRepository auditLogRepository) {
        this.auditLogRepository = auditLogRepository;
    }

    public void logAction(String action, String resourceType, String resourceId, String performedBy, String userRole, String ipAddress, String status, String details) {
        AuditLog auditLog = new AuditLog(action, resourceType, resourceId, performedBy, userRole, ipAddress, status, details);
        log.info("[HIPAA AUDIT] Action: {} | Resource: {}:{} | PerformedBy: {} ({}) | Status: {}",
                action, resourceType, resourceId, performedBy, userRole, status);
        try {
            auditLogRepository.save(auditLog);
        } catch (Exception e) {
            // Graceful non-blocking degradation if database is temporarily unavailable in standalone demo mode
            log.debug("AuditLog persistence note (running in memory/demo mode): {}", e.getMessage());
        }
    }

    public List<AuditLog> getRecentAuditLogs() {
        try {
            return auditLogRepository.findTop50ByOrderByTimestampDesc();
        } catch (Exception e) {
            return List.of();
        }
    }
}
