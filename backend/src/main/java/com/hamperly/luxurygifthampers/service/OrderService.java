package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.OrderResponseDTO;
import java.util.List;
import java.util.Map;

public interface OrderService {
    Map<String, Object> createOrder(String userEmail, Map<String, String> shippingDetails);
    void verifyOrderPayment(String userEmail, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature);
    List<OrderResponseDTO> getUserOrders(String userEmail);
    OrderResponseDTO getOrderById(String orderId, String userEmail);
    List<Map<String, Object>> getOrderTracking(String orderId, String userEmail);
    String getOrderInvoicePath(String orderId, String userEmail);
}
