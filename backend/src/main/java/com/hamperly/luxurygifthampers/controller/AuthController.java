package com.hamperly.luxurygifthampers.controller;
import com.hamperly.luxurygifthampers.dto.AuthResponse;
import com.hamperly.luxurygifthampers.dto.LoginRequest;
import com.hamperly.luxurygifthampers.dto.RegisterRequest;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.entity.PasswordResetToken;
import com.hamperly.luxurygifthampers.entity.JwtToken;
import com.hamperly.luxurygifthampers.repository.PasswordResetTokenRepository;
import com.hamperly.luxurygifthampers.repository.JwtTokenRepository;
import com.hamperly.luxurygifthampers.security.JwtTokenProvider;
import com.hamperly.luxurygifthampers.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import jakarta.servlet.http.HttpServletRequest;
import org.springframework.util.StringUtils;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDateTime;
import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @Autowired
    private PasswordResetTokenRepository passwordResetTokenRepository;

    @Autowired
    private JwtTokenRepository jwtTokenRepository;

    @Value("${hamperly.app.jwtExpirationMs}")
    private int jwtExpirationMs;

    @PostMapping("/register")
    public ResponseEntity<?> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        User user = userService.registerUser(registerRequest);

        Authentication authentication = authenticationManager.authenticate(
                new UsernamePasswordAuthenticationToken(
                        registerRequest.getEmail(),
                        registerRequest.getPassword()
                )
        );

        SecurityContextHolder.getContext().setAuthentication(authentication);
        String jwt = tokenProvider.generateToken(authentication);

        // Save token to database
        jwtTokenRepository.save(JwtToken.builder()
                .user(user)
                .token(jwt)
                .expiresAt(LocalDateTime.now().plusSeconds(jwtExpirationMs / 1000))
                .build());

        return new ResponseEntity<>(AuthResponse.builder()
                .token(jwt)
                .fullName(user.getFullName())
                .email(user.getEmail())
                .build(), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<?> authenticateUser(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);
            User user = userService.getUserByEmail(loginRequest.getEmail());

            // Save token to database
            jwtTokenRepository.save(JwtToken.builder()
                    .user(user)
                    .token(jwt)
                    .expiresAt(LocalDateTime.now().plusSeconds(jwtExpirationMs / 1000))
                    .build());

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwt)
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .build());
        } catch (Exception ex) {
            ex.printStackTrace();
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Invalid email or password");
            return new ResponseEntity<>(errors, HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutUser(HttpServletRequest request) {
        String bearerToken = request.getHeader("Authorization");
        if (StringUtils.hasText(bearerToken) && bearerToken.startsWith("Bearer ")) {
            String jwt = bearerToken.substring(7);
            jwtTokenRepository.findByToken(jwt).ifPresent(token -> {
                jwtTokenRepository.delete(token);
            });
        }
        Map<String, String> response = new HashMap<>();
        response.put("message", "Logged out successfully");
        return ResponseEntity.ok(response);
    }
}
