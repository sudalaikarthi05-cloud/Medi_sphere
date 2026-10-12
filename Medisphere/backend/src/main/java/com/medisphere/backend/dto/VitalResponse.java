package com.medisphere.backend.dto;

import com.medisphere.backend.model.Vital;

public class VitalResponse {
    private Vital vital;
    private boolean isRealTime;
    private String source; // "KAFKA_STREAM" or "DEMO_SIMULATOR"

    public VitalResponse() {}

    public VitalResponse(Vital vital, boolean isRealTime, String source) {
        this.vital = vital;
        this.isRealTime = isRealTime;
        this.source = source;
    }

    public Vital getVital() { return vital; }
    public void setVital(Vital vital) { this.vital = vital; }

    public boolean isRealTime() { return isRealTime; }
    public void setRealTime(boolean realTime) { isRealTime = realTime; }

    public String getSource() { return source; }
    public void setSource(String source) { this.source = source; }
}
