package com.hamperly.luxurygifthampers.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "reviews", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "product_id"})
})
public class Review {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "order_id", nullable = false)
    private Order order;

    @Column(name = "rating", nullable = false)
    private Integer rating;

    @Column(name = "title")
    private String title;

    @Column(name = "comment", nullable = false, columnDefinition = "TEXT")
    private String comment;

    @Column(name = "verified_purchase", nullable = false)
    private Boolean verifiedPurchase = true;

    @Column(name = "is_hidden", nullable = false)
    private Boolean isHidden = false;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "updated_at", nullable = false)
    private LocalDateTime updatedAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        this.updatedAt = LocalDateTime.now();
        if (this.verifiedPurchase == null) {
            this.verifiedPurchase = true;
        }
        if (this.isHidden == null) {
            this.isHidden = false;
        }
    }

    @PreUpdate
    protected void onUpdate() {
        this.updatedAt = LocalDateTime.now();
    }

    public Review() {
    }

    public Review(Long id, User user, Product product, Order order, Integer rating, String title, String comment, Boolean verifiedPurchase, Boolean isHidden, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.user = user;
        this.product = product;
        this.order = order;
        this.rating = rating;
        this.title = title;
        this.comment = comment;
        this.verifiedPurchase = verifiedPurchase;
        this.isHidden = isHidden;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public User getUser() {
        return user;
    }

    public void setUser(User user) {
        this.user = user;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public Order getOrder() {
        return order;
    }

    public void setOrder(Order order) {
        this.order = order;
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

    public Boolean getVerifiedPurchase() {
        return verifiedPurchase;
    }

    public void setVerifiedPurchase(Boolean verifiedPurchase) {
        this.verifiedPurchase = verifiedPurchase;
    }

    public Boolean getIsHidden() {
        return isHidden;
    }

    public void setIsHidden(Boolean isHidden) {
        this.isHidden = isHidden;
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

    public static ReviewBuilder builder() {
        return new ReviewBuilder();
    }

    public static class ReviewBuilder {
        private Long id;
        private User user;
        private Product product;
        private Order order;
        private Integer rating;
        private String title;
        private String comment;
        private Boolean verifiedPurchase;
        private Boolean isHidden;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public ReviewBuilder id(Long id) { this.id = id; return this; }
        public ReviewBuilder user(User user) { this.user = user; return this; }
        public ReviewBuilder product(Product product) { this.product = product; return this; }
        public ReviewBuilder order(Order order) { this.order = order; return this; }
        public ReviewBuilder rating(Integer rating) { this.rating = rating; return this; }
        public ReviewBuilder title(String title) { this.title = title; return this; }
        public ReviewBuilder comment(String comment) { this.comment = comment; return this; }
        public ReviewBuilder verifiedPurchase(Boolean verifiedPurchase) { this.verifiedPurchase = verifiedPurchase; return this; }
        public ReviewBuilder isHidden(Boolean isHidden) { this.isHidden = isHidden; return this; }
        public ReviewBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public ReviewBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public Review build() {
            return new Review(id, user, product, order, rating, title, comment, verifiedPurchase, isHidden, createdAt, updatedAt);
        }
    }
}
