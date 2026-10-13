package com.medisphere.backend.service;

import com.medisphere.backend.audit.AuditService;
import com.medisphere.backend.dto.AuthRequest;
import com.medisphere.backend.dto.AuthResponse;
import com.medisphere.backend.dto.RegisterRequest;
import com.medisphere.backend.model.User;
import com.medisphere.backend.repository.UserRepository;
import com.medisphere.backend.security.JwtUtil;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.web.server.ResponseStatusException;

import java.util.Arrays;
import java.util.List;

@Service
public class AuthService {

    private final JwtUtil jwtUtil;
    private final AuditService auditService;
    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;

    @Value("${admin.emails:}")
    private String adminEmails;

    public AuthService(JwtUtil jwtUtil, AuditService auditService, UserRepository userRepository, PasswordEncoder passwordEncoder) {
        this.jwtUtil = jwtUtil;
        this.auditService = auditService;
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
    }

    private List<String> getAdminEmailsList() {
        if (adminEmails == null || adminEmails.trim().isEmpty()) {
            return List.of();
        }
        return Arrays.stream(adminEmails.split(","))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .map(String::toLowerCase)
                .toList();
    }

    private String determineRole(String email) {
        if (email == null) return "ROLE_USER";
        String normalized = email.toLowerCase();
        if (getAdminEmailsList().contains(normalized)) {
            return "ROLE_ADMIN";
        }
        return "ROLE_USER";
    }

    public AuthResponse register(RegisterRequest request) {
        String email = request.getEmail().toLowerCase();
        if (userRepository.existsByEmail(email)) {
            throw new ResponseStatusException(HttpStatus.CONFLICT, "Email already registered");
        }
        String role = determineRole(email);
        String passwordHash = passwordEncoder.encode(request.getPassword());
        User user = new User(request.getName(), email, passwordHash, role);
        userRepository.save(user);
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName());
        auditService.logAction("REGISTER", "User", user.getEmail(), user.getName(), user.getRole(), "127.0.0.1", "SUCCESS", "User registered");
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole(), user.getName());
    }

    public AuthResponse authenticate(AuthRequest request) {
        String email = request.getEmail().toLowerCase();
        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials"));
        
        if (!passwordEncoder.matches(request.getPassword(), user.getPasswordHash())) {
            auditService.logAction("LOGIN", "User", email, user.getName(), "UNKNOWN", "127.0.0.1", "UNAUTHORIZED", "Invalid password");
            throw new ResponseStatusException(HttpStatus.UNAUTHORIZED, "Invalid credentials");
        }
        
        String role = determineRole(email);
        if (!role.equals(user.getRole())) {
            user.setRole(role);
            userRepository.save(user);
        }
        
        String token = jwtUtil.generateToken(user.getEmail(), user.getRole(), user.getName());
        auditService.logAction("LOGIN", "User", user.getEmail(), user.getName(), user.getRole(), "127.0.0.1", "SUCCESS", "User logged in");
        return new AuthResponse(token, user.getEmail(), user.getName(), user.getRole(), user.getName());
    }
}