package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminUserRequest;
import com.hamperly.luxurygifthampers.dto.admin.AdminUserResponse;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.repository.admin.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional(readOnly = true)
    public Page<AdminUserResponse> searchUsers(String search, Pageable pageable) {
        String query = (search == null || search.trim().isEmpty()) ? null : search.trim();
        return adminUserRepository.searchUsers(query, pageable).map(this::mapToResponse);
    }

    @Override
    @Transactional(readOnly = true)
    public AdminUserResponse getUserById(Long id) {
        User user = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        return mapToResponse(user);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUser(Long id, AdminUserRequest request) {
        User user = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        
        user.setFullName(request.getFullName());
        user.setEmail(request.getEmail());
        user.setMobileNumber(request.getMobileNumber());
        if (request.getRole() != null) {
            user.setRole(request.getRole().toUpperCase());
        }
        if (request.getBlocked() != null) {
            user.setBlocked(request.getBlocked());
        }
        if (request.getPassword() != null && !request.getPassword().trim().isEmpty()) {
            user.setPassword(passwordEncoder.encode(request.getPassword().trim()));
        }

        User saved = adminUserRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public AdminUserResponse updateUserRole(Long id, String role) {
        User user = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setRole(role.toUpperCase());
        User saved = adminUserRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public AdminUserResponse toggleUserBlock(Long id, Boolean blocked) {
        User user = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setBlocked(blocked);
        User saved = adminUserRepository.save(user);
        return mapToResponse(saved);
    }

    @Override
    @Transactional
    public void resetPassword(Long id, String newPassword) {
        User user = adminUserRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("User not found with id: " + id));
        user.setPassword(passwordEncoder.encode(newPassword));
        adminUserRepository.save(user);
    }

    private AdminUserResponse mapToResponse(User user) {
        return AdminUserResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .role(user.getRole())
                .blocked(user.getBlocked() != null ? user.getBlocked() : false)
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }
}
