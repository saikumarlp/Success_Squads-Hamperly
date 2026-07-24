package com.hamperly.luxurygifthampers.controller;

import com.hamperly.luxurygifthampers.dto.UpdateProfileRequest;
import com.hamperly.luxurygifthampers.dto.UserProfileResponse;
import com.hamperly.luxurygifthampers.service.UserProfileService;
import jakarta.validation.Valid;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/profile")
public class ProfileController {

    private static final Logger logger = LoggerFactory.getLogger(ProfileController.class);

    private final UserProfileService userProfileService;

    @Autowired
    public ProfileController(UserProfileService userProfileService) {
        this.userProfileService = userProfileService;
    }

    @GetMapping
    public ResponseEntity<UserProfileResponse> getProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            logger.warn("Unauthorized profile access attempt without valid user principal");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = userDetails.getUsername();
        logger.info("Received request to GET profile for authenticated user: [{}]", email);

        UserProfileResponse response = userProfileService.getProfile(email);
        return ResponseEntity.ok(response);
    }

    @PutMapping
    public ResponseEntity<UserProfileResponse> updateProfile(
            @Valid @RequestBody UpdateProfileRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {

        if (userDetails == null) {
            logger.warn("Unauthorized profile update attempt without valid user principal");
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }

        String email = userDetails.getUsername();
        logger.info("Received request to PUT profile update for authenticated user: [{}]", email);

        UserProfileResponse response = userProfileService.updateProfile(email, request);
        return ResponseEntity.ok(response);
    }
}
