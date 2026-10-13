package com.medisphere.backend.controller;

import com.medisphere.backend.model.LabReport;
import com.medisphere.backend.model.PreventiveCare;
import com.medisphere.backend.security.AccessControlService;
import com.medisphere.backend.service.LabReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/{id}")
@CrossOrigin
public class LabReportController {

    private final LabReportService labReportService;
    private final AccessControlService accessControlService;

    public LabReportController(LabReportService labReportService, AccessControlService accessControlService) {
        this.labReportService = labReportService;
        this.accessControlService = accessControlService;
    }

    @GetMapping("/labs")
    public ResponseEntity<List<LabReport>> getLabReports(@PathVariable("id") String patientId) {
        accessControlService.requireAccess(patientId);
        List<LabReport> labs = labReportService.getLabsByPatientId(patientId);
        return ResponseEntity.ok(labs);
    }

    @GetMapping("/preventive-care")
    public ResponseEntity<List<PreventiveCare>> getPreventiveCare(@PathVariable("id") String patientId) {
        accessControlService.requireAccess(patientId);
        List<PreventiveCare> carePlans = labReportService.getPreventiveCare(patientId);
        return ResponseEntity.ok(carePlans);
    }
}