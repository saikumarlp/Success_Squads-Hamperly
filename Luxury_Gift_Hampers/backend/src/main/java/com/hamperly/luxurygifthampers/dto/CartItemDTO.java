package com.hamperly.luxurygifthampers.dto;

import java.math.BigDecimal;

public class CartItemDTO {
    private Long id;
    private Long productId;
    private String productName;
    private BigDecimal price;
    private Integer quantity;
    private String imageUrl;
    private BigDecimal subTotal;

    public CartItemDTO() {
    }

    public CartItemDTO(Long id, Long productId, String productName, BigDecimal price, Integer quantity, String imageUrl, BigDecimal subTotal) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.price = price;
        this.quantity = quantity;
        this.imageUrl = imageUrl;
        this.subTotal = subTotal;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

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

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getQuantity() {
        return quantity;
    }

    public void setQuantity(Integer quantity) {
        this.quantity = quantity;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public BigDecimal getSubTotal() {
        return subTotal;
    }

    public void setSubTotal(BigDecimal subTotal) {
        this.subTotal = subTotal;
    }

    public static CartItemDTOBuilder builder() {
        return new CartItemDTOBuilder();
    }

    public static class CartItemDTOBuilder {
        private Long id;
        private Long productId;
        private String productName;
        private BigDecimal price;
        private Integer quantity;
        private String imageUrl;
        private BigDecimal subTotal;

        public CartItemDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public CartItemDTOBuilder productId(Long productId) {
            this.productId = productId;
            return this;
        }

        public CartItemDTOBuilder productName(String productName) {
            this.productName = productName;
            return this;
        }

        public CartItemDTOBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public CartItemDTOBuilder quantity(Integer quantity) {
            this.quantity = quantity;
            return this;
        }

        public CartItemDTOBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public CartItemDTOBuilder subTotal(BigDecimal subTotal) {
            this.subTotal = subTotal;
            return this;
        }

        public CartItemDTO build() {
            return new CartItemDTO(id, productId, productName, price, quantity, imageUrl, subTotal);
        }
    }
}
