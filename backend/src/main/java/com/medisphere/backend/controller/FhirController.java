package com.medisphere.backend.controller;

import com.medisphere.backend.fhir.FhirObservationDto;
import com.medisphere.backend.fhir.FhirPatientDto;
import com.medisphere.backend.fhir.SmartAuthConfig;
import com.medisphere.backend.service.FhirService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/fhir")
@CrossOrigin
public class FhirController {

    private final FhirService fhirService;
    private final SmartAuthConfig smartAuthConfig;

    public FhirController(FhirService fhirService, SmartAuthConfig smartAuthConfig) {
        this.fhirService = fhirService;
        this.smartAuthConfig = smartAuthConfig;
    }

    @GetMapping("/metadata")
    public ResponseEntity<Map<String, Object>> getCapabilityStatement() {
        return ResponseEntity.ok(smartAuthConfig.getConformanceStatement());
    }

    @GetMapping("/Patient/{id}")
    public ResponseEntity<FhirPatientDto> getFhirPatient(@PathVariable String id) {
        FhirPatientDto fhirPatient = fhirService.exportToFhirPatient(id);
        return ResponseEntity.ok(fhirPatient);
    }

    @GetMapping("/Observation")
    public ResponseEntity<List<FhirObservationDto>> getFhirObservations(@RequestParam(name = "patient") String patientId) {
        List<FhirObservationDto> observations = fhirService.exportToFhirObservations(patientId);
        return ResponseEntity.ok(observations);
    }
}
