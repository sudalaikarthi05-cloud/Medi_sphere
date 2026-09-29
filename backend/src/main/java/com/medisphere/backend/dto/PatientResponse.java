package com.medisphere.backend.dto;

import com.medisphere.backend.model.LabReport;
import com.medisphere.backend.model.Patient;
import com.medisphere.backend.model.PreventiveCare;
import com.medisphere.backend.model.RiskAssessment;
import com.medisphere.backend.model.Vital;

import java.util.List;

public class PatientResponse {
    private Patient patient;
    private Vital currentVitals;
    private RiskAssessment riskAssessment;
    private List<LabReport> labReports;
    private List<PreventiveCare> preventiveCare;
    private String dataSource; // "LIVE_CLINICAL" or "SYNTHETIC_DEMO"

    public PatientResponse() {}

    public PatientResponse(Patient patient, Vital currentVitals, RiskAssessment riskAssessment, List<LabReport> labReports, List<PreventiveCare> preventiveCare, String dataSource) {
        this.patient = patient;
        this.currentVitals = currentVitals;
        this.riskAssessment = riskAssessment;
        this.labReports = labReports;
        this.preventiveCare = preventiveCare;
        this.dataSource = dataSource;
    }

    public Patient getPatient() { return patient; }
    public void setPatient(Patient patient) { this.patient = patient; }

    public Vital getCurrentVitals() { return currentVitals; }
    public void setCurrentVitals(Vital currentVitals) { this.currentVitals = currentVitals; }

    public RiskAssessment getRiskAssessment() { return riskAssessment; }
    public void setRiskAssessment(RiskAssessment riskAssessment) { this.riskAssessment = riskAssessment; }

    public List<LabReport> getLabReports() { return labReports; }
    public void setLabReports(List<LabReport> labReports) { this.labReports = labReports; }

    public List<PreventiveCare> getPreventiveCare() { return preventiveCare; }
    public void setPreventiveCare(List<PreventiveCare> preventiveCare) { this.preventiveCare = preventiveCare; }

    public String getDataSource() { return dataSource; }
    public void setDataSource(String dataSource) { this.dataSource = dataSource; }
}
