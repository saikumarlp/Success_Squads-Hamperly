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

    @Column(name = "item_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal itemTotal = BigDecimal.ZERO;

    @Column(name = "discount", nullable = false, precision = 10, scale = 2)
    private BigDecimal discount = BigDecimal.ZERO;

    @Column(name = "coupon_discount", nullable = false, precision = 10, scale = 2)
    private BigDecimal couponDiscount = BigDecimal.ZERO;

    @Column(name = "shipping_charge", nullable = false, precision = 10, scale = 2)
    private BigDecimal shippingCharge = BigDecimal.ZERO;

    @Column(name = "tax", nullable = false, precision = 10, scale = 2)
    private BigDecimal tax = BigDecimal.ZERO;

    @Column(name = "grand_total", nullable = false, precision = 10, scale = 2)
    private BigDecimal grandTotal = BigDecimal.ZERO;

    @Column(name = "shipping_address", length = 500)
    private String shippingAddress;

    @Column(name = "city", length = 100)
    private String city;

    @Column(name = "state", length = 100)
    private String state;

    @Column(name = "country", length = 100)
    private String country;

    @Column(name = "postal_code", length = 20)
    private String postalCode;

    @Column(name = "payment_id", length = 255)
    private String paymentId;

    @Column(name = "payment_method", length = 100)
    private String paymentMethod;

    @Column(name = "payment_status", length = 50)
    private String paymentStatus = "PENDING";

    @Column(name = "estimated_delivery")
    private LocalDateTime estimatedDelivery;

    @Column(name = "order_date")
    private LocalDateTime orderDate;

    @Column(name = "expected_delivery_date")
    private LocalDateTime expectedDeliveryDate;

    @Column(name = "tracking_number", length = 255)
    private String trackingNumber;

    @Column(name = "confirmed_at")
    private LocalDateTime confirmedAt;

    @Column(name = "packed_at")
    private LocalDateTime packedAt;

    @Column(name = "shipped_at")
    private LocalDateTime shippedAt;

    @Column(name = "out_for_delivery_at")
    private LocalDateTime outForDeliveryAt;

    @Column(name = "delivered_at")
    private LocalDateTime deliveredAt;

    @Column(name = "cancelled_at")
    private LocalDateTime cancelledAt;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", insertable = false, updatable = false)
    private LocalDateTime updatedAt;

    @OneToMany(mappedBy = "order", cascade = CascadeType.ALL, orphanRemoval = true)
    private List<OrderItem> orderItems = new ArrayList<>();

    public Order() {
    }

    public Order(String orderId, User user, BigDecimal totalAmount, OrderStatus status, BigDecimal itemTotal,
                 BigDecimal discount, BigDecimal couponDiscount, BigDecimal shippingCharge, BigDecimal tax,
                 BigDecimal grandTotal, String shippingAddress, String city, String state, String country,
                 String postalCode, String paymentId, String paymentMethod, String paymentStatus,
                 LocalDateTime estimatedDelivery, String trackingNumber, LocalDateTime confirmedAt,
                 LocalDateTime packedAt, LocalDateTime shippedAt, LocalDateTime outForDeliveryAt,
                 LocalDateTime deliveredAt, LocalDateTime cancelledAt, LocalDateTime createdAt,
                 LocalDateTime updatedAt, List<OrderItem> orderItems, LocalDateTime orderDate,
                 LocalDateTime expectedDeliveryDate) {
        this.orderId = orderId;
        this.user = user;
        this.totalAmount = totalAmount;
        this.status = status;
        this.itemTotal = itemTotal != null ? itemTotal : BigDecimal.ZERO;
        this.discount = discount != null ? discount : BigDecimal.ZERO;
        this.couponDiscount = couponDiscount != null ? couponDiscount : BigDecimal.ZERO;
        this.shippingCharge = shippingCharge != null ? shippingCharge : BigDecimal.ZERO;
        this.tax = tax != null ? tax : BigDecimal.ZERO;
        this.grandTotal = grandTotal != null ? grandTotal : BigDecimal.ZERO;
        this.shippingAddress = shippingAddress;
        this.city = city;
        this.state = state;
        this.country = country;
        this.postalCode = postalCode;
        this.paymentId = paymentId;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus != null ? paymentStatus : "PENDING";
        this.estimatedDelivery = estimatedDelivery;
        this.trackingNumber = trackingNumber;
        this.confirmedAt = confirmedAt;
        this.packedAt = packedAt;
        this.shippedAt = shippedAt;
        this.outForDeliveryAt = outForDeliveryAt;
        this.deliveredAt = deliveredAt;
        this.cancelledAt = cancelledAt;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
        this.orderItems = orderItems != null ? orderItems : new ArrayList<>();
        this.orderDate = orderDate;
        this.expectedDeliveryDate = expectedDeliveryDate;
    }

    // Getters and Setters
    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public User getUser() { return user; }
    public void setUser(User user) { this.user = user; }

    public BigDecimal getTotalAmount() { return totalAmount; }
    public void setTotalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; }

    public OrderStatus getStatus() { return status; }
    public void setStatus(OrderStatus status) { this.status = status; }

    public BigDecimal getItemTotal() { return itemTotal; }
    public void setItemTotal(BigDecimal itemTotal) { this.itemTotal = itemTotal; }

    public BigDecimal getDiscount() { return discount; }
    public void setDiscount(BigDecimal discount) { this.discount = discount; }

    public BigDecimal getCouponDiscount() { return couponDiscount; }
    public void setCouponDiscount(BigDecimal couponDiscount) { this.couponDiscount = couponDiscount; }

    public BigDecimal getShippingCharge() { return shippingCharge; }
    public void setShippingCharge(BigDecimal shippingCharge) { this.shippingCharge = shippingCharge; }

    public BigDecimal getTax() { return tax; }
    public void setTax(BigDecimal tax) { this.tax = tax; }

    public BigDecimal getGrandTotal() { return grandTotal; }
    public void setGrandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; }

    public String getShippingAddress() { return shippingAddress; }
    public void setShippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; }

    public String getCity() { return city; }
    public void setCity(String city) { this.city = city; }

    public String getState() { return state; }
    public void setState(String state) { this.state = state; }

    public String getCountry() { return country; }
    public void setCountry(String country) { this.country = country; }

    public String getPostalCode() { return postalCode; }
    public void setPostalCode(String postalCode) { this.postalCode = postalCode; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(LocalDateTime estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }

    public LocalDateTime getOrderDate() { return orderDate; }
    public void setOrderDate(LocalDateTime orderDate) { this.orderDate = orderDate; }

    public LocalDateTime getExpectedDeliveryDate() { return expectedDeliveryDate; }
    public void setExpectedDeliveryDate(LocalDateTime expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; }

    public String getTrackingNumber() { return trackingNumber; }
    public void setTrackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; }

    public LocalDateTime getConfirmedAt() { return confirmedAt; }
    public void setConfirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; }

    public LocalDateTime getPackedAt() { return packedAt; }
    public void setPackedAt(LocalDateTime packedAt) { this.packedAt = packedAt; }

    public LocalDateTime getShippedAt() { return shippedAt; }
    public void setShippedAt(LocalDateTime shippedAt) { this.shippedAt = shippedAt; }

    public LocalDateTime getOutForDeliveryAt() { return outForDeliveryAt; }
    public void setOutForDeliveryAt(LocalDateTime outForDeliveryAt) { this.outForDeliveryAt = outForDeliveryAt; }

    public LocalDateTime getDeliveredAt() { return deliveredAt; }
    public void setDeliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; }

    public LocalDateTime getCancelledAt() { return cancelledAt; }
    public void setCancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public List<OrderItem> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; }

    public static OrderBuilder builder() {
        return new OrderBuilder();
    }

    public static class OrderBuilder {
        private String orderId;
        private User user;
        private BigDecimal totalAmount;
        private OrderStatus status = OrderStatus.PENDING;
        private BigDecimal itemTotal = BigDecimal.ZERO;
        private BigDecimal discount = BigDecimal.ZERO;
        private BigDecimal couponDiscount = BigDecimal.ZERO;
        private BigDecimal shippingCharge = BigDecimal.ZERO;
        private BigDecimal tax = BigDecimal.ZERO;
        private BigDecimal grandTotal = BigDecimal.ZERO;
        private String shippingAddress;
        private String city;
        private String state;
        private String country;
        private String postalCode;
        private String paymentId;
        private String paymentMethod;
        private String paymentStatus = "PENDING";
        private LocalDateTime estimatedDelivery;
        private String trackingNumber;
        private LocalDateTime confirmedAt;
        private LocalDateTime packedAt;
        private LocalDateTime shippedAt;
        private LocalDateTime outForDeliveryAt;
        private LocalDateTime deliveredAt;
        private LocalDateTime cancelledAt;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;
        private List<OrderItem> orderItems = new ArrayList<>();
        private LocalDateTime orderDate;
        private LocalDateTime expectedDeliveryDate;

        public OrderBuilder orderId(String orderId) { this.orderId = orderId; return this; }
        public OrderBuilder user(User user) { this.user = user; return this; }
        public OrderBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public OrderBuilder status(OrderStatus status) { this.status = status; return this; }
        public OrderBuilder itemTotal(BigDecimal itemTotal) { this.itemTotal = itemTotal; return this; }
        public OrderBuilder discount(BigDecimal discount) { this.discount = discount; return this; }
        public OrderBuilder couponDiscount(BigDecimal couponDiscount) { this.couponDiscount = couponDiscount; return this; }
        public OrderBuilder shippingCharge(BigDecimal shippingCharge) { this.shippingCharge = shippingCharge; return this; }
        public OrderBuilder tax(BigDecimal tax) { this.tax = tax; return this; }
        public OrderBuilder grandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; return this; }
        public OrderBuilder shippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; return this; }
        public OrderBuilder city(String city) { this.city = city; return this; }
        public OrderBuilder state(String state) { this.state = state; return this; }
        public OrderBuilder country(String country) { this.country = country; return this; }
        public OrderBuilder postalCode(String postalCode) { this.postalCode = postalCode; return this; }
        public OrderBuilder paymentId(String paymentId) { this.paymentId = paymentId; return this; }
        public OrderBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public OrderBuilder paymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public OrderBuilder estimatedDelivery(LocalDateTime estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; return this; }
        public OrderBuilder trackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; return this; }
        public OrderBuilder confirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; return this; }
        public OrderBuilder packedAt(LocalDateTime packedAt) { this.packedAt = packedAt; return this; }
        public OrderBuilder shippedAt(LocalDateTime shippedAt) { this.shippedAt = shippedAt; return this; }
        public OrderBuilder outForDeliveryAt(LocalDateTime outForDeliveryAt) { this.outForDeliveryAt = outForDeliveryAt; return this; }
        public OrderBuilder deliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; return this; }
        public OrderBuilder cancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; return this; }
        public OrderBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public OrderBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }
        public OrderBuilder orderItems(List<OrderItem> orderItems) { this.orderItems = orderItems; return this; }
        public OrderBuilder orderDate(LocalDateTime orderDate) { this.orderDate = orderDate; return this; }
        public OrderBuilder expectedDeliveryDate(LocalDateTime expectedDeliveryDate) { this.expectedDeliveryDate = expectedDeliveryDate; return this; }

        public Order build() {
            return new Order(orderId, user, totalAmount, status, itemTotal, discount, couponDiscount,
                    shippingCharge, tax, grandTotal, shippingAddress, city, state, country, postalCode,
                    paymentId, paymentMethod, paymentStatus, estimatedDelivery, trackingNumber, confirmedAt,
                    packedAt, shippedAt, outForDeliveryAt, deliveredAt, cancelledAt, createdAt, updatedAt, orderItems,
                    orderDate, expectedDeliveryDate);
        }
    }
}
