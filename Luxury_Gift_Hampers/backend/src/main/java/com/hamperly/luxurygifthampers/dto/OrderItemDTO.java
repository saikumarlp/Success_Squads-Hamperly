package com.hamperly.luxurygifthampers.dto;

import java.math.BigDecimal;

public class OrderItemDTO {
    private Long productId;
    private String productName;
    private Integer quantity;
    private BigDecimal pricePerUnit;
    private BigDecimal totalPrice;
    private String imageUrl;

    public OrderItemDTO() {
    }

    public OrderItemDTO(Long productId, String productName, Integer quantity, BigDecimal pricePerUnit, BigDecimal totalPrice, String imageUrl) {
        this.productId = productId;
        this.productName = productName;
        this.quantity = quantity;
        this.pricePerUnit = pricePerUnit;
        this.totalPrice = totalPrice;
        this.imageUrl = imageUrl;
    }

    // Getters and Setters
    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getProductName() {
        return productName;
    }

    public void setProductName(String productName) {
        this.productName = productName;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public BigDecimal getPricePerUnit() {
        return pricePerUnit;
    }

    public void setPricePerUnit(BigDecimal pricePerUnit) {
        this.pricePerUnit = pricePerUnit;
    }

    public BigDecimal getTotalPrice() {
        return totalPrice;
    }

    public void setTotalPrice(BigDecimal totalPrice) {
        this.totalPrice = totalPrice;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public static OrderItemDTOBuilder builder() {
        return new OrderItemDTOBuilder();
    }

    public static class OrderItemDTOBuilder {
        private Long productId;
        private String productName;
        private Integer quantity;
        private BigDecimal pricePerUnit;
        private BigDecimal totalPrice;
        private String imageUrl;

        public OrderItemDTOBuilder productId(Long productId) {
            this.productId = productId;
            return this;
        }

        public OrderItemDTOBuilder productName(String productName) {
            this.productName = productName;
            return this;
        }

        public OrderItemDTOBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public OrderItemDTOBuilder pricePerUnit(BigDecimal pricePerUnit) {
            this.pricePerUnit = pricePerUnit;
            return this;
        }

        public OrderItemDTOBuilder totalPrice(BigDecimal totalPrice) {
            this.totalPrice = totalPrice;
            return this;
        }

        public OrderItemDTOBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public OrderItemDTO build() {
            return new OrderItemDTO(productId, productName, quantity, pricePerUnit, totalPrice, imageUrl);
        }
    }
}
