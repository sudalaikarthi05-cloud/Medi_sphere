package com.medisphere.backend.dto;

import java.util.Map;

public class HealthStatusResponse {
    private String status; // "UP", "DEGRADED", "DEMO_MODE"
    private String version;
    private String environment;
    private Map<String, String> services; // "mongodb": "UP"/"DEMO", "kafka": "UP"/"DEMO", "fhir": "UP"/"MOCKED", "ai": "AVAILABLE"
    private boolean demoMode;

    public HealthStatusResponse() {}

    public HealthStatusResponse(String status, String version, String environment, Map<String, String> services, boolean demoMode) {
        this.status = status;
        this.version = version;
        this.environment = environment;
        this.services = services;
        this.demoMode = demoMode;
    }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public String getVersion() { return version; }
    public void setVersion(String version) { this.version = version; }

    public String getEnvironment() { return environment; }
    public void setEnvironment(String environment) { this.environment = environment; }

    public Map<String, String> getServices() { return services; }
    public void setServices(Map<String, String> services) { this.services = services; }

    public boolean isDemoMode() { return demoMode; }
    public void setDemoMode(boolean demoMode) { this.demoMode = demoMode; }
}
