package com.hamperly.luxurygifthampers.controller.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminUserRequest;
import com.hamperly.luxurygifthampers.dto.admin.AdminUserResponse;
import com.hamperly.luxurygifthampers.service.admin.AdminUserService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.Map;

@RestController
@RequestMapping("/api/admin/users")
public class AdminUserController {

    @Autowired
    private AdminUserService adminUserService;

    @GetMapping
    public ResponseEntity<Page<AdminUserResponse>> getUsers(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size,
            @RequestParam(value = "sortBy", defaultValue = "id") String sortBy,
            @RequestParam(value = "direction", defaultValue = "ASC") String direction) {

        Sort sort = Sort.by(Sort.Direction.fromString(direction), sortBy);
        Pageable pageable = PageRequest.of(page, size, sort);
        return ResponseEntity.ok(adminUserService.searchUsers(search, pageable));
    }

    @GetMapping("/{id}")
    public ResponseEntity<AdminUserResponse> getUserById(@PathVariable("id") Long id) {
        return ResponseEntity.ok(adminUserService.getUserById(id));
    }

    @PutMapping("/{id}")
    public ResponseEntity<AdminUserResponse> updateUser(@PathVariable("id") Long id, @Valid @RequestBody AdminUserRequest request) {
        return ResponseEntity.ok(adminUserService.updateUser(id, request));
    }

    @PatchMapping("/{id}/role")
    public ResponseEntity<AdminUserResponse> updateUserRole(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {
        String role = body.get("role");
        if (role == null || role.trim().isEmpty()) {
            throw new IllegalArgumentException("Role is required");
        }
        return ResponseEntity.ok(adminUserService.updateUserRole(id, role.trim()));
    }

    @PatchMapping("/{id}/block")
    public ResponseEntity<AdminUserResponse> toggleUserBlock(@PathVariable("id") Long id, @RequestBody Map<String, Boolean> body) {
        Boolean blocked = body.get("blocked");
        if (blocked == null) {
            throw new IllegalArgumentException("Blocked status is required");
        }
        return ResponseEntity.ok(adminUserService.toggleUserBlock(id, blocked));
    }

    @PostMapping("/{id}/reset-password")
    public ResponseEntity<?> resetUserPassword(@PathVariable("id") Long id, @RequestBody Map<String, String> body) {
        String password = body.get("password");
        if (password == null || password.trim().isEmpty()) {
            throw new IllegalArgumentException("Password is required");
        }
        adminUserService.resetPassword(id, password.trim());
        return ResponseEntity.ok().body(Map.of("message", "Password reset successful"));
    }
}
