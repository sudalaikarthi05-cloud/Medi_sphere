package com.medisphere.backend.controller;

import com.medisphere.backend.dto.RiskResponse;
import com.medisphere.backend.model.RiskAssessment;
import com.medisphere.backend.security.AccessControlService;
import com.medisphere.backend.service.RiskService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/{id}")
@CrossOrigin
public class RiskController {

    private final RiskService riskService;
    private final AccessControlService accessControlService;

    public RiskController(RiskService riskService, AccessControlService accessControlService) {
        this.riskService = riskService;
        this.accessControlService = accessControlService;
    }

    @GetMapping("/risk")
    public ResponseEntity<RiskAssessment> getRiskAssessment(@PathVariable("id") String patientId) {
        accessControlService.requireAccess(patientId);
        RiskAssessment risk = riskService.getLatestRisk(patientId);
        return ResponseEntity.ok(risk);
    }

    @GetMapping("/insights")
    public ResponseEntity<RiskResponse> getClinicalInsights(@PathVariable("id") String patientId) {
        accessControlService.requireAccess(patientId);
        RiskAssessment risk = riskService.getLatestRisk(patientId);
        List<String> insights = riskService.getClinicalInsights(patientId);
        return ResponseEntity.ok(new RiskResponse(risk, insights));
    }
}