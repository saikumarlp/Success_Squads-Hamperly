package com.hamperly.luxurygifthampers.service;

import java.util.Map;

public interface OrderService {
    Map<String, Object> createOrder(String userEmail);
    void verifyOrderPayment(String userEmail, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature);
}
