package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.CartItemDTO;
import com.hamperly.luxurygifthampers.entity.CartItem;
import com.hamperly.luxurygifthampers.entity.Product;
import com.hamperly.luxurygifthampers.entity.ProductImage;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.repository.CartItemRepository;
import com.hamperly.luxurygifthampers.repository.ProductImageRepository;
import com.hamperly.luxurygifthampers.repository.ProductRepository;
import com.hamperly.luxurygifthampers.repository.UserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class CartServiceImpl implements CartService {

    @Autowired
    private CartItemRepository cartItemRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Override
    @Transactional
    public void addToCart(String userEmail, Long productId, Integer quantity) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        if (product.getStock() < quantity) {
            throw new IllegalArgumentException("Not enough stock available for product: " + product.getName());
        }

        Optional<CartItem> existingCartItemOpt = cartItemRepository.findByUserIdAndProductId(user.getId(), productId);

        if (existingCartItemOpt.isPresent()) {
            CartItem cartItem = existingCartItemOpt.get();
            int newQuantity = cartItem.getQuantity() + quantity;
            if (product.getStock() < newQuantity) {
                throw new IllegalArgumentException("Not enough stock available. Total in cart: " + newQuantity);
            }
            cartItem.setQuantity(newQuantity);
            cartItemRepository.save(cartItem);
        } else {
            CartItem cartItem = CartItem.builder()
                    .user(user)
                    .product(product)
                    .quantity(quantity)
                    .build();
            cartItemRepository.save(cartItem);
        }
    }

    @Override
    public List<CartItemDTO> getCartItems(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        return cartItemRepository.findByUserId(user.getId()).stream()
                .map(this::mapToDTO)
                .collect(Collectors.toList());
    }

    @Override
    public Integer getCartCount(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        return cartItemRepository.sumQuantityByUserId(user.getId());
    }

    @Override
    @Transactional
    public void updateCartItemQuantity(String userEmail, Long productId, Integer quantity) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        CartItem cartItem = cartItemRepository.findByUserIdAndProductId(user.getId(), productId)
                .orElseThrow(() -> new RuntimeException("Cart item not found"));

        Product product = cartItem.getProduct();
        if (product.getStock() < quantity) {
            throw new IllegalArgumentException("Not enough stock available for product: " + product.getName());
        }

        if (quantity <= 0) {
            cartItemRepository.delete(cartItem);
        } else {
            cartItem.setQuantity(quantity);
            cartItemRepository.save(cartItem);
        }
    }

    @Override
    @Transactional
    public void removeCartItem(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        cartItemRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    private CartItemDTO mapToDTO(CartItem cartItem) {
        Product product = cartItem.getProduct();
        String imageUrl = productImageRepository.findByProductId(product.getId())
                .map(ProductImage::getImageUrl)
                .orElse("");

        BigDecimal subTotal = product.getPrice().multiply(BigDecimal.valueOf(cartItem.getQuantity()));

        return CartItemDTO.builder()
                .id(cartItem.getId())
                .productId(product.getId())
                .productName(product.getName())
                .price(product.getPrice())
                .quantity(cartItem.getQuantity())
                .imageUrl(imageUrl)
                .subTotal(subTotal)
                .build();
    }
}
