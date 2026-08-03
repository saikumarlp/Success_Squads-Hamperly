package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.OrderResponseDTO;
import java.util.List;
import java.util.Map;

public interface OrderService {
    Map<String, Object> createOrder(String userEmail);
    void verifyOrderPayment(String userEmail, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature);
    List<OrderResponseDTO> getUserOrders(String userEmail);
}
