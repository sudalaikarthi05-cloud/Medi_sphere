package com.medisphere.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;
import java.util.List;

@Document(collection = "risk_assessments")
public class RiskAssessment {
    @Id
    private String id;
    private String patientId;
    private String level; // "LOW", "MEDIUM", "HIGH"
    private int score; // 0-100
    private String message;
    private List<String> contributingFactors;
    private List<String> recommendations;
    private String insightLabel; // "AI-Assisted Insight"
    private String disclaimer;
    private String modelArchitecture; // "Federated Global Model (TFF FedAvg)"
    private Instant evaluatedAt;

    public RiskAssessment() {
        this.evaluatedAt = Instant.now();
        this.insightLabel = "AI-Assisted Insight";
        this.disclaimer = "AI-generated decision-support information based on synthetic healthcare data. This is not a medically validated diagnosis.";
    }

    public RiskAssessment(String patientId, String level, int score, String message, List<String> contributingFactors, List<String> recommendations) {
        this.patientId = patientId;
        this.level = level;
        this.score = score;
        this.message = message;
        this.contributingFactors = contributingFactors;
        this.recommendations = recommendations;
        this.insightLabel = "AI-Assisted Insight";
        this.disclaimer = "AI-generated decision-support information based on synthetic healthcare data. This is not a medically validated diagnosis.";
        this.modelArchitecture = "TensorFlow Federated Aggregation (FedAvg across synthetic hospital nodes)";
        this.evaluatedAt = Instant.now();
    }

    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public String getLevel() { return level; }
    public void setLevel(String level) { this.level = level; }

    public int getScore() { return score; }
    public void setScore(int score) { this.score = score; }

    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }

    public List<String> getContributingFactors() { return contributingFactors; }
    public void setContributingFactors(List<String> contributingFactors) { this.contributingFactors = contributingFactors; }

    public List<String> getRecommendations() { return recommendations; }
    public void setRecommendations(List<String> recommendations) { this.recommendations = recommendations; }

    public String getInsightLabel() { return insightLabel; }
    public void setInsightLabel(String insightLabel) { this.insightLabel = insightLabel; }

    public String getDisclaimer() { return disclaimer; }
    public void setDisclaimer(String disclaimer) { this.disclaimer = disclaimer; }

    public String getModelArchitecture() { return modelArchitecture; }
    public void setModelArchitecture(String modelArchitecture) { this.modelArchitecture = modelArchitecture; }

    public Instant getEvaluatedAt() { return evaluatedAt; }
    public void setEvaluatedAt(Instant evaluatedAt) { this.evaluatedAt = evaluatedAt; }
}
