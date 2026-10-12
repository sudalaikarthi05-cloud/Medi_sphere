package com.medisphere.backend.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medisphere.backend.model.Vital;
import com.medisphere.backend.repository.VitalRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.kafka.annotation.KafkaListener;
import org.springframework.stereotype.Service;

@Service
@ConditionalOnProperty(name = "medisphere.simulation.kafka-enabled", havingValue = "true", matchIfMissing = false)
public class VitalEventConsumer {

    private static final Logger log = LoggerFactory.getLogger(VitalEventConsumer.class);

    private final VitalRepository vitalRepository;
    private final ObjectMapper objectMapper;

    public VitalEventConsumer(VitalRepository vitalRepository, ObjectMapper objectMapper) {
        this.vitalRepository = vitalRepository;
        this.objectMapper = objectMapper;
    }

    @KafkaListener(topics = KafkaConfig.TOPIC_VITALS, groupId = "medisphere-group")
    public void consumeVitalTelemetry(String message) {
        try {
            log.info("[KAFKA CONSUMER] Ingested real-time patient telemetry: {}", message);
            Vital vital = objectMapper.readValue(message, Vital.class);
            vital.evaluateStatus();
            vitalRepository.save(vital);
        } catch (Exception e) {
            log.error("Failed to parse and store real-time vital telemetry: {}", e.getMessage());
        }
    }

    @KafkaListener(topics = KafkaConfig.TOPIC_ALERTS, groupId = "medisphere-group")
    public void consumeClinicalAlert(String message) {
        log.warn("[KAFKA CONSUMER] CRITICAL CLINICAL ALERT RECEIVED: {}", message);
    }
}
