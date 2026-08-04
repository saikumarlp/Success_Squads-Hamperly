package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminUserRequest;
import com.hamperly.luxurygifthampers.dto.admin.AdminUserResponse;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;

public interface AdminUserService {
    Page<AdminUserResponse> searchUsers(String search, Pageable pageable);
    AdminUserResponse getUserById(Long id);
    AdminUserResponse updateUser(Long id, AdminUserRequest request);
    AdminUserResponse updateUserRole(Long id, String role);
    AdminUserResponse toggleUserBlock(Long id, Boolean blocked);
    void resetPassword(Long id, String newPassword);
}
