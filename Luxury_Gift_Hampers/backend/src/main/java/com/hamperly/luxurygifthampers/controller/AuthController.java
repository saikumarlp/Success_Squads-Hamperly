package com.hamperly.luxurygifthampers.controller;

import com.hamperly.luxurygifthampers.dto.AuthResponse;
import com.hamperly.luxurygifthampers.dto.LoginRequest;
import com.hamperly.luxurygifthampers.dto.RegisterRequest;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.security.JwtTokenProvider;
import com.hamperly.luxurygifthampers.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

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

    @PostMapping("/register")
    public ResponseEntity<Map<String, String>> registerUser(@Valid @RequestBody RegisterRequest registerRequest) {
        userService.registerUser(registerRequest);
        Map<String, String> response = new HashMap<>();
        response.put("message", "User registered successfully");
        return new ResponseEntity<>(response, HttpStatus.CREATED);
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

            return ResponseEntity.ok(AuthResponse.builder()
                    .token(jwt)
                    .fullName(user.getFullName())
                    .email(user.getEmail())
                    .build());
        } catch (Exception ex) {
            Map<String, String> errors = new HashMap<>();
            errors.put("message", "Invalid email or password");
            return new ResponseEntity<>(errors, HttpStatus.UNAUTHORIZED);
        }
    }
}
