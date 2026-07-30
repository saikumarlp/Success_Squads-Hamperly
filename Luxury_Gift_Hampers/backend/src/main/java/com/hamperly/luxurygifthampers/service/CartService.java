package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.CartItemDTO;

import java.util.List;

public interface CartService {
    void addToCart(String userEmail, Long productId, Integer quantity);
    List<CartItemDTO> getCartItems(String userEmail);
    Integer getCartCount(String userEmail);
}
