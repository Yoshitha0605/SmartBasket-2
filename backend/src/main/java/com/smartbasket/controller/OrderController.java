package com.smartbasket.controller;

import com.smartbasket.dto.OrderRequest;
import com.smartbasket.entity.Order;
import com.smartbasket.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
public class OrderController {
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        List<Order> orders = orderService.getOrdersByUser(userId);
        return ResponseEntity.ok(orders);
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        return orderService.getOrderById(orderId)
                .map(ResponseEntity::ok)
                .orElseGet(() -> ResponseEntity.notFound().build());
    }
    
    @PostMapping("/{userId}/create")
    public ResponseEntity<Order> createOrder(
            @PathVariable Long userId,
            @RequestBody OrderRequest request) {
        try {
            // Calculate total amount from request or frontend
            // For now, accepting from frontend
            Order order = orderService.createOrder(
                    userId,
                    request.getShippingAddress() != null ? 
                            java.math.BigDecimal.ZERO : java.math.BigDecimal.ZERO,
                    request.getShippingAddress(),
                    request.getPaymentMethod()
            );
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        try {
            Order updated = orderService.updateOrderStatus(orderId, status);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            return ResponseEntity.notFound().build();
        }
    }
}
