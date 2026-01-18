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
