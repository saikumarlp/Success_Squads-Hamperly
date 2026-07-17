package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.RegisterRequest;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.exception.PasswordsDoNotMatchException;
import com.hamperly.luxurygifthampers.exception.ResourceAlreadyExistsException;
import com.hamperly.luxurygifthampers.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Override
    @Transactional
    public User registerUser(RegisterRequest registerRequest) {
        // Validate matching passwords
        if (!registerRequest.getPassword().equals(registerRequest.getConfirmPassword())) {
            throw new PasswordsDoNotMatchException("Passwords do not match");
        }

        // Validate email uniqueness
        if (userRepository.existsByEmail(registerRequest.getEmail())) {
            throw new ResourceAlreadyExistsException("Email address already in use");
        }

        // Validate mobile number uniqueness
        if (userRepository.existsByMobileNumber(registerRequest.getMobileNumber())) {
            throw new ResourceAlreadyExistsException("Mobile number already in use");
        }

        // Create new User
        User user = User.builder()
                .fullName(registerRequest.getFullName())
                .email(registerRequest.getEmail())
                .mobileNumber(registerRequest.getMobileNumber())
                .password(passwordEncoder.encode(registerRequest.getPassword()))
                .role("user")
                .build();

        return userRepository.save(user);
    }

    @Override
    public User getUserByEmail(String email) {
        return userRepository.findByEmail(email)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + email));
    }
}
