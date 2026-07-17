package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.RegisterRequest;
import com.hamperly.luxurygifthampers.entity.User;

public interface UserService {
    User registerUser(RegisterRequest registerRequest);
    User getUserByEmail(String email);
}
