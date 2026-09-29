package com.medisphere.backend.fhir;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@Component
public class SmartAuthConfig {

    @Value("${fhir.smart.client-id:medisphere-client}")
    private String clientId;

    @Value("${fhir.smart.authorize-url:http://localhost:8081/oauth/authorize}")
    private String authorizeUrl;

    @Value("${fhir.smart.token-url:http://localhost:8081/oauth/token}")
    private String tokenUrl;

    private static final List<String> SUPPORTED_SCOPES = List.of(
            "launch/patient",
            "patient/*.read",
            "user/*.read",
            "openid",
            "fhirUser",
            "offline_access"
    );

    public Map<String, Object> getConformanceStatement() {
        Map<String, Object> metadata = new HashMap<>();
        metadata.put("resourceType", "CapabilityStatement");
        metadata.put("status", "active");
        metadata.put("fhirVersion", "4.0.1");
        metadata.put("description", "Medisphere SMART on FHIR Security Conformance");

        Map<String, Object> security = new HashMap<>();
        security.put("service", List.of(Map.of("coding", List.of(Map.of(
                "system", "http://hl7.org/fhir/restful-security-service",
                "code", "SMART-on-FHIR"
        )))));

        Map<String, Object> extension = new HashMap<>();
        extension.put("authorize", authorizeUrl);
        extension.put("token", tokenUrl);
        extension.put("scopes", SUPPORTED_SCOPES);
        security.put("extension", extension);

        metadata.put("rest", List.of(Map.of("mode", "server", "security", security)));
        return metadata;
    }

    public String getClientId() { return clientId; }
    public String getAuthorizeUrl() { return authorizeUrl; }
    public String getTokenUrl() { return tokenUrl; }
    public List<String> getSupportedScopes() { return SUPPORTED_SCOPES; }
}
