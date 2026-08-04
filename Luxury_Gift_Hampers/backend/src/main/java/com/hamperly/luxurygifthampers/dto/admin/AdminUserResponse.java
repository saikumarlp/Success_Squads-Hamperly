package com.hamperly.luxurygifthampers.dto.admin;

import java.time.LocalDateTime;

public class AdminUserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;
    private String role;
    private Boolean blocked;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;

    public AdminUserResponse() {
    }

    public AdminUserResponse(Long id, String fullName, String email, String mobileNumber, String role, Boolean blocked, LocalDateTime createdAt, LocalDateTime updatedAt) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
        this.role = role;
        this.blocked = blocked;
        this.createdAt = createdAt;
        this.updatedAt = updatedAt;
    }

    // Getters and Setters
    public Long getId() { return id; }
    public void setId(Long id) { this.id = id; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    public String getMobileNumber() { return mobileNumber; }
    public void setMobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; }

    public String getRole() { return role; }
    public void setRole(String role) { this.role = role; }

    public Boolean getBlocked() { return blocked; }
    public void setBlocked(Boolean blocked) { this.blocked = blocked; }

    public LocalDateTime getCreatedAt() { return createdAt; }
    public void setCreatedAt(LocalDateTime createdAt) { this.createdAt = createdAt; }

    public LocalDateTime getUpdatedAt() { return updatedAt; }
    public void setUpdatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; }

    public static AdminUserResponseBuilder builder() { return new AdminUserResponseBuilder(); }

    public static class AdminUserResponseBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String mobileNumber;
        private String role;
        private Boolean blocked;
        private LocalDateTime createdAt;
        private LocalDateTime updatedAt;

        public AdminUserResponseBuilder id(Long id) { this.id = id; return this; }
        public AdminUserResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AdminUserResponseBuilder email(String email) { this.email = email; return this; }
        public AdminUserResponseBuilder mobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; return this; }
        public AdminUserResponseBuilder role(String role) { this.role = role; return this; }
        public AdminUserResponseBuilder blocked(Boolean blocked) { this.blocked = blocked; return this; }
        public AdminUserResponseBuilder createdAt(LocalDateTime createdAt) { this.createdAt = createdAt; return this; }
        public AdminUserResponseBuilder updatedAt(LocalDateTime updatedAt) { this.updatedAt = updatedAt; return this; }

        public AdminUserResponse build() {
            return new AdminUserResponse(id, fullName, email, mobileNumber, role, blocked, createdAt, updatedAt);
        }
    }
}
