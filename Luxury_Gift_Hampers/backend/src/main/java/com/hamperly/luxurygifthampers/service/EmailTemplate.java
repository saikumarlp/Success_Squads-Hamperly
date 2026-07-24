package com.hamperly.luxurygifthampers.service;

import org.springframework.stereotype.Component;

@Component
public class EmailTemplate {

    public String buildPasswordResetEmail(String recipientName, String resetLink) {
        String name = (recipientName != null && !recipientName.isBlank()) ? recipientName : "Valued Customer";
        
        return """
            <!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Password Reset - Hamperly</title>
                <style>
                    body {
                        font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif;
                        background-color: #f4f6f9;
                        margin: 0;
                        padding: 0;
                        color: #333333;
                    }
                    .container {
                        max-width: 600px;
                        margin: 40px auto;
                        background: #ffffff;
                        border-radius: 12px;
                        overflow: hidden;
                        box-shadow: 0 4px 20px rgba(0, 0, 0, 0.08);
                    }
                    .header {
                        background: linear-gradient(135deg, #1e293b 0%, #0f172a 100%);
                        color: #ffffff;
                        padding: 30px 20px;
                        text-align: center;
                    }
                    .header h1 {
                        margin: 0;
                        font-size: 26px;
                        letter-spacing: 1px;
                        font-weight: 600;
                        color: #e2e8f0;
                    }
                    .header p {
                        margin: 5px 0 0 0;
                        font-size: 13px;
                        color: #cbd5e1;
                        text-transform: uppercase;
                        letter-spacing: 2px;
                    }
                    .content {
                        padding: 40px 30px;
                        line-height: 1.6;
                    }
                    .content h2 {
                        color: #1e293b;
                        font-size: 20px;
                        margin-top: 0;
                    }
                    .content p {
                        color: #475569;
                        font-size: 15px;
                    }
                    .btn-wrapper {
                        text-align: center;
                        margin: 30px 0;
                    }
                    .btn {
                        background: linear-gradient(135deg, #d97706 0%, #b45309 100%);
                        color: #ffffff !important;
                        text-decoration: none;
                        padding: 14px 32px;
                        font-size: 15px;
                        font-weight: 600;
                        border-radius: 8px;
                        display: inline-block;
                        box-shadow: 0 4px 12px rgba(217, 119, 6, 0.3);
                    }
                    .warning-box {
                        background-color: #fffbeb;
                        border-left: 4px solid #f59e0b;
                        padding: 15px;
                        border-radius: 4px;
                        margin: 25px 0;
                        font-size: 14px;
                        color: #92400e;
                    }
                    .footer {
                        background-color: #f8fafc;
                        padding: 20px 30px;
                        text-align: center;
                        font-size: 12px;
                        color: #94a3b8;
                        border-top: 1px solid #e2e8f0;
                    }
                    .link-break {
                        word-break: break-all;
                        font-size: 12px;
                        color: #64748b;
                    }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header">
                        <h1>HAMPERLY</h1>
                        <p>Luxury Gift Hampers</p>
                    </div>
                    <div class="content">
                        <h2>Password Reset Request</h2>
                        <p>Hello <strong>{{recipientName}}</strong>,</p>
                        <p>We received a request to reset the password for your account. Click the button below to choose a new password:</p>
                        
                        <div class="btn-wrapper">
                            <a href="{{resetLink}}" class="btn">Reset Password</a>
                        </div>
                        
                        <div class="warning-box">
                            <strong>Note:</strong> This link is valid for <strong>15 minutes</strong>. For security reasons, do not share this link with anyone.
                        </div>
                        
                        <p>If you did not request a password reset, you can safely ignore this email. Your password will remain unchanged.</p>
                        
                        <p style="margin-top: 30px; font-size: 13px; color: #64748b;">
                            If the button above does not work, copy and paste this link into your browser:<br>
                            <span class="link-break">{{resetLink}}</span>
                        </p>
                    </div>
                    <div class="footer">
                        &copy; 2026 Hamperly Luxury Gift Hampers. All rights reserved.<br>
                        This is an automated security email, please do not reply directly.
                    </div>
                </div>
            </body>
            </html>
            """
            .replace("{{recipientName}}", name)
            .replace("{{resetLink}}", resetLink != null ? resetLink : "");
    }
}
