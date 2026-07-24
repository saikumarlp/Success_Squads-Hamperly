package com.hamperly.luxurygifthampers.exception;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class GlobalExceptionHandler {

    private static final Logger logger = LoggerFactory.getLogger(GlobalExceptionHandler.class);

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, Object>> handleValidationExceptions(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach((error) -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("errors", errors);
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ResourceAlreadyExistsException.class)
    public ResponseEntity<Map<String, Object>> handleResourceAlreadyExistsException(ResourceAlreadyExistsException ex) {
        Map<String, String> errors = new HashMap<>();
        // Try to identify if the exception is for email or mobile, and map it
        String msg = ex.getMessage().toLowerCase();
        if (msg.contains("email")) {
            errors.put("email", ex.getMessage());
        } else if (msg.contains("mobile")) {
            errors.put("mobileNumber", ex.getMessage());
        } else {
            errors.put("message", ex.getMessage());
        }

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("errors", errors);
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PasswordsDoNotMatchException.class)
    public ResponseEntity<Map<String, Object>> handlePasswordsDoNotMatchException(PasswordsDoNotMatchException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("confirmPassword", ex.getMessage());

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("errors", errors);
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(PasswordMismatchException.class)
    public ResponseEntity<Map<String, Object>> handlePasswordMismatchException(PasswordMismatchException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("confirmPassword", ex.getMessage());

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("errors", errors);
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(InvalidResetTokenException.class)
    public ResponseEntity<Map<String, Object>> handleInvalidResetTokenException(InvalidResetTokenException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("token", ex.getMessage());

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("errors", errors);
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(ExpiredResetTokenException.class)
    public ResponseEntity<Map<String, Object>> handleExpiredResetTokenException(ExpiredResetTokenException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("token", ex.getMessage());

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("errors", errors);
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(WeakPasswordException.class)
    public ResponseEntity<Map<String, Object>> handleWeakPasswordException(WeakPasswordException ex) {
        Map<String, String> errors = new HashMap<>();
        errors.put("newPassword", ex.getMessage());

        Map<String, Object> responseBody = new HashMap<>();
        responseBody.put("errors", errors);
        return new ResponseEntity<>(responseBody, HttpStatus.BAD_REQUEST);
    }

    @ExceptionHandler(UserNotFoundException.class)
    public ResponseEntity<Map<String, String>> handleUserNotFoundException(UserNotFoundException ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.NOT_FOUND);
    }

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        logger.error("Unhandled exception caught in GlobalExceptionHandler", ex);

        String rawMessage = ex.getMessage();
        String userMessage = "An unexpected error occurred. Please try again later.";

        if (rawMessage != null && !rawMessage.isBlank() && !rawMessage.contains("Conversion =") && !rawMessage.contains("UnknownFormat")) {
            userMessage = rawMessage;
        }

        Map<String, String> response = new HashMap<>();
        response.put("message", userMessage);
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
