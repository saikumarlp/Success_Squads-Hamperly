package com.hamperly.luxurygifthampers.entity;

import jakarta.persistence.*;

@Entity
@Table(name = "review_images")
public class ReviewImage {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "review_id", nullable = false)
    private Review review;

    @Column(name = "image_url", nullable = false, columnDefinition = "TEXT")
    private String imageUrl;

    public ReviewImage() {
    }

    public ReviewImage(Long id, Review review, String imageUrl) {
        this.id = id;
        this.review = review;
        this.imageUrl = imageUrl;
    }

    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public Review getReview() {
        return review;
    }

    public void setReview(Review review) {
        this.review = review;
    }

    public String getImageUrl() {
        return imageUrl;
    }

    public void setImageUrl(String imageUrl) {
        this.imageUrl = imageUrl;
    }

    public static ReviewImageBuilder builder() {
        return new ReviewImageBuilder();
    }

    public static class ReviewImageBuilder {
        private Long id;
        private Review review;
        private String imageUrl;

        public ReviewImageBuilder id(Long id) { this.id = id; return this; }
        public ReviewImageBuilder review(Review review) { this.review = review; return this; }
        public ReviewImageBuilder imageUrl(String imageUrl) { this.imageUrl = imageUrl; return this; }

        public ReviewImage build() {
            return new ReviewImage(id, review, imageUrl);
        }
    }
}
