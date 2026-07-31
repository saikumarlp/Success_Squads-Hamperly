package com.hamperly.luxurygifthampers.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "productimages")
public class ProductImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "image_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "product_id", nullable = false)
    private Product product;

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    public ProductImage() {
    }

    public ProductImage(Long id, Product product, String imageUrl) {
        this.id = id;
        this.product = product;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public static ProductImageBuilder builder() {
        return new ProductImageBuilder();
    }

    public static class ProductImageBuilder {
        private Long id;
        private Product product;
        private String imageUrl;

        public ProductImageBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public ProductImageBuilder product(Product product) {
            this.product = product;
            return this;
        }

        public ProductImageBuilder imageUrl(String imageUrl) {
            this.imageUrl = imageUrl;
            return this;
        }

        public ProductImage build() {
            return new ProductImage(id, product, imageUrl);
        }
    }
}
