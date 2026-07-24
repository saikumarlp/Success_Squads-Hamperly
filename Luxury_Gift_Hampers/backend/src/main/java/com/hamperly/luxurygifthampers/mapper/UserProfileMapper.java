package com.hamperly.luxurygifthampers.mapper;

import com.hamperly.luxurygifthampers.dto.UpdateProfileRequest;
import com.hamperly.luxurygifthampers.dto.UserProfileResponse;
import com.hamperly.luxurygifthampers.entity.User;
import org.springframework.stereotype.Component;

@Component
public class UserProfileMapper {

    public UserProfileResponse toResponse(User user) {
        if (user == null) {
            return null;
        }

        return UserProfileResponse.builder()
                .id(user.getId())
                .fullName(user.getFullName())
                .email(user.getEmail())
                .mobileNumber(user.getMobileNumber())
                .profilePictureUrl(user.getProfilePictureUrl())
                .dateOfBirth(user.getDateOfBirth())
                .gender(user.getGender())
                .bio(user.getBio())
                .createdAt(user.getCreatedAt())
                .updatedAt(user.getUpdatedAt())
                .build();
    }

    public void updateEntityFromRequest(UpdateProfileRequest request, User user) {
        if (request == null || user == null) {
            return;
        }

        if (request.getFullName() != null) {
            user.setFullName(request.getFullName().trim());
        }
        if (request.getMobileNumber() != null) {
            user.setMobileNumber(request.getMobileNumber().trim());
        }
        user.setProfilePictureUrl(request.getProfilePictureUrl() != null ? request.getProfilePictureUrl().trim() : null);
        user.setDateOfBirth(request.getDateOfBirth());
        user.setGender(request.getGender() != null ? request.getGender().trim() : null);
        user.setBio(request.getBio() != null ? request.getBio().trim() : null);
    }
}
