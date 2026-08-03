package com.hamperly.luxurygifthampers.entity;

import jakarta.persistence.*;
import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Entity
@Table(name = "orders")
public class Order {

    @Id
    @Column(name = "order_id", nullable = false, length = 255)
    private String orderId;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "total_amount", nullable = false, precision = 10, scale = 2)
    private BigDecimal totalAmount;

    @Enumerated(EnumType.STRING)
    @Column(name = "status", nullable = false)
    private OrderStatus status = OrderStatus.PENDING;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public Order() {
    }

    public Order(String orderId, User user, BigDecimal totalAmount, OrderStatus status,
                 LocalDateTime createdAt, LocalDateTime updatedAt, List<OrderItem> orderItems) {
        this.orderId = orderId;
        this.user = user;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.orderItems = orderItems != null ? orderItems : new ArrayList<>();
    }

    // Getters and Setters
    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
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

    public LocalDateTime getUpdatedAt() {
        return updatedAt;
    }

    public void setUpdatedAt(LocalDateTime updatedAt) {
        this.updatedAt = updatedAt;
    }

    public List<OrderItem> getOrderItems() {
        return orderItems;
    }

    public void setOrderItems(List<OrderItem> orderItems) {
        this.orderItems = orderItems;
    }

    public static OrderBuilder builder() {
        return new OrderBuilder();
    }

    public static class OrderBuilder {
        private String orderId;
        private User user;
        private BigDecimal totalAmount;
        private OrderStatus status = OrderStatus.PENDING;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<OrderItem> orderItems = new ArrayList<>();

        public OrderBuilder orderId(String orderId) {
            this.orderId = orderId;
            return this;
        }

        public OrderBuilder user(User user) {
            this.user = user;
            return this;
        }

        public OrderBuilder totalAmount(BigDecimal totalAmount) {
            this.totalAmount = totalAmount;
            return this;
        }

        public OrderBuilder status(OrderStatus status) {
            this.status = status;
            return this;
        }

        public OrderBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public OrderBuilder updatedAt(LocalDateTime updatedAt) {
            this.updatedAt = updatedAt;
            return this;
        }

        public OrderBuilder orderItems(List<OrderItem> orderItems) {
            this.orderItems = orderItems;
            return this;
        }

        public Order build() {
            return new Order(orderId, user, totalAmount, status, createdAt, updatedAt, orderItems);
        }
    }
}
