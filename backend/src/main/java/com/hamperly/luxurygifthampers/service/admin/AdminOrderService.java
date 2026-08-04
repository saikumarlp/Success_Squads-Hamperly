package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminOrderResponse;
import java.util.List;

public interface AdminOrderService {
    List<AdminOrderResponse> getOrders(String search, String status);
    void updateOrderStatus(String orderId, String status);
}
