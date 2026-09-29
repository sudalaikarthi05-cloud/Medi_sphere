package com.medisphere.backend.kafka;

import org.apache.kafka.clients.admin.NewTopic;
import org.springframework.boot.autoconfigure.condition.ConditionalOnProperty;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.kafka.annotation.EnableKafka;
import org.springframework.kafka.config.TopicBuilder;

@Configuration
@EnableKafka
public class KafkaConfig {

    public static final String TOPIC_VITALS = "patient.vitals";
    public static final String TOPIC_OBSERVATIONS = "patient.observations";
    public static final String TOPIC_ALERTS = "patient.alerts";
    public static final String TOPIC_LAB_RESULTS = "patient.lab-results";
    public static final String TOPIC_RISK_UPDATES = "patient.risk-updates";

    @Bean
    @ConditionalOnProperty(name = "medisphere.simulation.kafka-enabled", havingValue = "true", matchIfMissing = false)
    public NewTopic topicVitals() {
        return TopicBuilder.name(TOPIC_VITALS).partitions(3).replicas(1).build();
    }

    @Bean
    @ConditionalOnProperty(name = "medisphere.simulation.kafka-enabled", havingValue = "true", matchIfMissing = false)
    public NewTopic topicObservations() {
        return TopicBuilder.name(TOPIC_OBSERVATIONS).partitions(3).replicas(1).build();
    }

    @Bean
    @ConditionalOnProperty(name = "medisphere.simulation.kafka-enabled", havingValue = "true", matchIfMissing = false)
    public NewTopic topicAlerts() {
        return TopicBuilder.name(TOPIC_ALERTS).partitions(3).replicas(1).build();
    }

    @Bean
    @ConditionalOnProperty(name = "medisphere.simulation.kafka-enabled", havingValue = "true", matchIfMissing = false)
    public NewTopic topicLabResults() {
        return TopicBuilder.name(TOPIC_LAB_RESULTS).partitions(3).replicas(1).build();
    }

    @Bean
    @ConditionalOnProperty(name = "medisphere.simulation.kafka-enabled", havingValue = "true", matchIfMissing = false)
    public NewTopic topicRiskUpdates() {
        return TopicBuilder.name(TOPIC_RISK_UPDATES).partitions(3).replicas(1).build();
    }
}
