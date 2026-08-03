package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.OrderItemDTO;
import com.hamperly.luxurygifthampers.dto.OrderResponseDTO;
import com.hamperly.luxurygifthampers.entity.CartItem;
import com.hamperly.luxurygifthampers.entity.Order;
import com.hamperly.luxurygifthampers.entity.OrderItem;
import com.hamperly.luxurygifthampers.entity.OrderStatus;
import com.hamperly.luxurygifthampers.entity.Product;
import com.hamperly.luxurygifthampers.entity.ProductImage;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.repository.CartItemRepository;
import com.hamperly.luxurygifthampers.repository.OrderItemRepository;
import com.hamperly.luxurygifthampers.repository.OrderRepository;
import com.hamperly.luxurygifthampers.repository.ProductImageRepository;
import com.hamperly.luxurygifthampers.repository.ProductRepository;
import com.hamperly.luxurygifthampers.repository.UserRepository;
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
import java.util.ArrayList;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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

    @Override
    @Transactional
    public Map<String, Object> createOrder(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        List<CartItem> cartItems = cartItemRepository.findByUserId(user.getId());
        if (cartItems.isEmpty()) {
            throw new RuntimeException("Cart is empty");
        }

        BigDecimal totalAmount = BigDecimal.ZERO;
        for (CartItem item : cartItems) {
            Product product = item.getProduct();
            if (product.getStock() < item.getQuantity()) {
                throw new IllegalArgumentException("Not enough stock available for product: " + product.getName());
            }
            BigDecimal itemTotal = product.getPrice().multiply(BigDecimal.valueOf(item.getQuantity()));
            totalAmount = totalAmount.add(itemTotal);
        }

        try {
            RazorpayClient razorpayClient = new RazorpayClient(keyId, keySecret);

            JSONObject orderRequest = new JSONObject();
            // Razorpay amount is in paise (e.g. 100 paise = 1 INR)
            long amountInPaise = totalAmount.multiply(new BigDecimal(100)).longValue();
            orderRequest.put("amount", amountInPaise);
            orderRequest.put("currency", "INR");
            orderRequest.put("receipt", "rcpt_" + System.currentTimeMillis());

            com.razorpay.Order razorpayOrder = razorpayClient.orders.create(orderRequest);
            String razorpayOrderId = razorpayOrder.get("id");

            Order order = Order.builder()
                    .orderId(razorpayOrderId)
                    .user(user)
                    .totalAmount(totalAmount)
                    .status(OrderStatus.PENDING)
                    .build();

            order = orderRepository.save(order);

            List<OrderItem> orderItems = new ArrayList<>();
            for (CartItem item : cartItems) {
                BigDecimal price = item.getProduct().getPrice();
                BigDecimal itemTotal = price.multiply(BigDecimal.valueOf(item.getQuantity()));

                OrderItem orderItem = OrderItem.builder()
                        .order(order)
                        .product(item.getProduct())
                        .quantity(item.getQuantity())
                        .pricePerUnit(price)
                        .totalPrice(itemTotal)
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
                orderRepository.save(order);
                throw new RuntimeException("Invalid payment signature verification failed");
            }

            // Payment is valid, update order status to SUCCESS
            order.setStatus(OrderStatus.SUCCESS);
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

            OrderResponseDTO orderDTO = OrderResponseDTO.builder()
                    .orderId(order.getOrderId())
                    .totalAmount(order.getTotalAmount())
                    .status(order.getStatus())
                    .createdAt(order.getCreatedAt())
                    .orderItems(orderItemDTOs)
                    .build();

            response.add(orderDTO);
        }

        // Sort orders by createdAt in descending order so the newest orders are shown first
        response.sort((o1, o2) -> {
            if (o1.getCreatedAt() == null && o2.getCreatedAt() == null) return 0;
            if (o1.getCreatedAt() == null) return 1;
            if (o2.getCreatedAt() == null) return -1;
            return o2.getCreatedAt().compareTo(o1.getCreatedAt());
        });

        return response;
    }
}
