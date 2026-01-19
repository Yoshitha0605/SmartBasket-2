package com.smartbasket.service;

import com.smartbasket.entity.User;
import com.smartbasket.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.Optional;

@Service
public class AuthService {
    
    @Autowired
    private UserRepository userRepository;
    
    public User register(String email, String password, String fullName) {
        if (userRepository.existsByEmail(email)) {
            throw new RuntimeException("Email already registered");
        }
        User user = new User(email, password, fullName);
        return userRepository.save(user);
    }
    
    public User login(String email, String password) {
        Optional<User> user = userRepository.findByEmail(email);
        if (user.isEmpty()) {
            throw new RuntimeException("User not found");
        }
        if (!user.get().getPassword().equals(password)) {
            throw new RuntimeException("Invalid password");
        }
        return user.get();
    }
    
    /**
     * DEMO AUTH: Phone + OTP Login
     * College demo mode - accepts any 6-digit OTP
     * Creates user if phone doesn't exist, logs in if it does
     * NO real authentication required
     */
    public User loginWithPhoneOtp(String phone, String otp) {
        // Validate OTP is 6 digits (any value accepted in demo mode)
        if (otp == null || !otp.matches("^\\d{6}$")) {
            throw new RuntimeException("Invalid OTP format. Must be 6 digits.");
        }
        
        // Check if user exists by phone
        Optional<User> existingUser = userRepository.findByPhone(phone);
        
        if (existingUser.isPresent()) {
            // User exists, login successful
            return existingUser.get();
        } else {
            // Create new user with phone
            // Generate email from phone for internal use (never shown to user)
            String generatedEmail = phone.replaceAll("\\D", "") + "@smartbasket.app";
            User newUser = new User(generatedEmail, "demo_password", "Demo User");
            newUser.setPhone(phone);
            return userRepository.save(newUser);
        }
    }
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User updateProfile(Long userId, String fullName, String phone, String address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        
        // Update fields only if provided
        if (fullName != null && !fullName.isEmpty()) {
            user.setFullName(fullName);
        }
        if (phone != null && !phone.isEmpty()) {
            user.setPhone(phone);
        }
        if (address != null && !address.isEmpty()) {
            user.setAddress(address);
        }
        
        return userRepository.save(user);
    }
}
