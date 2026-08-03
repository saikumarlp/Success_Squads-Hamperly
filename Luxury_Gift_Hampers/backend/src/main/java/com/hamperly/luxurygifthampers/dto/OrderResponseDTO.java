package com.hamperly.luxurygifthampers.dto;

import com.hamperly.luxurygifthampers.entity.OrderStatus;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

public class OrderResponseDTO {
    private String orderId;
    private BigDecimal totalAmount;
    private OrderStatus status;
    private LocalDateTime createdAt;
    private List<OrderItemDTO> orderItems;

    public OrderResponseDTO() {
    }

    public OrderResponseDTO(String orderId, BigDecimal totalAmount, OrderStatus status, LocalDateTime createdAt, List<OrderItemDTO> orderItems) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.orderItems = orderItems;
    }

    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public BigDecimal getTotalAmount() {
        return totalAmount;
    }

    public void setTotalAmount(BigDecimal totalAmount) {
        this.totalAmount = totalAmount;
    }

    public OrderStatus getStatus() {
        return status;
    }

    public void setStatus(OrderStatus status) {
        this.status = status;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public List<OrderItemDTO> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItemDTO> orderItems) {
        this.orderItems = orderItems;
    }

    public static OrderResponseDTOBuilder builder() {
        return new OrderResponseDTOBuilder();
    }

    public static class OrderResponseDTOBuilder {
        private String orderId;
        private BigDecimal totalAmount;
        private OrderStatus status;
        private LocalDateTime createdAt;
        private List<OrderItemDTO> orderItems;

        public OrderResponseDTOBuilder orderId(String orderId) {
            this.orderId = orderId;
            return this;
        }

        public OrderResponseDTOBuilder totalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public OrderResponseDTOBuilder status(OrderStatus status) {
            this.status = status;
            return this;
        }

        public OrderResponseDTOBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public OrderResponseDTOBuilder orderItems(List<OrderItemDTO> orderItems) {
            this.orderItems = orderItems;
            return this;
        }

        public OrderResponseDTO build() {
            return new OrderResponseDTO(orderId, totalAmount, status, createdAt, orderItems);
        }
    }
}
