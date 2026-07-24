package com.hamperly.luxurygifthampers.service;

import jakarta.mail.MessagingException;
import jakarta.mail.internet.MimeMessage;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
public class EmailServiceImpl implements EmailService {

    private static final Logger logger = LoggerFactory.getLogger(EmailServiceImpl.class);

    @Autowired(required = false)
    private JavaMailSender mailSender;

    @Autowired
    private EmailTemplate emailTemplate;

    @Value("${spring.mail.username:noreply@hamperly.com}")
    private String fromEmail;

    @Override
    public void sendPasswordResetEmail(String toEmail, String recipientName, String resetLink) {
        String subject = "Password Reset Request - Hamperly Luxury Gift Hampers";

        logger.info("Password Reset Link generated for email [{}]: {}", toEmail, resetLink);

        try {
            String htmlContent = emailTemplate.buildPasswordResetEmail(recipientName, resetLink);

            if (mailSender == null) {
                logger.warn("JavaMailSender is not configured. Email to [{}] with reset link [{}] logged only.", toEmail, resetLink);
                return;
            }

            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");
            helper.setFrom(fromEmail);
            helper.setTo(toEmail);
            helper.setSubject(subject);
            helper.setText(htmlContent, true);

            mailSender.send(message);
            logger.info("Password reset email successfully sent to [{}]", toEmail);
        } catch (MessagingException ex) {
            logger.error("Failed to send password reset email to [{}]", toEmail, ex);
        } catch (Exception ex) {
            logger.error("Unexpected error sending email to [{}]: {}", toEmail, ex.getMessage(), ex);
        }
    }
}
