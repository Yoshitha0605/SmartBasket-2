package com.smartbasket.controller;

import com.smartbasket.dto.AuthRequest;
import com.smartbasket.dto.AuthResponse;
import com.smartbasket.entity.User;
import com.smartbasket.service.AuthService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/auth")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
public class AuthController {
    
    @Autowired
    private AuthService authService;
    
    @PostMapping("/register")
    public ResponseEntity<AuthResponse> register(@RequestBody AuthRequest request) {
        try {
            User user = authService.register(request.getEmail(), request.getPassword(), request.getFullName());
            AuthResponse response = new AuthResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getPhone(),
                    user.getRole(),
                    "Registration successful",
                    true
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(
                    null,
                    request.getEmail(),
                    null,
                    null,
                    null,
                    e.getMessage(),
                    false
            );
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(response);
        }
    }
    
    @PostMapping("/login")
    public ResponseEntity<AuthResponse> login(@RequestBody AuthRequest request) {
        try {
            User user = authService.login(request.getEmail(), request.getPassword());
            AuthResponse response = new AuthResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getPhone(),
                    user.getRole(),
                    "Login successful",
                    true
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(
                    null,
                    request.getEmail(),
                    null,
                    null,
                    null,
                    e.getMessage(),
                    false
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    /**
     * DEMO AUTH: Phone + OTP Login
     * College demo mode endpoint
     * Accepts any 6-digit OTP, creates user if not exists
     * Request: { "phone": "9876543210", "otp": "123456" }
     */
    @PostMapping("/login/phone")
    public ResponseEntity<AuthResponse> loginWithPhone(@RequestBody AuthRequest request) {
        try {
            // Validate phone and OTP are provided
            if (request.getPhone() == null || request.getPhone().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new AuthResponse(null, null, null, null, null, "Phone number is required", false)
                );
            }
            if (request.getOtp() == null || request.getOtp().isEmpty()) {
                return ResponseEntity.status(HttpStatus.BAD_REQUEST).body(
                    new AuthResponse(null, null, null, null, null, "OTP is required", false)
                );
            }
            
            // Perform phone + OTP login (demo mode)
            User user = authService.loginWithPhoneOtp(request.getPhone(), request.getOtp());
            
            AuthResponse response = new AuthResponse(
                    user.getId(),
                    user.getEmail(),
                    user.getFullName(),
                    user.getPhone(),
                    user.getRole(),
                    "Login successful",
                    true
            );
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            AuthResponse response = new AuthResponse(
                    null,
                    null,
                    null,
                    request.getPhone(),
                    null,
                    e.getMessage(),
                    false
            );
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).body(response);
        }
    }
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<User> getUserProfile(@PathVariable Long userId) {
        return authService.getUserById(userId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PutMapping("/user/{userId}")
    public ResponseEntity<User> updateProfile(
            @PathVariable Long userId,
            @RequestBody User userDetails) {
        try {
            User updated = authService.updateProfile(
                    userId,
                    userDetails.getFullName(),
                    userDetails.getPhone(),
                    userDetails.getAddress()
            );
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
