package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.UpdateProfileRequest;
import com.hamperly.luxurygifthampers.dto.UserProfileResponse;

public interface UserProfileService {
    UserProfileResponse getProfile(String email);
    UserProfileResponse updateProfile(String email, UpdateProfileRequest request);
}
