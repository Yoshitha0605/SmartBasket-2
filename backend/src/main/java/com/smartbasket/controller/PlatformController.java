package com.smartbasket.controller;

import com.smartbasket.entity.Platform;
import com.smartbasket.service.PlatformService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RestController
@RequestMapping("/api/platforms")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173", "http://10.0.2.2:8081"})
public class PlatformController {
    
    private static final Logger logger = LoggerFactory.getLogger(PlatformController.class);
    
    @Autowired
    private PlatformService platformService;
    
    @GetMapping
    public ResponseEntity<List<Platform>> getAllPlatforms() {
        try {
            logger.info("Fetching all platforms");
            List<Platform> platforms = platformService.getAllPlatforms();
            logger.info("Retrieved {} platforms", platforms.size());
            return ResponseEntity.ok(platforms);
        } catch (Exception e) {
            logger.error("Error fetching platforms", e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{id}")
    public ResponseEntity<Platform> getPlatformById(@PathVariable Long id) {
        try {
            logger.info("Fetching platform with id: {}", id);
            return platformService.getPlatformById(id)
                    .map(platform -> {
                        logger.info("Found platform: {}", platform.getName());
                        return ResponseEntity.ok(platform);
                    })
                    .orElseGet(() -> {
                        logger.warn("Platform not found with id: {}", id);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error fetching platform with id: {}", id, e);
            return ResponseEntity.internalServerError().build();
        }
    }
}