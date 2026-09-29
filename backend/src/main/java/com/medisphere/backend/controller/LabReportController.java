package com.medisphere.backend.controller;

import com.medisphere.backend.model.LabReport;
import com.medisphere.backend.model.PreventiveCare;
import com.medisphere.backend.service.LabReportService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/patients/{id}")
@CrossOrigin
public class LabReportController {

    private final LabReportService labReportService;

    public LabReportController(LabReportService labReportService) {
        this.labReportService = labReportService;
    }

    @GetMapping("/labs")
    public ResponseEntity<List<LabReport>> getLabReports(@PathVariable("id") String patientId) {
        List<LabReport> labs = labReportService.getLabsByPatientId(patientId);
        return ResponseEntity.ok(labs);
    }

    @GetMapping("/preventive-care")
    public ResponseEntity<List<PreventiveCare>> getPreventiveCare(@PathVariable("id") String patientId) {
        List<PreventiveCare> carePlans = labReportService.getPreventiveCare(patientId);
        return ResponseEntity.ok(carePlans);
    }
}
