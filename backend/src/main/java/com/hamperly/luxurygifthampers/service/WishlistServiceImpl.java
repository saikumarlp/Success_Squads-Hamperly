package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.ProductDTO;
import com.hamperly.luxurygifthampers.entity.Product;
import com.hamperly.luxurygifthampers.entity.ProductImage;
import com.hamperly.luxurygifthampers.entity.User;
import com.hamperly.luxurygifthampers.entity.Wishlist;
import com.hamperly.luxurygifthampers.repository.ProductImageRepository;
import com.hamperly.luxurygifthampers.repository.ProductRepository;
import com.hamperly.luxurygifthampers.repository.UserRepository;
import com.hamperly.luxurygifthampers.repository.WishlistRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.Optional;
import java.util.stream.Collectors;

@Service
public class WishlistServiceImpl implements WishlistService {

    @Autowired
    private WishlistRepository wishlistRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductImageRepository productImageRepository;

    @Autowired
    private com.hamperly.luxurygifthampers.repository.ReviewRepository reviewRepository;

    @Override
    @Transactional
    public void addToWishlist(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Product product = productRepository.findById(productId)
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + productId));

        boolean exists = wishlistRepository.existsByUserIdAndProductId(user.getId(), productId);
        if (!exists) {
            Wishlist wishlist = Wishlist.builder()
                    .user(user)
                    .product(product)
                    .build();
            wishlistRepository.save(wishlist);
        }
    }

    @Override
    @Transactional
    public void removeFromWishlist(String userEmail, Long productId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        wishlistRepository.deleteByUserIdAndProductId(user.getId(), productId);
    }

    @Override
    public List<ProductDTO> getWishlistItems(String userEmail) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        return wishlistRepository.findByUserId(user.getId()).stream()
                .map(wishlist -> mapToDTO(wishlist.getProduct()))
                .collect(Collectors.toList());
    }

    @Override
    public boolean isProductInWishlist(String userEmail, Long productId) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return false;
        }
        return wishlistRepository.existsByUserIdAndProductId(userOpt.get().getId(), productId);
    }

    @Override
    public long getWishlistCount(String userEmail) {
        Optional<User> userOpt = userRepository.findByEmail(userEmail);
        if (userOpt.isEmpty()) {
            return 0;
        }
        return wishlistRepository.countByUserId(userOpt.get().getId());
    }

    private ProductDTO mapToDTO(Product product) {
        String imageUrl = productImageRepository.findByProductId(product.getId())
                .map(ProductImage::getImageUrl)
                .orElse("");

        Double avgRating = reviewRepository.getAverageRatingByProductId(product.getId());
        long count = reviewRepository.countByProductIdAndIsHiddenFalse(product.getId());

        return ProductDTO.builder()
                .id(product.getId())
                .name(product.getName())
                .description(product.getDescription())
                .price(product.getPrice())
                .stock(product.getStock())
                .categoryId(product.getCategory().getId())
                .categoryName(product.getCategory().getCategoryName())
                .imageUrl(imageUrl)
                .averageRating(avgRating != null ? avgRating : 0.0)
                .reviewCount(count)
                .build();
    }
}
