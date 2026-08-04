package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminOrderResponse;
import java.util.List;

public interface AdminOrderService {
    List<AdminOrderResponse> getAllOrders();
    void updateOrderStatus(String orderId, String status);
}
