package com.hamperly.luxurygifthampers.dto.admin;

import java.util.List;

public class ReviewStatsDTO {
    private Double averageRating;
    private Long totalReviews;
    private Long reviewsToday;
    private List<ProductReviewStat> mostReviewedProducts;
    private List<ProductReviewStat> lowestRatedProducts;

    public ReviewStatsDTO() {
    }

    public ReviewStatsDTO(Double averageRating, Long totalReviews, Long reviewsToday, List<ProductReviewStat> mostReviewedProducts, List<ProductReviewStat> lowestRatedProducts) {
        this.averageRating = averageRating;
        this.totalReviews = totalReviews;
        this.reviewsToday = reviewsToday;
        this.mostReviewedProducts = mostReviewedProducts;
        this.lowestRatedProducts = lowestRatedProducts;
    }

    public Double getAverageRating() {
        return averageRating;
    }

    public void setAverageRating(Double averageRating) {
        this.averageRating = averageRating;
    }

    public Long getTotalReviews() {
        return totalReviews;
    }

    public void setTotalReviews(Long totalReviews) {
        this.totalReviews = totalReviews;
    }

    public Long getReviewsToday() {
        return reviewsToday;
    }

    public void setReviewsToday(Long reviewsToday) {
        this.reviewsToday = reviewsToday;
    }

    public List<ProductReviewStat> getMostReviewedProducts() {
        return mostReviewedProducts;
    }

    public void setMostReviewedProducts(List<ProductReviewStat> mostReviewedProducts) {
        this.mostReviewedProducts = mostReviewedProducts;
    }

    public List<ProductReviewStat> getLowestRatedProducts() {
        return lowestRatedProducts;
    }

    public void setLowestRatedProducts(List<ProductReviewStat> lowestRatedProducts) {
        this.lowestRatedProducts = lowestRatedProducts;
    }

    public static class ProductReviewStat {
        private Long productId;
        private String productName;
        private Double averageRating;
        private Long reviewCount;

        public ProductReviewStat() {
        }

        public ProductReviewStat(Long productId, String productName, Double averageRating, Long reviewCount) {
            this.productId = productId;
            this.productName = productName;
            this.averageRating = averageRating;
            this.reviewCount = reviewCount;
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
    }
}
