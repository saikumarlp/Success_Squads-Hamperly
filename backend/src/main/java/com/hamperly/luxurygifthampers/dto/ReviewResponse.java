package com.hamperly.luxurygifthampers.dto;

import java.util.List;

public class ReviewResponse {
    private Long id;
    private Long productId;
    private String productName;
    private String orderId;
    private Integer rating;
    private String title;
    private String comment;
    private Boolean verifiedPurchase;
    private Boolean isHidden;
    private String userFullName;
    private String userEmail;
    private String userProfilePictureUrl;
    private List<String> imageUrls;
    private String createdAt;
    private String updatedAt;

    public ReviewResponse() {
    }

    public ReviewResponse(Long id, Long productId, String productName, String orderId, Integer rating, String title, String comment, Boolean verifiedPurchase, Boolean isHidden, String userFullName, String userEmail, String userProfilePictureUrl, List<String> imageUrls, String createdAt, String updatedAt) {
        this.id = id;
        this.productId = productId;
        this.productName = productName;
        this.orderId = orderId;
        this.rating = rating;
        this.title = title;
        this.comment = comment;
        this.verifiedPurchase = verifiedPurchase;
        this.isHidden = isHidden;
        this.userFullName = userFullName;
        this.userEmail = userEmail;
        this.userProfilePictureUrl = userProfilePictureUrl;
        this.imageUrls = imageUrls;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public Long getProductId() { return productId; }
    public void setProductId(Long productId) { this.productId = productId; }

    public String getProductName() { return productName; }
    public void setProductName(String productName) { this.productName = productName; }

    public String getOrderId() { return orderId; }
    public void setOrderId(String orderId) { this.orderId = orderId; }

    public Integer getRating() { return rating; }
    public void setRating(Integer rating) { this.rating = rating; }

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getComment() { return comment; }
    public void setComment(String comment) { this.comment = comment; }

    public Boolean getVerifiedPurchase() { return verifiedPurchase; }
    public void setVerifiedPurchase(Boolean verifiedPurchase) { this.verifiedPurchase = verifiedPurchase; }

    public Boolean getIsHidden() { return isHidden; }
    public void setIsHidden(Boolean isHidden) { this.isHidden = isHidden; }

    public String getUserFullName() { return userFullName; }
    public void setUserFullName(String userFullName) { this.userFullName = userFullName; }

    public String getUserEmail() { return userEmail; }
    public void setUserEmail(String userEmail) { this.userEmail = userEmail; }

    public String getUserProfilePictureUrl() { return userProfilePictureUrl; }
    public void setUserProfilePictureUrl(String userProfilePictureUrl) { this.userProfilePictureUrl = userProfilePictureUrl; }

    public List<String> getImageUrls() { return imageUrls; }
    public void setImageUrls(List<String> imageUrls) { this.imageUrls = imageUrls; }

    public String getCreatedAt() { return createdAt; }
    public void setCreatedAt(String createdAt) { this.createdAt = createdAt; }

    public String getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(String updatedAt) { this.updatedAt = updatedAt; }
}
