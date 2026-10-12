package com.medisphere.backend.config;

import org.springframework.context.annotation.Configuration;
import org.springframework.data.mongodb.config.EnableMongoAuditing;
import org.springframework.data.mongodb.repository.config.EnableMongoRepositories;

@Configuration
@EnableMongoRepositories(basePackages = "com.medisphere.backend.repository")
@EnableMongoAuditing
public class MongoConfig {
    // Custom converters, field-level encryption converters for HIPAA Vault, or lifecycle hooks can be configured here
}
