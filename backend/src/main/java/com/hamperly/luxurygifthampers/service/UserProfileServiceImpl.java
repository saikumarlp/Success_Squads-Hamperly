package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.UpdateProfileRequest;
import com.hamperly.luxurygifthampers.dto.UserProfileResponse;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.exception.ResourceAlreadyExistsException;
import com.hamperly.luxurygifthampers.exception.UserNotFoundException;
import com.hamperly.luxurygifthampers.mapper.UserProfileMapper;
import com.hamperly.luxurygifthampers.repository.UserRepository;
import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserProfileServiceImpl implements UserProfileService {

    private static final Logger logger = LoggerFactory.getLogger(UserProfileServiceImpl.class);

    private final UserRepository userRepository;
    private final UserProfileMapper userProfileMapper;

    @Autowired
    public UserProfileServiceImpl(UserRepository userRepository, UserProfileMapper userProfileMapper) {
        this.userRepository = userRepository;
        this.userProfileMapper = userProfileMapper;
    }

    @Override
    @Transactional(readOnly = true)
    public UserProfileResponse getProfile(String email) {
        logger.info("Fetching profile for user email: [{}]", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        return userProfileMapper.toResponse(user);
    }

    @Override
    @Transactional
    public UserProfileResponse updateProfile(String email, UpdateProfileRequest request) {
        logger.info("Updating profile for user email: [{}]", email);

        User user = userRepository.findByEmail(email)
                .orElseThrow(() -> new UserNotFoundException("User not found with email: " + email));

        String newMobileNumber = request.getMobileNumber().trim();

        // Check if mobile number is being updated and if it is already taken by another account
        if (!newMobileNumber.equals(user.getMobileNumber())) {
            if (userRepository.existsByMobileNumberAndIdNot(newMobileNumber, user.getId())) {
                logger.warn("Mobile number [{}] is already in use by another account", newMobileNumber);
                throw new ResourceAlreadyExistsException("Mobile number already in use by another account");
            }
        }

        // Apply profile updates (email is intentionally omitted to keep it immutable)
        userProfileMapper.updateEntityFromRequest(request, user);

        User updatedUser = userRepository.save(user);
        logger.info("Profile successfully updated for user ID: [{}]", updatedUser.getId());

        return userProfileMapper.toResponse(updatedUser);
    }
}
