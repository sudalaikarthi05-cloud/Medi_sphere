package com.medisphere.backend.dto;

import com.medisphere.backend.model.RiskAssessment;
import java.util.List;

public class RiskResponse {
    private RiskAssessment assessment;
    private List<String> clinicalInsights;
    private String legalNotice;

    public RiskResponse() {}

    public RiskResponse(RiskAssessment assessment, List<String> clinicalInsights) {
        this.assessment = assessment;
        this.clinicalInsights = clinicalInsights;
        this.legalNotice = "Synthetic healthcare data decision-support only. Not medically validated diagnosis.";
    }

    public RiskAssessment getAssessment() { return assessment; }
    public void setAssessment(RiskAssessment assessment) { this.assessment = assessment; }

    public List<String> getClinicalInsights() { return clinicalInsights; }
    public void setClinicalInsights(List<String> clinicalInsights) { this.clinicalInsights = clinicalInsights; }

    public String getLegalNotice() { return legalNotice; }
    public void setLegalNotice(String legalNotice) { this.legalNotice = legalNotice; }
}
