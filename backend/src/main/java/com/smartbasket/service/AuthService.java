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
    
    public Optional<User> getUserById(Long id) {
        return userRepository.findById(id);
    }
    
    public User updateProfile(Long userId, String fullName, String phone, String address) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new RuntimeException("User not found"));
        user.setFullName(fullName);
        user.setPhone(phone);
        user.setAddress(address);
        return userRepository.save(user);
    }
}
