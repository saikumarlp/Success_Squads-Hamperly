package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.OrderItemDTO;
import com.hamperly.luxurygifthampers.dto.admin.AdminOrderResponse;
import com.hamperly.luxurygifthampers.entity.Order;
import com.hamperly.luxurygifthampers.entity.OrderItem;
import com.hamperly.luxurygifthampers.entity.OrderStatus;
import com.hamperly.luxurygifthampers.entity.ProductImage;
import com.hamperly.luxurygifthampers.repository.ProductImageRepository;
import com.hamperly.luxurygifthampers.repository.admin.AdminOrderRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.ArrayList;
import java.util.List;

@Service
public class AdminOrderServiceImpl implements AdminOrderService {

    @Autowired
    private AdminOrderRepository adminOrderRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getAllOrders() {
        List<Order> orders = adminOrderRepository.findAll();
        List<AdminOrderResponse> response = new ArrayList<>();

        for (Order order : orders) {
            List<OrderItemDTO> orderItemDTOs = new ArrayList<>();
            for (OrderItem item : order.getOrderItems()) {
                String imageUrl = productImageRepository.findByProductId(item.getProduct().getId())
                        .map(ProductImage::getImageUrl)
                        .orElse("");

                OrderItemDTO itemDTO = OrderItemDTO.builder()
                        .productId(item.getProduct().getId())
                        .productName(item.getProduct().getName())
                        .quantity(item.getQuantity())
                        .pricePerUnit(item.getPricePerUnit())
                        .totalPrice(item.getTotalPrice())
                        .imageUrl(imageUrl)
                        .build();

                orderItemDTOs.add(itemDTO);
            }

            AdminOrderResponse orderDTO = new AdminOrderResponse(
                    order.getOrderId(),
                    order.getTotalAmount(),
                    order.getStatus(),
                    order.getCreatedAt(),
                    order.getUser() != null ? order.getUser().getFullName() : "Unknown",
                    order.getUser() != null ? order.getUser().getEmail() : "Unknown",
                    orderItemDTOs
            );

            response.add(orderDTO);
        }

        // Sort by createdAt descending
        response.sort((o1, o2) -> {
            if (o1.getCreatedAt() == null && o2.getCreatedAt() == null) return 0;
            if (o1.getCreatedAt() == null) return 1;
            if (o2.getCreatedAt() == null) return -1;
            return o2.getCreatedAt().compareTo(o1.getCreatedAt());
        });

        return response;
    }

    @Override
    @Transactional
    public void updateOrderStatus(String orderId, String status) {
        Order order = adminOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        order.setStatus(OrderStatus.valueOf(status.toUpperCase()));
        adminOrderRepository.save(order);
    }
}
