package com.smartbasket.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;

@Entity
@Table(name = "platforms")
public class Platform {
    
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    
    @Column(nullable = false, unique = true)
    private String name;
    
    @Column
    private String logoUrl;
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal baseDeliveryFee = new BigDecimal("25.00");
    
    @Column(nullable = false, precision = 10, scale = 2)
    private BigDecimal freeDeliveryThreshold = new BigDecimal("200.00");
    
    @Column(nullable = false)
    private Integer avgDeliveryMinutes = 15;
    
    @Column(nullable = false)
    private String websiteUrl;
    
    @Column(nullable = false)
    private LocalDateTime createdAt;
    
    // Constructors
    public Platform() {
        this.createdAt = LocalDateTime.now();
    }
    
    public Platform(String name, BigDecimal baseDeliveryFee, BigDecimal freeDeliveryThreshold, 
                    Integer avgDeliveryMinutes, String websiteUrl) {
        this.name = name;
        this.baseDeliveryFee = baseDeliveryFee;
        this.freeDeliveryThreshold = freeDeliveryThreshold;
        this.avgDeliveryMinutes = avgDeliveryMinutes;
        this.websiteUrl = websiteUrl;
        this.createdAt = LocalDateTime.now();
    }
    
    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }
    
    public String getName() { return name; }
    public void setName(String name) { this.name = name; }
    
    public String getLogoUrl() { return logoUrl; }
    public void setLogoUrl(String logoUrl) { this.logoUrl = logoUrl; }
    
    public BigDecimal getBaseDeliveryFee() { return baseDeliveryFee; }
    public void setBaseDeliveryFee(BigDecimal baseDeliveryFee) { this.baseDeliveryFee = baseDeliveryFee; }
    
    public BigDecimal getFreeDeliveryThreshold() { return freeDeliveryThreshold; }
    public void setFreeDeliveryThreshold(BigDecimal freeDeliveryThreshold) { this.freeDeliveryThreshold = freeDeliveryThreshold; }
    
    public Integer getAvgDeliveryMinutes() { return avgDeliveryMinutes; }
    public void setAvgDeliveryMinutes(Integer avgDeliveryMinutes) { this.avgDeliveryMinutes = avgDeliveryMinutes; }
    
    public String getWebsiteUrl() { return websiteUrl; }
    public void setWebsiteUrl(String websiteUrl) { this.websiteUrl = websiteUrl; }
    
    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }
}