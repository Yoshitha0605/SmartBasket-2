package com.smartbasket.service;

import com.smartbasket.entity.Platform;
import com.smartbasket.repository.PlatformRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import java.util.List;
import java.util.Optional;

@Service
public class PlatformService {
    
    @Autowired
    private PlatformRepository platformRepository;
    
    public List<Platform> getAllPlatforms() {
        return platformRepository.findAllByOrderByAvgDeliveryMinutesAsc();
    }
    
    public Optional<Platform> getPlatformById(Long id) {
        return platformRepository.findById(id);
    }
    
    public Platform savePlatform(Platform platform) {
        return platformRepository.save(platform);
    }
    
    public void deletePlatform(Long id) {
        platformRepository.deleteById(id);
    }
}