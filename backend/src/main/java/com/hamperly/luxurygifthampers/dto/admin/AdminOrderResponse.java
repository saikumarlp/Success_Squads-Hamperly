package com.hamperly.luxurygifthampers.dto.admin;

import com.hamperly.luxurygifthampers.dto.OrderItemDTO;
import com.hamperly.luxurygifthampers.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class AdminOrderResponse {
    private String orderId;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private String customerName;
    private String customerEmail;
    private List<OrderItemDTO> orderItems;

    public AdminOrderResponse() {
    }

    public AdminOrderResponse(String orderId, BigDecimal totalAmount, OrderStatus status, LocalDateTime createdAt, String customerName, String customerEmail, List<OrderItemDTO> orderItems) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.orderItems = orderItems;
    }

    // Getters and Setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public List<OrderItemDTO> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDTO> orderItems) { this.orderItems = orderItems; }
}
