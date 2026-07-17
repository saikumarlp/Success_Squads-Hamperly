package com.hamperly.luxurygifthampers.dto;

public class UserResponse {
    private Long id;
    private String fullName;
    private String email;
    private String mobileNumber;

    public UserResponse() {
    }

    public UserResponse(Long id, String fullName, String email, String mobileNumber) {
        this.id = id;
        this.fullName = fullName;
        this.email = email;
        this.mobileNumber = mobileNumber;
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

    // Manual Builder
    public static class UserResponseBuilder {
        private Long id;
        private String fullName;
        private String email;
        private String mobileNumber;

        public UserResponseBuilder id(Long id) { this.id = id; return this; }
        public UserResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public UserResponseBuilder email(String email) { this.email = email; return this; }
        public UserResponseBuilder mobileNumber(String mobileNumber) { this.mobileNumber = mobileNumber; return this; }

        public UserResponse build() {
            return new UserResponse(id, fullName, email, mobileNumber);
        }
    }

    public static UserResponseBuilder builder() {
        return new UserResponseBuilder();
    }
}
