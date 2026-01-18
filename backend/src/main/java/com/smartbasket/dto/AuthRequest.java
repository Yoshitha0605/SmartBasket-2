package com.smartbasket.dto;

public class AuthRequest {
    private String email;
    private String password;
    private String fullName;
    private String type; // "login" or "register"
    
    public AuthRequest() {}
    
    public AuthRequest(String email, String password, String type) {
        this.email = email;
        this.password = password;
        this.type = type;
    }
    
    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }
    
    public String getPassword() { return password; }
    public void setPassword(String password) { this.password = password; }
    
    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }
    
    public String getType() { return type; }
    public void setType(String type) { this.type = type; }
}
