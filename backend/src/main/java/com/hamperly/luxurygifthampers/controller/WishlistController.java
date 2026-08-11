package com.hamperly.luxurygifthampers.controller;

import com.hamperly.luxurygifthampers.dto.ProductDTO;
import com.hamperly.luxurygifthampers.service.WishlistService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;

import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api/wishlist")
public class WishlistController {

    @Autowired
    private WishlistService wishlistService;

    @GetMapping
    public ResponseEntity<List<ProductDTO>> getWishlist(@AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        return ResponseEntity.ok(wishlistService.getWishlistItems(userDetails.getUsername()));
    }

    @PostMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> addToWishlist(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        wishlistService.addToWishlist(userDetails.getUsername(), productId);
        long count = wishlistService.getWishlistCount(userDetails.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Added to Wishlist");
        response.put("wishlistCount", count);

        return ResponseEntity.ok(response);
    }

    @DeleteMapping("/{productId}")
    public ResponseEntity<Map<String, Object>> removeFromWishlist(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }

        wishlistService.removeFromWishlist(userDetails.getUsername(), productId);
        long count = wishlistService.getWishlistCount(userDetails.getUsername());

        Map<String, Object> response = new HashMap<>();
        response.put("message", "Removed from Wishlist");
        response.put("wishlistCount", count);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/check/{productId}")
    public ResponseEntity<Map<String, Object>> checkWishlist(
            @PathVariable Long productId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            Map<String, Object> response = new HashMap<>();
            response.put("inWishlist", false);
            return ResponseEntity.ok(response);
        }

        boolean inWishlist = wishlistService.isProductInWishlist(userDetails.getUsername(), productId);
        Map<String, Object> response = new HashMap<>();
        response.put("inWishlist", inWishlist);

        return ResponseEntity.ok(response);
    }

    @GetMapping("/count")
    public ResponseEntity<Map<String, Object>> getWishlistCount(@AuthenticationPrincipal UserDetails userDetails) {
        Map<String, Object> response = new HashMap<>();
        if (userDetails == null) {
            response.put("wishlistCount", 0L);
            return ResponseEntity.ok(response);
        }

        long count = wishlistService.getWishlistCount(userDetails.getUsername());
        response.put("wishlistCount", count);
        return ResponseEntity.ok(response);
    }
}
