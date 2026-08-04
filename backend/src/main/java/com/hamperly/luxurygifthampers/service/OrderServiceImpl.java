package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.OrderItemDTO;
import com.hamperly.luxurygifthampers.dto.OrderResponseDTO;
import com.hamperly.luxurygifthampers.entity.*;
import com.hamperly.luxurygifthampers.repository.*;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.*;

@Service
public class OrderServiceImpl implements OrderService {

    @Value("${RAZORPAY_KEY_ID}")
    private String keyId;

    @Value("${RAZORPAY_KEY_SECRET}")
    private String keySecret;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    @Autowired
    private OrderItemRepository orderItemRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private InvoiceRepository invoiceRepository;

    @Autowired
    private InvoiceGenerator invoiceGenerator;

    @Override
    @Transactional
    public Map<String, Object> createOrder(String userEmail, Map<String, String> shippingDetails) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        // Calculate Cost Breakdown
        BigDecimal itemTotal = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock available for product: " + product.getName());
            }
            BigDecimal itemTotalCost = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            itemTotal = itemTotal.add(itemTotalCost);
        }

        // Standard Calculations:
        // Discount: mock 0 or custom
        BigDecimal discount = BigDecimal.ZERO;
        BigDecimal couponDiscount = BigDecimal.ZERO;
        
        // Shipping Charge: If itemTotal >= 3000 -> Free, else 150
        BigDecimal shippingCharge = itemTotal.compareTo(new BigDecimal("3000")) >= 0 ? BigDecimal.ZERO : new BigDecimal("150.00");
        
        // Tax (GST): 18% of itemTotal
        BigDecimal tax = itemTotal.multiply(new BigDecimal("0.18")).setScale(2, BigDecimal.ROUND_HALF_UP);
        
        // Grand Total
        BigDecimal grandTotal = itemTotal.add(shippingCharge).add(tax).subtract(discount).subtract(couponDiscount);

        try {
            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            // Razorpay amount is in paise
            long amountInPaise = grandTotal.multiply(new BigDecimal(100)).longValue();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + System.currentTimeMillis());

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            Order order = Order.builder()
                    .orderId(razorpayOrderId)
                    .user(user)
                    .totalAmount(grandTotal)
                    .status(OrderStatus.PENDING)
                    .itemTotal(itemTotal)
                    .discount(discount)
                    .couponDiscount(couponDiscount)
                    .shippingCharge(shippingCharge)
                    .tax(tax)
                    .grandTotal(grandTotal)
                    .shippingAddress(shippingDetails.get("shippingAddress"))
                    .city(shippingDetails.get("city"))
                    .state(shippingDetails.get("state"))
                    .country(shippingDetails.get("country"))
                    .postalCode(shippingDetails.get("postalCode"))
                    .paymentStatus("PENDING")
                    .estimatedDelivery(LocalDateTime.now().plusDays(5))
                    .trackingNumber("TRK-" + System.currentTimeMillis())
                    .build();

            order = orderRepository.save(order);

            List<OrderItem> orderItems = new ArrayList<>();
            for (CartItem item : cartItems) {
                BigDecimal price = item.getProduct().getPrice();
                BigDecimal itemTotalCost = price.multiply(BigDecimal.valueOf(item.getQuantity()));

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(item.getProduct())
                        .quantity(item.getQuantity())
                        .pricePerUnit(price)
                        .totalPrice(itemTotalCost)
                        .build();

                orderItemRepository.save(orderItem);
                orderItems.add(orderItem);
            }

            order.setOrderItems(orderItems);

            Map<String, Object> response = new HashMap<>();
            response.put("keyId", keyId);
            response.put("orderId", razorpayOrderId);
            response.put("amount", amountInPaise);
            response.put("currency", "INR");

            return response;

        } catch (RazorpayException e) {
            throw new RuntimeException("Failed to create order in Razorpay: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional
    public void verifyOrderPayment(String userEmail, String razorpayOrderId, String razorpayPaymentId, String razorpaySignature) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Order order = orderRepository.findById(razorpayOrderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + razorpayOrderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Order does not belong to the authenticated user");
        }

        try {
            JSONObject options = new JSONObject();
            options.put("razorpay_order_id", razorpayOrderId);
            options.put("razorpay_payment_id", razorpayPaymentId);
            options.put("razorpay_signature", razorpaySignature);

            boolean isValid = Utils.verifyPaymentSignature(options, keySecret);
            if (!isValid) {
                order.setStatus(OrderStatus.FAILED);
                order.setPaymentStatus("FAILED");
                orderRepository.save(order);
                throw new RuntimeException("Invalid payment signature verification failed");
            }

            // Payment is valid, update order status to CONFIRMED
            order.setStatus(OrderStatus.CONFIRMED);
            order.setPaymentStatus("PAID");
            order.setPaymentId(razorpayPaymentId);
            order.setPaymentMethod("Razorpay (Online)");
            order.setConfirmedAt(LocalDateTime.now());
            orderRepository.save(order);

            // Deduct stock for each purchased item
            for (OrderItem item : order.getOrderItems()) {
                Product product = item.getProduct();
                if (product.getStock() < item.getQuantity()) {
                    throw new IllegalArgumentException("Not enough stock available for product: " + product.getName());
                }
                product.setStock(product.getStock() - item.getQuantity());
                productRepository.save(product);
            }

            // Clear user's cart
            List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
            cartItemRepository.deleteAll(cartItems);

        } catch (Exception e) {
            order.setStatus(OrderStatus.FAILED);
            order.setPaymentStatus("FAILED");
            orderRepository.save(order);
            throw new RuntimeException("Payment verification failed: " + e.getMessage(), e);
        }
    }

    @Override
    @Transactional(readOnly = true)
    public List<OrderResponseDTO> getUserOrders(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        List<Order> orders = orderRepository.findByUserId(user.getId());
        List<OrderResponseDTO> response = new ArrayList<>();

        for (Order order : orders) {
            response.add(mapToDTO(order));
        }

        // Sort orders by createdAt in descending order
        response.sort((o1, o2) -> {
            if (o1.getCreatedAt() == null && o2.getCreatedAt() == null) return 0;
            if (o1.getCreatedAt() == null) return 1;
            if (o2.getCreatedAt() == null) return -1;
            return o2.getCreatedAt().compareTo(o1.getCreatedAt());
        });

        return response;
    }

    @Override
    @Transactional(readOnly = true)
    public OrderResponseDTO getOrderById(String orderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized: This order does not belong to you.");
        }

        return mapToDTO(order);
    }

    @Override
    @Transactional(readOnly = true)
    public List<Map<String, Object>> getOrderTracking(String orderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized");
        }

        OrderStatus currentStatus = order.getStatus();
        
        List<Map<String, Object>> tracking = new ArrayList<>();

        // Helper to check if a step is completed and get its timestamp
        tracking.add(createTrackingStep("PENDING", "Order Placed", true, order.getCreatedAt()));
        
        boolean isConfirmed = currentStatus == OrderStatus.CONFIRMED || currentStatus == OrderStatus.PACKED || 
                             currentStatus == OrderStatus.SHIPPED || currentStatus == OrderStatus.OUT_FOR_DELIVERY || 
                             currentStatus == OrderStatus.DELIVERED;
        tracking.add(createTrackingStep("CONFIRMED", "Confirmed", isConfirmed, order.getConfirmedAt()));

        boolean isPacked = currentStatus == OrderStatus.PACKED || currentStatus == OrderStatus.SHIPPED || 
                          currentStatus == OrderStatus.OUT_FOR_DELIVERY || currentStatus == OrderStatus.DELIVERED;
        tracking.add(createTrackingStep("PACKED", "Packed", isPacked, order.getPackedAt()));

        boolean isShipped = currentStatus == OrderStatus.SHIPPED || currentStatus == OrderStatus.OUT_FOR_DELIVERY || 
                           currentStatus == OrderStatus.DELIVERED;
        tracking.add(createTrackingStep("SHIPPED", "Shipped", isShipped, order.getShippedAt()));

        boolean isOut = currentStatus == OrderStatus.OUT_FOR_DELIVERY || currentStatus == OrderStatus.DELIVERED;
        tracking.add(createTrackingStep("OUT_FOR_DELIVERY", "Out for Delivery", isOut, order.getOutForDeliveryAt()));

        boolean isDelivered = currentStatus == OrderStatus.DELIVERED;
        tracking.add(createTrackingStep("DELIVERED", "Delivered", isDelivered, order.getDeliveredAt()));

        return tracking;
    }

    @Override
    @Transactional
    public String getOrderInvoicePath(String orderId, String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with ID: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new RuntimeException("Unauthorized access to invoice");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("Invoice is not generated yet. Order status must be DELIVERED.");
        }

        Optional<Invoice> existingInvoice = invoiceRepository.findByOrderId(orderId);
        if (existingInvoice.isPresent()) {
            return existingInvoice.get().getPdfPath();
        }

        // Generate invoice PDF
        String path = invoiceGenerator.generateInvoicePdf(order);

        Invoice invoice = Invoice.builder()
                .orderId(orderId)
                .invoiceNumber("INV-" + orderId.substring(Math.max(0, orderId.length() - 8)).toUpperCase())
                .pdfPath(path)
                .generatedAt(LocalDateTime.now())
                .build();
        invoiceRepository.save(invoice);

        return path;
    }

    private Map<String, Object> createTrackingStep(String status, String name, boolean completed, LocalDateTime timestamp) {
        Map<String, Object> step = new HashMap<>();
        step.put("status", status);
        step.put("name", name);
        step.put("completed", completed);
        step.put("timestamp", timestamp);
        return step;
    }

    private OrderResponseDTO mapToDTO(Order order) {
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

        return OrderResponseDTO.builder()
                .orderId(order.getOrderId())
                .totalAmount(order.getTotalAmount())
                .status(order.getStatus())
                .createdAt(order.getCreatedAt())
                .orderItems(orderItemDTOs)
                .itemTotal(order.getItemTotal())
                .discount(order.getDiscount())
                .couponDiscount(order.getCouponDiscount())
                .shippingCharge(order.getShippingCharge())
                .tax(order.getTax())
                .grandTotal(order.getGrandTotal())
                .shippingAddress(order.getShippingAddress())
                .city(order.getCity())
                .state(order.getState())
                .country(order.getCountry())
                .postalCode(order.getPostalCode())
                .customerName(order.getUser() != null ? order.getUser().getFullName() : "N/A")
                .customerEmail(order.getUser() != null ? order.getUser().getEmail() : "N/A")
                .customerPhone(order.getUser() != null ? order.getUser().getMobileNumber() : "N/A")
                .paymentId(order.getPaymentId())
                .paymentMethod(order.getPaymentMethod())
                .paymentStatus(order.getPaymentStatus())
                .estimatedDelivery(order.getEstimatedDelivery())
                .trackingNumber(order.getTrackingNumber())
                .confirmedAt(order.getConfirmedAt())
                .packedAt(order.getPackedAt())
                .shippedAt(order.getShippedAt())
                .outForDeliveryAt(order.getOutForDeliveryAt())
                .deliveredAt(order.getDeliveredAt())
                .cancelledAt(order.getCancelledAt())
                .build();
    }
}
