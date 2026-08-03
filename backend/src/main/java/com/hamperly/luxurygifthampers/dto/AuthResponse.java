package com.hamperly.luxurygifthampers.dto;

public class AuthResponse {
    private String token;
    private String type = "Bearer";
    private String fullName;
    private String email;

    public AuthResponse() {
    }

    public AuthResponse(String token, String fullName, String email) {
        this.token = token;
        this.fullName = fullName;
        this.email = email;
    }

    public AuthResponse(String token, String type, String fullName, String email) {
        this.token = token;
        this.type = type;
        this.fullName = fullName;
        this.email = email;
    }

    // Getters and Setters
    public String getToken() { return token; }
    public void setToken(String token) { this.token = token; }

    public String getType() { return type; }
    public void setType(String type) { this.type = type; }

    public String getFullName() { return fullName; }
    public void setFullName(String fullName) { this.fullName = fullName; }

    public String getEmail() { return email; }
    public void setEmail(String email) { this.email = email; }

    // Manual Builder
    public static class AuthResponseBuilder {
        private String token;
        private String type = "Bearer";
        private String fullName;
        private String email;

        public AuthResponseBuilder token(String token) { this.token = token; return this; }
        public AuthResponseBuilder type(String type) { this.type = type; return this; }
        public AuthResponseBuilder fullName(String fullName) { this.fullName = fullName; return this; }
        public AuthResponseBuilder email(String email) { this.email = email; return this; }

        public AuthResponse build() {
            return new AuthResponse(token, type, fullName, email);
        }
    }

    public static AuthResponseBuilder builder() {
        return new AuthResponseBuilder();
    }
}
