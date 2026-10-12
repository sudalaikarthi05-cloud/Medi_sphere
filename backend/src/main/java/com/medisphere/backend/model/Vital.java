package com.medisphere.backend.model;

import org.springframework.data.annotation.Id;
import org.springframework.data.mongodb.core.mapping.Document;
import java.time.Instant;

@Document(collection = "vitals")
public class Vital {
    @Id
    private String id;
    private String patientId;
    private int heartRate; // bpm
    private int systolicBp; // mmHg
    private int diastolicBp; // mmHg
    private double spo2; // %
    private double temperature; // °F
    private String bloodPressureFormatted;
    private String status; // "Normal", "Attention", "Critical"
    private Instant timestamp;

    public Vital() {
        this.timestamp = Instant.now();
    }

    public Vital(String patientId, int heartRate, int systolicBp, int diastolicBp, double spo2, double temperature) {
        this.patientId = patientId;
        this.heartRate = heartRate;
        this.systolicBp = systolicBp;
        this.diastolicBp = diastolicBp;
        this.bloodPressureFormatted = systolicBp + "/" + diastolicBp + " mmHg";
        this.spo2 = spo2;
        this.temperature = temperature;
        this.timestamp = Instant.now();
        evaluateStatus();
    }

    public void evaluateStatus() {
        if (heartRate > 105 || heartRate < 50 || systolicBp > 150 || spo2 < 92 || temperature > 101.5) {
            this.status = "Attention";
        } else if (heartRate > 125 || systolicBp > 175 || spo2 < 88) {
            this.status = "Critical";
        } else {
            this.status = "Normal";
        }
        this.bloodPressureFormatted = systolicBp + "/" + diastolicBp + " mmHg";
    }

    // Getters and Setters
    public String getId() { return id; }
    public void setId(String id) { this.id = id; }

    public String getPatientId() { return patientId; }
    public void setPatientId(String patientId) { this.patientId = patientId; }

    public int getHeartRate() { return heartRate; }
    public void setHeartRate(int heartRate) { this.heartRate = heartRate; }

    public int getSystolicBp() { return systolicBp; }
    public void setSystolicBp(int systolicBp) { this.systolicBp = systolicBp; }

    public int getDiastolicBp() { return diastolicBp; }
    public void setDiastolicBp(int diastolicBp) { this.diastolicBp = diastolicBp; }

    public double getSpo2() { return spo2; }
    public void setSpo2(double spo2) { this.spo2 = spo2; }

    public double getTemperature() { return temperature; }
    public void setTemperature(double temperature) { this.temperature = temperature; }

    public String getBloodPressureFormatted() { return bloodPressureFormatted; }
    public void setBloodPressureFormatted(String bloodPressureFormatted) { this.bloodPressureFormatted = bloodPressureFormatted; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }

    public Instant getTimestamp() { return timestamp; }
    public void setTimestamp(Instant timestamp) { this.timestamp = timestamp; }
}
