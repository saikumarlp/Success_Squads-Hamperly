package com.hamperly.luxurygifthampers.entity;

import jakarta.persistence.*;
import java.time.LocalDateTime;

@Entity
@Table(name = "jwt_tokens")
public class JwtToken {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    @Column(name = "token_id")
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    @Column(name = "token", nullable = false)
    private String token;

    @Column(name = "created_at", insertable = false, updatable = false)
    private LocalDateTime createdAt;

    @Column(name = "expires_at", nullable = false)
    private LocalDateTime expiresAt;

    public JwtToken() {
    }

    public JwtToken(Long id, User user, String token, LocalDateTime createdAt, LocalDateTime expiresAt) {
        this.id = id;
        this.user = user;
        this.token = token;
        this.createdAt = createdAt;
        this.expiresAt = expiresAt;
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

    public String getToken() {
        return token;
    }

    public void setToken(String token) {
        this.token = token;
    }

    public LocalDateTime getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(LocalDateTime createdAt) {
        this.createdAt = createdAt;
    }

    public LocalDateTime getExpiresAt() {
        return expiresAt;
    }

    public void setExpiresAt(LocalDateTime expiresAt) {
        this.expiresAt = expiresAt;
    }

    public static JwtTokenBuilder builder() {
        return new JwtTokenBuilder();
    }

    public static class JwtTokenBuilder {
        private Long id;
        private User user;
        private String token;
        private LocalDateTime createdAt;
        private LocalDateTime expiresAt;

        public JwtTokenBuilder id(Long id) {
            this.id = id;
            return this;
        }

        public JwtTokenBuilder user(User user) {
            this.user = user;
            return this;
        }

        public JwtTokenBuilder token(String token) {
            this.token = token;
            return this;
        }

        public JwtTokenBuilder createdAt(LocalDateTime createdAt) {
            this.createdAt = createdAt;
            return this;
        }

        public JwtTokenBuilder expiresAt(LocalDateTime expiresAt) {
            this.expiresAt = expiresAt;
            return this;
        }

        public JwtToken build() {
            return new JwtToken(id, user, token, createdAt, expiresAt);
        }
    }
}
