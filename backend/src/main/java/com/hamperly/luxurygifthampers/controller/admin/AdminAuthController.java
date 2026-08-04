package com.hamperly.luxurygifthampers.controller.admin;

import com.hamperly.luxurygifthampers.dto.LoginRequest;
import com.hamperly.luxurygifthampers.dto.admin.AdminAuthResponse;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.security.JwtTokenProvider;
import com.hamperly.luxurygifthampers.service.UserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.authentication.AuthenticationManager;
import org.springframework.security.authentication.DisabledException;
import org.springframework.security.authentication.UsernamePasswordAuthenticationToken;
import org.springframework.security.core.Authentication;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.Map;

@RestController
@RequestMapping("/api/admin/auth")
public class AdminAuthController {

    @Autowired
    private AuthenticationManager authenticationManager;

    @Autowired
    private UserService userService;

    @Autowired
    private JwtTokenProvider tokenProvider;

    @PostMapping("/login")
    public ResponseEntity<?> loginAdmin(@Valid @RequestBody LoginRequest loginRequest) {
        try {
            User user = userService.getUserByEmail(loginRequest.getEmail());
            if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
                return new ResponseEntity<>(Map.of("message", "Access Denied: Admin privileges required"), HttpStatus.FORBIDDEN);
            }

            Authentication authentication = authenticationManager.authenticate(
                    new UsernamePasswordAuthenticationToken(
                            loginRequest.getEmail(),
                            loginRequest.getPassword()
                    )
            );

            SecurityContextHolder.getContext().setAuthentication(authentication);
            String jwt = tokenProvider.generateToken(authentication);

            return ResponseEntity.ok(new AdminAuthResponse(
                    jwt,
                    user.getFullName(),
                    user.getEmail(),
                    user.getRole()
            ));
        } catch (DisabledException ex) {
            return new ResponseEntity<>(Map.of("message", "Account is blocked. Please contact support."), HttpStatus.UNAUTHORIZED);
        } catch (Exception ex) {
            return new ResponseEntity<>(Map.of("message", "Invalid email or password"), HttpStatus.UNAUTHORIZED);
        }
    }

    @PostMapping("/logout")
    public ResponseEntity<?> logoutAdmin() {
        SecurityContextHolder.clearContext();
        return ResponseEntity.ok(Map.of("message", "Logged out successfully"));
    }

    @GetMapping("/me")
    public ResponseEntity<?> getAdminProfile(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
        User user = userService.getUserByEmail(userDetails.getUsername());
        if (!"ADMIN".equalsIgnoreCase(user.getRole())) {
            return new ResponseEntity<>(Map.of("message", "Forbidden"), HttpStatus.FORBIDDEN);
        }
        Map<String, Object> details = new HashMap<>();
        details.put("id", user.getId());
        details.put("fullName", user.getFullName());
        details.put("email", user.getEmail());
        details.put("role", user.getRole());
        return ResponseEntity.ok(details);
    }
}
