package com.medisphere.backend.kafka;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.medisphere.backend.model.Vital;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.kafka.core.KafkaTemplate;
import org.springframework.stereotype.Service;

@Service
public class VitalEventProducer {

    private static final Logger log = LoggerFactory.getLogger(VitalEventProducer.class);

    private final KafkaTemplate<String, String> kafkaTemplate;
    private final ObjectMapper objectMapper;

    @Value("${medisphere.simulation.kafka-enabled:false}")
    private boolean kafkaEnabled;

    public VitalEventProducer(KafkaTemplate<String, String> kafkaTemplate, ObjectMapper objectMapper) {
        this.kafkaTemplate = kafkaTemplate;
        this.objectMapper = objectMapper;
    }

    public void publishVitalUpdate(Vital vital) {
        try {
            String payload = objectMapper.writeValueAsString(vital);
            if (kafkaEnabled) {
                log.info("[KAFKA PRODUCER] Publishing real-time telemetry to {}: {}", KafkaConfig.TOPIC_VITALS, payload);
                kafkaTemplate.send(KafkaConfig.TOPIC_VITALS, vital.getPatientId(), payload);
            } else {
                log.debug("[KAFKA SIMULATOR] Stream event buffered for {}: HR={} BP={}",
                        vital.getPatientId(), vital.getHeartRate(), vital.getBloodPressureFormatted());
            }
        } catch (Exception e) {
            log.warn("Could not publish vital event to Kafka: {}", e.getMessage());
        }
    }

    public void publishAlert(String patientId, String severity, String message) {
        try {
            String payload = String.format("{\"patientId\":\"%s\",\"severity\":\"%s\",\"message\":\"%s\"}", patientId, severity, message);
            if (kafkaEnabled) {
                kafkaTemplate.send(KafkaConfig.TOPIC_ALERTS, patientId, payload);
            }
        } catch (Exception e) {
            log.warn("Could not publish alert to Kafka: {}", e.getMessage());
        }
    }
}
