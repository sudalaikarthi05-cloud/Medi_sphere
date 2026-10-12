package com.medisphere.backend.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public class PatientRequest {
    @NotBlank(message = "Full name is required")
    private String name;

    @NotNull(message = "Age is required")
    @Min(value = 0, message = "Age must be valid (0-130)")
    @Max(value = 130, message = "Age must be valid (0-130)")
    private Integer age;

    @NotBlank(message = "Gender is required")
    private String gender;

    @NotBlank(message = "Clinical condition is required")
    private String condition;

    private String status; // Optional initial status, defaults to "Active" or "Monitoring"

    public PatientRequest() {}

    public PatientRequest(String name, Integer age, String gender, String condition) {
        this.name = name;
        this.age = age;
        this.gender = gender;
        this.condition = condition;
    }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public Integer getAge() { return age; }
    public void setAge(Integer age) { this.age = age; }

    public String getGender() { return gender; }
    public void setGender(String gender) { this.gender = gender; }

    public String getCondition() { return condition; }
    public void setCondition(String condition) { this.condition = condition; }

    public String getStatus() { return status; }
    public void setStatus(String status) { this.status = status; }
}
