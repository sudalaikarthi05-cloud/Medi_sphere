package com.medisphere.backend.controller;

import com.medisphere.backend.dto.VitalResponse;
import com.medisphere.backend.kafka.DemoEventGenerator;
import com.medisphere.backend.kafka.VitalEventProducer;
import com.medisphere.backend.model.Vital;
import com.medisphere.backend.security.AccessControlService;
import com.medisphere.backend.service.VitalService;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/patients/{id}/vitals")
@CrossOrigin
public class VitalController {

    private final VitalService vitalService;
    private final VitalEventProducer producer;
    private final DemoEventGenerator demoEventGenerator;
    private final AccessControlService accessControlService;

    @Value("${medisphere.simulation.kafka-enabled:false}")
    private boolean kafkaEnabled;

    public VitalController(VitalService vitalService,
                           VitalEventProducer producer,
                           DemoEventGenerator demoEventGenerator,
                           AccessControlService accessControlService) {
        this.vitalService = vitalService;
        this.producer = producer;
        this.demoEventGenerator = demoEventGenerator;
        this.accessControlService = accessControlService;
    }

    @GetMapping
    public ResponseEntity<VitalResponse> getVitals(@PathVariable("id") String patientId) {
        accessControlService.requireAccess(patientId);
        Vital vital = vitalService.getLatestVitals(patientId);
        String source = kafkaEnabled ? "KAFKA_STREAM" : "DEMO_SIMULATOR";
        return ResponseEntity.ok(new VitalResponse(vital, true, source));
    }

    @PostMapping
    public ResponseEntity<Vital> updateVitals(@PathVariable("id") String patientId, @RequestBody Vital vital) {
        accessControlService.requireAccess(patientId);
        vital.setPatientId(patientId);
        Vital updated = vitalService.updateVitals(vital);
        producer.publishVitalUpdate(updated);
        return ResponseEntity.ok(updated);
    }

    @PostMapping("/simulate")
    public ResponseEntity<VitalResponse> simulateTelemetry(@PathVariable("id") String patientId) {
        accessControlService.requireAccess(patientId);
        Vital simulated = demoEventGenerator.generateSimulatedTelemetry(patientId);
        vitalService.updateVitals(simulated);
        String source = kafkaEnabled ? "KAFKA_STREAM" : "DEMO_SIMULATOR";
        return ResponseEntity.ok(new VitalResponse(simulated, true, source));
    }
}