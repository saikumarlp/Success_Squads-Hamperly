package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.ProductDTO;
import java.util.List;

public interface WishlistService {
    void addToWishlist(String userEmail, Long productId);
    void removeFromWishlist(String userEmail, Long productId);
    List<ProductDTO> getWishlistItems(String userEmail);
    boolean isProductInWishlist(String userEmail, Long productId);
    long getWishlistCount(String userEmail);
}
