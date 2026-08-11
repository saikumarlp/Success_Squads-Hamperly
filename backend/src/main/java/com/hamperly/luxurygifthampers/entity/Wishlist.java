package com.hamperly.luxurygifthampers.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "wishlists", uniqueConstraints = {
    @UniqueConstraint(columnNames = {"user_id", "product_id"})
})
public class Wishlist {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "created_at", nullable = false, updatable = false)
    private LocalDateTime createdAt;

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }

    public Wishlist() {
    }

    public Wishlist(Long id, User user, Product product, LocalDateTime createdAt) {
        this.id = id;
        this.user = user;
        this.product = product;
        this.createdAt = createdAt;
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

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public static WishlistBuilder builder() {
        return new WishlistBuilder();
    }

    public static class WishlistBuilder {
        private Long id;
        private User user;
        private Product product;
        private LocalDateTime createdAt;

        public WishlistBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public WishlistBuilder user(User user) {
            this.user = user;
            return this;
        }

        public WishlistBuilder product(Product product) {
            this.product = product;
            return this;
        }

        public WishlistBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public Wishlist build() {
            return new Wishlist(id, user, product, createdAt);
        }
    }
}
