package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.ForgotPasswordRequest;
import com.hamperly.luxurygifthampers.dto.ResetPasswordRequest;

import java.util.Map;

public interface PasswordResetService {

    Map<String, String> processForgotPassword(ForgotPasswordRequest request);

    Map<String, String> processResetPassword(ResetPasswordRequest request);
}
