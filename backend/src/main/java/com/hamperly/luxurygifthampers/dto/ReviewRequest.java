package com.hamperly.luxurygifthampers.dto;

import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;
import java.util.List;

public class ReviewRequest {

    @NotNull(message = "Product ID is required")
    private Long productId;

    @NotBlank(message = "Order ID is required")
    private String orderId;

    @NotNull(message = "Rating is required")
    @Min(value = 1, message = "Rating must be at least 1")
    @Max(value = 5, message = "Rating must not exceed 5")
    private Integer rating;

    private String title;

    @NotBlank(message = "Review content description is required")
    private String comment;

    private List<String> imageUrls;

    public ReviewRequest() {
    }

    public ReviewRequest(Long productId, String orderId, Integer rating, String title, String comment, List<String> imageUrls) {
        this.productId = productId;
        this.orderId = orderId;
        this.rating = rating;
        this.title = title;
        this.comment = comment;
        this.imageUrls = imageUrls;
    }

    public Long getProductId() {
        return productId;
    }

    public void setProductId(Long productId) {
        this.productId = productId;
    }

    public String getOrderId() {
        return orderId;
    }

    public void setOrderId(String orderId) {
        this.orderId = orderId;
    }

    public Integer getRating() {
        return rating;
    }

    public void setRating(Integer rating) {
        this.rating = rating;
    }

    public String getTitle() {
        return title;
    }

    public void setTitle(String title) {
        this.title = title;
    }

    public String getComment() {
        return comment;
    }

    public void setComment(String comment) {
        this.comment = comment;
    }

    public List<String> getImageUrls() {
        return imageUrls;
    }

    public void setImageUrls(List<String> imageUrls) {
        this.imageUrls = imageUrls;
    }
}
