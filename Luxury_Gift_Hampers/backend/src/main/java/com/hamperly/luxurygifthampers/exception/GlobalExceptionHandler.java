package com.hamperly.luxurygifthampers.exception;

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

    @ExceptionHandler(Exception.class)
    public ResponseEntity<Map<String, String>> handleGeneralException(Exception ex) {
        Map<String, String> response = new HashMap<>();
        response.put("message", ex.getMessage());
        return new ResponseEntity<>(response, HttpStatus.INTERNAL_SERVER_ERROR);
    }
}
