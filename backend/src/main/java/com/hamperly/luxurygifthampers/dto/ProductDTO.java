package com.hamperly.luxurygifthampers.dto;

import java.math.BigDecimal;

public class ProductDTO {
    private Long id;
    private String name;
    private String description;
    private BigDecimal price;
    private Integer stock;
    private Long categoryId;
    private String categoryName;
    private String imageUrl;
    private Double averageRating;
    private Long reviewCount;

    public ProductDTO() {
    }

    public ProductDTO(Long id, String name, String description, BigDecimal price, Integer stock, Long categoryId, String categoryName, String imageUrl) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
    }

    public ProductDTO(Long id, String name, String description, BigDecimal price, Integer stock, Long categoryId, String categoryName, String imageUrl, Double averageRating, Long reviewCount) {
        this.id = id;
        this.name = name;
        this.description = description;
        this.price = price;
        this.stock = stock;
        this.categoryId = categoryId;
        this.categoryName = categoryName;
        this.imageUrl = imageUrl;
        this.averageRating = averageRating;
        this.reviewCount = reviewCount;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public String getDescription() {
        return description;
    }

    public void setDescription(String description) {
        this.description = description;
    }

    public BigDecimal getPrice() {
        return price;
    }

    public void setPrice(BigDecimal price) {
        this.price = price;
    }

    public Integer getStock() {
        return stock;
    }

    public void setStock(Integer stock) {
        this.stock = stock;
    }

    public Long getCategoryId() {
        return categoryId;
    }

    public void setCategoryId(Long categoryId) {
        this.categoryId = categoryId;
    }

    public String getCategoryName() {
        return categoryName;
    }

    public void setCategoryName(String categoryName) {
        this.categoryName = categoryName;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getReviewCount() {
        return reviewCount;
    }

    public void setReviewCount(Long reviewCount) {
        this.reviewCount = reviewCount;
    }

    public static ProductDTOBuilder builder() {
        return new ProductDTOBuilder();
    }

    public static class ProductDTOBuilder {
        private Long id;
        private String name;
        private String description;
        private BigDecimal price;
        private Integer stock;
        private Long categoryId;
        private String categoryName;
        private String imageUrl;
        private Double averageRating;
        private Long reviewCount;

        public ProductDTOBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProductDTOBuilder name(String name) {
            this.name = name;
            return this;
        }

        public ProductDTOBuilder description(String description) {
            this.description = description;
            return this;
        }

        public ProductDTOBuilder price(BigDecimal price) {
            this.price = price;
            return this;
        }

        public ProductDTOBuilder stock(Integer stock) {
            this.stock = stock;
            return this;
        }

        public ProductDTOBuilder categoryId(Long categoryId) {
            this.categoryId = categoryId;
            return this;
        }

        public ProductDTOBuilder categoryName(String categoryName) {
            this.categoryName = categoryName;
            return this;
        }

        public ProductDTOBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public ProductDTOBuilder averageRating(Double averageRating) {
            this.averageRating = averageRating;
            return this;
        }

        public ProductDTOBuilder reviewCount(Long reviewCount) {
            this.reviewCount = reviewCount;
            return this;
        }

        public ProductDTO build() {
            return new ProductDTO(id, name, description, price, stock, categoryId, categoryName, imageUrl, averageRating, reviewCount);
        }
    }
}
