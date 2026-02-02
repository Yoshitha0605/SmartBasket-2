package com.smartbasket.dto;

import java.math.BigDecimal;

public class OrderRequest {
    private BigDecimal totalAmount;
    private String shippingAddress;
    private String paymentMethod;
    
    public OrderRequest() {}
    
    public OrderRequest(BigDecimal totalAmount, String shippingAddress, String paymentMethod) {
        this.totalAmount = totalAmount;
        this.shippingAddress = shippingAddress;
        this.paymentMethod = paymentMethod;
    }
    
    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }
    
    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }
    
    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }
}
