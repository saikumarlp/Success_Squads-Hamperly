package com.hamperly.luxurygifthampers.controller;

import com.hamperly.luxurygifthampers.dto.AddToCartRequest;
import com.hamperly.luxurygifthampers.dto.CartItemDTO;
import com.hamperly.luxurygifthampers.service.CartService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/cart")
public class CartController {

    @Autowired
    private CartService cartService;

    @GetMapping
    public ResponseEntity<List<CartItemDTO>> getCart(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(cartService.getCartItems(userDetails.getUsername()));
    }

    @PostMapping("/add")
    public ResponseEntity<Map<String, Object>> addToCart(
            @Valid @RequestBody AddToCartRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        cartService.addToCart(userDetails.getUsername(), request.getProductId(), request.getQuantity());

        Integer count = cartService.getCartCount(userDetails.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Item added to cart successfully");
        response.put("cartCount", count);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getCartCount(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("cartCount", 0);
            return ResponseEntity.ok(response);
        }

        Integer count = cartService.getCartCount(userDetails.getUsername());
        Map<String, Object> response = new HashMap<>();
        response.put("cartCount", count);

        return ResponseEntity.ok(response);
    }
}
