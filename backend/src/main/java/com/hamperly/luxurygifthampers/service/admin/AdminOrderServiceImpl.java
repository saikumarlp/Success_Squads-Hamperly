package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.OrderItemDTO;
import com.hamperly.luxurygifthampers.dto.admin.AdminOrderResponse;
import com.hamperly.luxurygifthampers.entity.*;
import com.hamperly.luxurygifthampers.repository.InvoiceRepository;
import com.hamperly.luxurygifthampers.repository.ProductImageRepository;
import com.hamperly.luxurygifthampers.repository.admin.AdminOrderRepository;
import com.hamperly.luxurygifthampers.service.InvoiceGenerator;
import com.hamperly.luxurygifthampers.service.NotificationService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
public class AdminOrderServiceImpl implements AdminOrderService {

    @Autowired
    private AdminOrderRepository adminOrderRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private NotificationService notificationService;

    @Autowired
    private InvoiceGenerator invoiceGenerator;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Override
    @Transactional(readOnly = true)
    public List<AdminOrderResponse> getOrders(String search, String status) {
        List<Order> orders = adminOrderRepository.findAll();
        List<AdminOrderResponse> response = new ArrayList<>();

        for (Order order : orders) {
            String customerName = order.getUser() != null ? order.getUser().getFullName() : "Unknown";
            String customerEmail = order.getUser() != null ? order.getUser().getEmail() : "Unknown";

            // Apply search filter (order ID, customer name, or customer email)
            if (search != null && !search.trim().isEmpty()) {
                String term = search.toLowerCase();
                boolean matchesId = order.getOrderId().toLowerCase().contains(term);
                boolean matchesName = customerName.toLowerCase().contains(term);
                boolean matchesEmail = customerEmail.toLowerCase().contains(term);
                if (!matchesId && !matchesName && !matchesEmail) {
                    continue;
                }
            }

            // Apply status filter
            if (status != null && !status.trim().isEmpty()) {
                if (!order.getStatus().name().equalsIgnoreCase(status.trim())) {
                    continue;
                }
            }

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
                        .brand("Hamperly")
                        .category(item.getProduct().getCategory() != null ? item.getProduct().getCategory().getCategoryName() : "General")
                        .build();

                orderItemDTOs.add(itemDTO);
            }

            AdminOrderResponse orderDTO = new AdminOrderResponse(
                    order.getOrderId(),
                    order.getTotalAmount(),
                    order.getStatus(),
                    order.getCreatedAt(),
                    customerName,
                    customerEmail,
                    orderItemDTOs,
                    order.getShippingAddress(),
                    order.getCity(),
                    order.getState(),
                    order.getCountry(),
                    order.getPostalCode(),
                    order.getPaymentId(),
                    order.getPaymentMethod(),
                    order.getPaymentStatus(),
                    order.getEstimatedDelivery(),
                    order.getTrackingNumber()
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
    public void updateOrderStatus(String orderId, String statusStr) {
        Order order = adminOrderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));
        
        OrderStatus nextStatus = OrderStatus.valueOf(statusStr.toUpperCase());
        order.setStatus(nextStatus);

        // Update tracking status timestamps
        LocalDateTime now = LocalDateTime.now();
        switch (nextStatus) {
            case CONFIRMED:
                order.setConfirmedAt(now);
                break;
            case PACKED:
                order.setPackedAt(now);
                break;
            case SHIPPED:
                order.setShippedAt(now);
                break;
            case OUT_FOR_DELIVERY:
                order.setOutForDeliveryAt(now);
                break;
            case DELIVERED:
                order.setDeliveredAt(now);
                break;
            case CANCELLED:
                order.setCancelledAt(now);
                break;
            case FAILED:
                order.setPaymentStatus("FAILED");
                break;
        }

        adminOrderRepository.save(order);

        // Send customer notification
        String message = getNotificationMessage(nextStatus);
        if (message != null && order.getUser() != null) {
            notificationService.sendNotification(order.getUser().getId(), message);
        }

        // Auto-generate invoice if DELIVERED
        if (nextStatus == OrderStatus.DELIVERED) {
            try {
                if (invoiceRepository.findByOrderId(orderId).isEmpty()) {
                    String path = invoiceGenerator.generateInvoicePdf(order);
                    Invoice invoice = Invoice.builder()
                            .orderId(orderId)
                            .invoiceNumber("INV-" + orderId.substring(Math.max(0, orderId.length() - 8)).toUpperCase())
                            .pdfPath(path)
                            .generatedAt(now)
                            .build();
                    invoiceRepository.save(invoice);
                }
            } catch (Exception e) {
                System.err.println("Invoice auto-generation failed: " + e.getMessage());
            }
        }
    }

    private String getNotificationMessage(OrderStatus status) {
        switch (status) {
            case CONFIRMED:
                return "Your order has been confirmed.";
            case PACKED:
                return "Your order has been packed.";
            case SHIPPED:
                return "Your order has been shipped.";
            case OUT_FOR_DELIVERY:
                return "Your package is out for delivery.";
            case DELIVERED:
                return "Your order has been delivered.";
            case CANCELLED:
                return "Your order has been cancelled.";
            default:
                return null;
        }
    }
}
