package com.medisphere.backend.controller;

import com.medisphere.backend.audit.AuditService;
import com.medisphere.backend.dto.HealthStatusResponse;
import com.medisphere.backend.model.AuditLog;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/health")
@CrossOrigin
public class HealthController {

    private final AuditService auditService;

    @Value("${medisphere.simulation.kafka-enabled:false}")
    private boolean kafkaEnabled;

    @Value("${medisphere.simulation.mongodb-enabled:false}")
    private boolean mongodbEnabled;

    public HealthController(AuditService auditService) {
        this.auditService = auditService;
    }

    @GetMapping
    public ResponseEntity<Map<String, Object>> getHealth() {
        Map<String, Object> health = new HashMap<>();
        health.put("status", "UP");
        health.put("platform", "Medisphere Cognitive Twin");
        health.put("version", "2.0.0-PROD");
        health.put("timestamp", java.time.Instant.now().toString());
        return ResponseEntity.ok(health);
    }

    @GetMapping("/status")
    public ResponseEntity<HealthStatusResponse> getSystemStatus() {
        Map<String, String> services = new HashMap<>();
        services.put("mongodb", mongodbEnabled ? "ONLINE" : "DEMO_REHYDRATED");
        services.put("kafka", kafkaEnabled ? "CONNECTED" : "DEMO_REALTIME_ACTIVE");
        services.put("fhir", "SMART_CAPABLE");
        services.put("ai", "TFF_FEDAVG_READY");
        services.put("security", "HIPAA_AUDIT_ACTIVE");

        HealthStatusResponse response = new HealthStatusResponse(
                "UP",
                "2.0.0-PROD",
                "Clinical Intelligence Demo",
                services,
                !mongodbEnabled || !kafkaEnabled
        );
        return ResponseEntity.ok(response);
    }

    @GetMapping("/audit-logs")
    public ResponseEntity<List<AuditLog>> getAuditLogs() {
        return ResponseEntity.ok(auditService.getRecentAuditLogs());
    }
}
