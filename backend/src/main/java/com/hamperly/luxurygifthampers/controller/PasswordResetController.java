package com.hamperly.luxurygifthampers.controller;

import com.hamperly.luxurygifthampers.dto.ForgotPasswordRequest;
import com.hamperly.luxurygifthampers.dto.ResetPasswordRequest;
import com.hamperly.luxurygifthampers.service.PasswordResetService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/auth")
public class PasswordResetController {

    @Autowired
    private PasswordResetService passwordResetService;

    @PostMapping("/forgot-password")
    public ResponseEntity<Map<String, String>> forgotPassword(@Valid @RequestBody ForgotPasswordRequest request) {
        Map<String, String> response = passwordResetService.processForgotPassword(request);
        return ResponseEntity.ok(response);
    }

    @PostMapping("/reset-password")
    public ResponseEntity<Map<String, String>> resetPassword(@Valid @RequestBody ResetPasswordRequest request) {
        Map<String, String> response = passwordResetService.processResetPassword(request);
        return ResponseEntity.ok(response);
    }
}
