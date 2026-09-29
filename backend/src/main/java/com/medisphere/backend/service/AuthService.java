package com.medisphere.backend.service;

import com.medisphere.backend.audit.AuditService;
import com.medisphere.backend.dto.AuthRequest;
import com.medisphere.backend.dto.AuthResponse;
import com.medisphere.backend.security.JwtUtil;
import org.springframework.stereotype.Service;

@Service
public class AuthService {

    private final JwtUtil jwtUtil;
    private final AuditService auditService;

    public AuthService(JwtUtil jwtUtil, AuditService auditService) {
        this.jwtUtil = jwtUtil;
        this.auditService = auditService;
    }

    public AuthResponse authenticate(AuthRequest request) {
        // Clinical demo credential validation
        if ("doctor@medisphere.demo".equalsIgnoreCase(request.getEmail()) && "demo123".equals(request.getPassword())) {
            String token = jwtUtil.generateToken("doctor@medisphere.demo", "ROLE_ADMIN", "Clinical Administrator");
            auditService.logAction("LOGIN", "User", "doctor@medisphere.demo", "Dr. Ananya Sharma", "ROLE_ADMIN", "127.0.0.1", "SUCCESS", "Clinician session established");
            return new AuthResponse(token, "doctor@medisphere.demo", "Dr. Ananya Sharma", "ROLE_ADMIN", "Clinical Administrator");
        }

        auditService.logAction("LOGIN", "User", request.getEmail(), "UNKNOWN", "ANONYMOUS", "127.0.0.1", "UNAUTHORIZED", "Invalid login attempt");
        throw new RuntimeException("Invalid clinical credentials. Please use demo credentials: doctor@medisphere.demo / demo123");
    }
}
