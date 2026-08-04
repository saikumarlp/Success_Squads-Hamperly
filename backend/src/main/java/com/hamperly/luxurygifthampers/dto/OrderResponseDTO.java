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

    // Detailed properties
    private BigDecimal itemTotal;
    private BigDecimal discount;
    private BigDecimal couponDiscount;
    private BigDecimal shippingCharge;
    private BigDecimal tax;
    private BigDecimal grandTotal;
    
    private String shippingAddress;
    private String city;
    private String state;
    private String country;
    private String postalCode;

    private String customerName;
    private String customerEmail;
    private String customerPhone;

    private String paymentId;
    private String paymentMethod;
    private String paymentStatus;

    private LocalDateTime estimatedDelivery;
    private String trackingNumber;

    private LocalDateTime confirmedAt;
    private LocalDateTime packedAt;
    private LocalDateTime shippedAt;
    private LocalDateTime outForDeliveryAt;
    private LocalDateTime deliveredAt;
    private LocalDateTime cancelledAt;

    public OrderResponseDTO() {
    }

    public OrderResponseDTO(String orderId, BigDecimal totalAmount, OrderStatus status, LocalDateTime createdAt,
                            List<OrderItemDTO> orderItems, BigDecimal itemTotal, BigDecimal discount,
                            BigDecimal couponDiscount, BigDecimal shippingCharge, BigDecimal tax, BigDecimal grandTotal,
                            String shippingAddress, String city, String state, String country, String postalCode,
                            String customerName, String customerEmail, String customerPhone, String paymentId,
                            String paymentMethod, String paymentStatus, LocalDateTime estimatedDelivery,
                            String trackingNumber, LocalDateTime confirmedAt, LocalDateTime packedAt,
                            LocalDateTime shippedAt, LocalDateTime outForDeliveryAt, LocalDateTime deliveredAt,
                            LocalDateTime cancelledAt) {
        this.orderId = orderId;
        this.totalAmount = totalAmount;
        this.status = status;
        this.createdAt = createdAt;
        this.orderItems = orderItems;
        this.itemTotal = itemTotal;
        this.discount = discount;
        this.couponDiscount = couponDiscount;
        this.shippingCharge = shippingCharge;
        this.tax = tax;
        this.grandTotal = grandTotal;
        this.shippingAddress = shippingAddress;
        this.city = city;
        this.state = state;
        this.country = country;
        this.postalCode = postalCode;
        this.customerName = customerName;
        this.customerEmail = customerEmail;
        this.customerPhone = customerPhone;
        this.paymentId = paymentId;
        this.paymentMethod = paymentMethod;
        this.paymentStatus = paymentStatus;
        this.estimatedDelivery = estimatedDelivery;
        this.trackingNumber = trackingNumber;
        this.confirmedAt = confirmedAt;
        this.packedAt = packedAt;
        this.shippedAt = shippedAt;
        this.outForDeliveryAt = outForDeliveryAt;
        this.deliveredAt = deliveredAt;
        this.cancelledAt = cancelledAt;
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

    public List<OrderItemDTO> getOrderItems() { return orderItems; }
    public void setOrderItems(List<OrderItemDTO> orderItems) { this.orderItems = orderItems; }

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

    public String getCustomerName() { return customerName; }
    public void setCustomerName(String customerName) { this.customerName = customerName; }

    public String getCustomerEmail() { return customerEmail; }
    public void setCustomerEmail(String customerEmail) { this.customerEmail = customerEmail; }

    public String getCustomerPhone() { return customerPhone; }
    public void setCustomerPhone(String customerPhone) { this.customerPhone = customerPhone; }

    public String getPaymentId() { return paymentId; }
    public void setPaymentId(String paymentId) { this.paymentId = paymentId; }

    public String getPaymentMethod() { return paymentMethod; }
    public void setPaymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; }

    public String getPaymentStatus() { return paymentStatus; }
    public void setPaymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; }

    public LocalDateTime getEstimatedDelivery() { return estimatedDelivery; }
    public void setEstimatedDelivery(LocalDateTime estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; }

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

    public static OrderResponseDTOBuilder builder() {
        return new OrderResponseDTOBuilder();
    }

    public static class OrderResponseDTOBuilder {
        private String orderId;
        private BigDecimal totalAmount;
        private OrderStatus status;
        private LocalDateTime createdAt;
        private List<OrderItemDTO> orderItems;
        private BigDecimal itemTotal;
        private BigDecimal discount;
        private BigDecimal couponDiscount;
        private BigDecimal shippingCharge;
        private BigDecimal tax;
        private BigDecimal grandTotal;
        private String shippingAddress;
        private String city;
        private String state;
        private String country;
        private String postalCode;
        private String customerName;
        private String customerEmail;
        private String customerPhone;
        private String paymentId;
        private String paymentMethod;
        private String paymentStatus;
        private LocalDateTime estimatedDelivery;
        private String trackingNumber;
        private LocalDateTime confirmedAt;
        private LocalDateTime packedAt;
        private LocalDateTime shippedAt;
        private LocalDateTime outForDeliveryAt;
        private LocalDateTime deliveredAt;
        private LocalDateTime cancelledAt;

        public OrderResponseDTOBuilder orderId(String orderId) { this.orderId = orderId; return this; }
        public OrderResponseDTOBuilder totalAmount(BigDecimal totalAmount) { this.totalAmount = totalAmount; return this; }
        public OrderResponseDTOBuilder status(OrderStatus status) { this.status = status; return this; }
        public OrderResponseDTOBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public OrderResponseDTOBuilder orderItems(List<OrderItemDTO> orderItems) { this.orderItems = orderItems; return this; }
        public OrderResponseDTOBuilder itemTotal(BigDecimal itemTotal) { this.itemTotal = itemTotal; return this; }
        public OrderResponseDTOBuilder discount(BigDecimal discount) { this.discount = discount; return this; }
        public OrderResponseDTOBuilder couponDiscount(BigDecimal couponDiscount) { this.couponDiscount = couponDiscount; return this; }
        public OrderResponseDTOBuilder shippingCharge(BigDecimal shippingCharge) { this.shippingCharge = shippingCharge; return this; }
        public OrderResponseDTOBuilder tax(BigDecimal tax) { this.tax = tax; return this; }
        public OrderResponseDTOBuilder grandTotal(BigDecimal grandTotal) { this.grandTotal = grandTotal; return this; }
        public OrderResponseDTOBuilder shippingAddress(String shippingAddress) { this.shippingAddress = shippingAddress; return this; }
        public OrderResponseDTOBuilder city(String city) { this.city = city; return this; }
        public OrderResponseDTOBuilder state(String state) { this.state = state; return this; }
        public OrderResponseDTOBuilder country(String country) { this.country = country; return this; }
        public OrderResponseDTOBuilder postalCode(String postalCode) { this.postalCode = postalCode; return this; }
        public OrderResponseDTOBuilder customerName(String customerName) { this.customerName = customerName; return this; }
        public OrderResponseDTOBuilder customerEmail(String customerEmail) { this.customerEmail = customerEmail; return this; }
        public OrderResponseDTOBuilder customerPhone(String customerPhone) { this.customerPhone = customerPhone; return this; }
        public OrderResponseDTOBuilder paymentId(String paymentId) { this.paymentId = paymentId; return this; }
        public OrderResponseDTOBuilder paymentMethod(String paymentMethod) { this.paymentMethod = paymentMethod; return this; }
        public OrderResponseDTOBuilder paymentStatus(String paymentStatus) { this.paymentStatus = paymentStatus; return this; }
        public OrderResponseDTOBuilder estimatedDelivery(LocalDateTime estimatedDelivery) { this.estimatedDelivery = estimatedDelivery; return this; }
        public OrderResponseDTOBuilder trackingNumber(String trackingNumber) { this.trackingNumber = trackingNumber; return this; }
        public OrderResponseDTOBuilder confirmedAt(LocalDateTime confirmedAt) { this.confirmedAt = confirmedAt; return this; }
        public OrderResponseDTOBuilder packedAt(LocalDateTime packedAt) { this.packedAt = packedAt; return this; }
        public OrderResponseDTOBuilder shippedAt(LocalDateTime shippedAt) { this.shippedAt = shippedAt; return this; }
        public OrderResponseDTOBuilder outForDeliveryAt(LocalDateTime outForDeliveryAt) { this.outForDeliveryAt = outForDeliveryAt; return this; }
        public OrderResponseDTOBuilder deliveredAt(LocalDateTime deliveredAt) { this.deliveredAt = deliveredAt; return this; }
        public OrderResponseDTOBuilder cancelledAt(LocalDateTime cancelledAt) { this.cancelledAt = cancelledAt; return this; }

        public OrderResponseDTO build() {
            return new OrderResponseDTO(orderId, totalAmount, status, createdAt, orderItems, itemTotal, discount,
                    couponDiscount, shippingCharge, tax, grandTotal, shippingAddress, city, state, country, postalCode,
                    customerName, customerEmail, customerPhone, paymentId, paymentMethod, paymentStatus, estimatedDelivery,
                    trackingNumber, confirmedAt, packedAt, shippedAt, outForDeliveryAt, deliveredAt, cancelledAt);
        }
    }
}
