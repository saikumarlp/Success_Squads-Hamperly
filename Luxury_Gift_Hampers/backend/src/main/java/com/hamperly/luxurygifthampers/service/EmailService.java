package com.hamperly.luxurygifthampers.service;

public interface EmailService {
    void sendPasswordResetEmail(String toEmail, String recipientName, String resetLink);
}
