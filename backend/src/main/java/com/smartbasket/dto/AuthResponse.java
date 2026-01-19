package com.smartbasket.dto;

public class AuthResponse {
    private Long userId;
    private String email;
    private String fullName;
    private String phone;
    private String role;
    private String message;
    private boolean success;
    
    public AuthResponse() {}
    
    public AuthResponse(Long userId, String email, String fullName, String role, String message, boolean success) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.role = role;
        this.message = message;
        this.success = success;
    }
    
    public AuthResponse(Long userId, String email, String fullName, String phone, String role, String message, boolean success) {
        this.userId = userId;
        this.email = email;
        this.fullName = fullName;
        this.phone = phone;
        this.role = role;
        this.message = message;
        this.success = success;
    }
    
    public Long getUserId() { return userId; }
    public void setUserId(Long userId) { this.userId = userId; }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getPhone() { return phone; }
    public void setPhone(String phone) { this.phone = phone; }
    
    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }
    
    public String getMessage() { return message; }
    public void setMessage(String message) { this.message = message; }
    
    public boolean isSuccess() { return success; }
    public void setSuccess(boolean success) { this.success = success; }
}
