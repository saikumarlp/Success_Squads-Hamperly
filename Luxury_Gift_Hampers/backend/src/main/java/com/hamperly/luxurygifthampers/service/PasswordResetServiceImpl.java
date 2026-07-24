package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.ForgotPasswordRequest;
import com.hamperly.luxurygifthampers.dto.ResetPasswordRequest;
import com.hamperly.luxurygifthampers.entity.PasswordResetToken;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.exception.ExpiredResetTokenException;
import com.hamperly.luxurygifthampers.exception.InvalidResetTokenException;
import com.hamperly.luxurygifthampers.exception.PasswordMismatchException;
import com.hamperly.luxurygifthampers.exception.WeakPasswordException;
import com.hamperly.luxurygifthampers.repository.PasswordResetTokenRepository;
import com.hamperly.luxurygifthampers.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.nio.charset.StandardCharsets;
import java.security.MessageDigest;
import java.security.NoSuchAlgorithmException;
import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.*;
import java.util.regex.Pattern;

@Service
public class PasswordResetServiceImpl implements PasswordResetService {

    private static final Logger logger = LoggerFactory.getLogger(PasswordResetServiceImpl.class);

    private static final String GENERIC_FORGOT_PASSWORD_RESPONSE = 
            "If an account with this email exists, a password reset link has been sent.";
    
    private static final Set<String> COMMON_WEAK_PASSWORDS = Set.of(
            "password", "password123", "12345678", "123456789", "admin123",
            "admin1234", "qwerty123", "qwerty1234", "welcome123", "password@123",
            "p@ssword123", "pass1234", "letmein123"
    );

    private static final Pattern UPPERCASE_PATTERN = Pattern.compile(".*[A-Z].*");
    private static final Pattern LOWERCASE_PATTERN = Pattern.compile(".*[a-z].*");
    private static final Pattern DIGIT_PATTERN = Pattern.compile(".*[0-9].*");
    private static final Pattern SPECIAL_CHAR_PATTERN = Pattern.compile(".*[!@#$%^&*()_+\\-=\\[\\]{};':\"\\\\|,.<>\\/?].*");

    private final SecureRandom secureRandom = new SecureRandom();

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private EmailService emailService;

    @Value("${app.reset-password.url:http://localhost:5173/reset-password}")
    private String resetPasswordBaseUrl;

    @Override
    @Transactional
    public Map<String, String> processForgotPassword(ForgotPasswordRequest request) {
        String email = request.getEmail().trim().toLowerCase();
        Optional<User> userOptional = userRepository.findByEmail(email);

        if (userOptional.isPresent()) {
            User user = userOptional.get();

            // Invalidate any existing active reset tokens for this user
            passwordResetTokenRepository.invalidateAllUserTokens(user);

            // Generate cryptographically secure random token
            String rawToken = generateSecureToken();

            // Hash the token before persisting
            String tokenHash = hashToken(rawToken);

            // Store reset token with 15 minutes validity
            PasswordResetToken resetToken = PasswordResetToken.builder()
                    .tokenHash(tokenHash)
                    .user(user)
                    .expiresAt(LocalDateTime.now().plusMinutes(15))
                    .used(false)
                    .build();

            passwordResetTokenRepository.save(resetToken);

            // Build secure reset link
            String resetLink = resetPasswordBaseUrl + "?token=" + rawToken;

            // Send HTML email securely without failing processForgotPassword
            try {
                emailService.sendPasswordResetEmail(user.getEmail(), user.getFullName(), resetLink);
            } catch (Exception ex) {
                logger.error("Failed to send password reset email to [{}]: {}", user.getEmail(), ex.getMessage(), ex);
            }
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", GENERIC_FORGOT_PASSWORD_RESPONSE);
        return response;
    }

    @Override
    @Transactional
    public Map<String, String> processResetPassword(ResetPasswordRequest request) {
        String newPassword = request.getNewPassword();
        String confirmPassword = request.getConfirmPassword();
        String rawToken = request.getToken();

        // 1. Validate password match
        if (!newPassword.equals(confirmPassword)) {
            throw new PasswordMismatchException("Passwords do not match");
        }

        // 2. Validate password strength policy
        validatePasswordStrength(newPassword);

        // 3. Hash input token and search in database
        String tokenHash = hashToken(rawToken);
        PasswordResetToken token = passwordResetTokenRepository.findByTokenHash(tokenHash)
                .orElseThrow(() -> new InvalidResetTokenException("Invalid or non-existent password reset token"));

        // 4. Check if already used
        if (token.isUsed()) {
            throw new InvalidResetTokenException("Password reset token has already been used");
        }

        // 5. Check if expired
        if (token.getExpiresAt().isBefore(LocalDateTime.now())) {
            throw new ExpiredResetTokenException("Password reset token has expired");
        }

        // 6. Update user password
        User user = token.getUser();
        user.setPassword(passwordEncoder.encode(newPassword));
        userRepository.save(user);

        // 7. Mark current reset token as used & invalidate all tokens for user
        token.setUsed(true);
        passwordResetTokenRepository.save(token);
        passwordResetTokenRepository.invalidateAllUserTokens(user);

        Map<String, String> response = new HashMap<>();
        response.put("message", "Password has been reset successfully");
        return response;
    }

    private void validatePasswordStrength(String password) {
        if (password == null || password.length() < 8 || password.length() > 20) {
            throw new WeakPasswordException("Password must be between 8 and 20 characters long");
        }

        if (!UPPERCASE_PATTERN.matcher(password).matches()) {
            throw new WeakPasswordException("Password must contain at least one uppercase letter");
        }

        if (!LOWERCASE_PATTERN.matcher(password).matches()) {
            throw new WeakPasswordException("Password must contain at least one lowercase letter");
        }

        if (!DIGIT_PATTERN.matcher(password).matches()) {
            throw new WeakPasswordException("Password must contain at least one digit");
        }

        if (!SPECIAL_CHAR_PATTERN.matcher(password).matches()) {
            throw new WeakPasswordException("Password must contain at least one special character");
        }

        if (COMMON_WEAK_PASSWORDS.contains(password.toLowerCase())) {
            throw new WeakPasswordException("Password is too weak or common. Please choose a stronger password");
        }
    }

    private String generateSecureToken() {
        byte[] randomBytes = new byte[32];
        secureRandom.nextBytes(randomBytes);
        return Base64.getUrlEncoder().withoutPadding().encodeToString(randomBytes);
    }

    private String hashToken(String token) {
        try {
            MessageDigest digest = MessageDigest.getInstance("SHA-256");
            byte[] hash = digest.digest(token.getBytes(StandardCharsets.UTF_8));
            StringBuilder hexString = new StringBuilder();
            for (byte b : hash) {
                String hex = Integer.toHexString(0xff & b);
                if (hex.length() == 1) {
                    hexString.append('0');
                }
                hexString.append(hex);
            }
            return hexString.toString();
        } catch (NoSuchAlgorithmException e) {
            throw new RuntimeException("Error computing SHA-256 token hash", e);
        }
    }
}
