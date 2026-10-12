package com.medisphere.backend.dto;

public class AuthResponse {
    private String token;
    private String email;
    private String name;
    private String role;
    private String title;

    public AuthResponse() {}

    public AuthResponse(String token, String email, String name, String role, String title) {
        this.token = token;
        this.email = email;
        this.name = name;
        this.role = role;
        this.title = title;
    }

    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getName() { return name; }
    public void setName(String name) { this.name = name; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }
}
