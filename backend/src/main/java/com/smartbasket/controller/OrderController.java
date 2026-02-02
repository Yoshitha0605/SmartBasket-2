package com.smartbasket.controller;

import com.smartbasket.dto.OrderRequest;
import com.smartbasket.entity.Order;
import com.smartbasket.service.OrderService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import java.util.List;

@RestController
@RequestMapping("/api/orders")
@CrossOrigin(origins = {"http://localhost:8080", "http://localhost:5173"})
public class OrderController {
    
    private static final Logger logger = LoggerFactory.getLogger(OrderController.class);
    
    @Autowired
    private OrderService orderService;
    
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<Order>> getOrdersByUser(@PathVariable Long userId) {
        try {
            logger.info("Fetching orders for user: {}", userId);
            List<Order> orders = orderService.getOrdersByUser(userId);
            logger.info("Retrieved {} orders for user: {}", orders.size(), userId);
            return ResponseEntity.ok(orders);
        } catch (Exception e) {
            logger.error("Error fetching orders for user: {}", userId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @GetMapping("/{orderId}")
    public ResponseEntity<Order> getOrderById(@PathVariable Long orderId) {
        try {
            logger.info("Fetching order with id: {}", orderId);
            return orderService.getOrderById(orderId)
                    .map(order -> {
                        logger.info("Found order: {}", order.getId());
                        return ResponseEntity.ok(order);
                    })
                    .orElseGet(() -> {
                        logger.warn("Order not found with id: {}", orderId);
                        return ResponseEntity.notFound().build();
                    });
        } catch (Exception e) {
            logger.error("Error fetching order with id: {}", orderId, e);
            return ResponseEntity.internalServerError().build();
        }
    }
    
    @PostMapping("/{userId}/create")
    public ResponseEntity<Order> createOrder(
            @PathVariable Long userId,
            @RequestBody OrderRequest request) {
        try {
            logger.info("Creating order for user: {} with total amount: {}", userId, request.getTotalAmount());
            Order order = orderService.createOrder(
                    userId,
                    request.getTotalAmount() != null ? request.getTotalAmount() : java.math.BigDecimal.ZERO,
                    request.getShippingAddress(),
                    request.getPaymentMethod()
            );
            logger.info("Order created successfully with id: {}", order.getId());
            return ResponseEntity.status(HttpStatus.CREATED).body(order);
        } catch (Exception e) {
            logger.error("Error creating order for user: {}", userId, e);
            return ResponseEntity.badRequest().build();
        }
    }
    
    @PutMapping("/{orderId}/status")
    public ResponseEntity<Order> updateOrderStatus(
            @PathVariable Long orderId,
            @RequestParam String status) {
        try {
            logger.info("Updating order {} status to: {}", orderId, status);
            Order updated = orderService.updateOrderStatus(orderId, status);
            logger.info("Order {} status updated successfully", orderId);
            return ResponseEntity.ok(updated);
        } catch (Exception e) {
            logger.error("Error updating order {} status", orderId, e);
            return ResponseEntity.notFound().build();
        }
    }
}
