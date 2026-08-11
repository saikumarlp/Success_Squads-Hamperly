package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.ReviewRequest;
import com.hamperly.luxurygifthampers.dto.ReviewResponse;
import com.hamperly.luxurygifthampers.dto.admin.ReviewStatsDTO;
import com.hamperly.luxurygifthampers.dto.admin.ReviewStatsDTO.ProductReviewStat;
import com.hamperly.luxurygifthampers.entity.*;
import com.hamperly.luxurygifthampers.repository.*;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Sort;
import org.springframework.security.core.userdetails.UsernameNotFoundException;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class ReviewServiceImpl implements ReviewService {

    @Autowired
    private ReviewRepository reviewRepository;

    @Autowired
    private ReviewImageRepository reviewImageRepository;

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private ProductRepository productRepository;

    @Autowired
    private OrderRepository orderRepository;

    private static final String UPLOAD_DIR = "uploads/reviews";
    private static final DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss");

    @Override
    @Transactional
    public ReviewResponse submitReview(String userEmail, ReviewRequest request) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Product product = productRepository.findById(request.getProductId())
                .orElseThrow(() -> new RuntimeException("Product not found with id: " + request.getProductId()));

        Order order = orderRepository.findById(request.getOrderId())
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + request.getOrderId()));

        // Validations
        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("This order does not belong to you.");
        }

        if (order.getStatus() != OrderStatus.DELIVERED) {
            throw new IllegalArgumentException("You can only review products from delivered orders.");
        }

        boolean hasProduct = order.getOrderItems().stream()
                .anyMatch(item -> item.getProduct().getId().equals(product.getId()));
        if (!hasProduct) {
            throw new IllegalArgumentException("This product is not part of the specified order.");
        }

        if (reviewRepository.existsByUserIdAndProductId(user.getId(), product.getId())) {
            throw new IllegalArgumentException("You have already reviewed this product.");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        Review review = Review.builder()
                .user(user)
                .product(product)
                .order(order)
                .rating(request.getRating())
                .title(request.getTitle())
                .comment(request.getComment())
                .verifiedPurchase(true)
                .isHidden(false)
                .build();

        Review savedReview = reviewRepository.save(review);

        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                if (url != null && !url.isBlank()) {
                    ReviewImage img = ReviewImage.builder()
                            .review(savedReview)
                            .imageUrl(url)
                            .build();
                    reviewImageRepository.save(img);
                }
            }
        }

        return mapToResponse(savedReview);
    }

    @Override
    @Transactional
    public ReviewResponse updateReview(String userEmail, Long reviewId, ReviewRequest request) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        boolean isAdmin = "ADMIN".equals(currentUser.getRole()) || "ROLE_ADMIN".equals(currentUser.getRole());
        if (!review.getUser().getId().equals(currentUser.getId()) && !isAdmin) {
            throw new IllegalArgumentException("You are not authorized to update this review.");
        }

        if (request.getRating() < 1 || request.getRating() > 5) {
            throw new IllegalArgumentException("Rating must be between 1 and 5.");
        }

        review.setRating(request.getRating());
        review.setTitle(request.getTitle());
        review.setComment(request.getComment());

        Review updatedReview = reviewRepository.save(review);

        // Replace images
        List<ReviewImage> existingImages = reviewImageRepository.findByReviewId(reviewId);
        reviewImageRepository.deleteAll(existingImages);

        if (request.getImageUrls() != null) {
            for (String url : request.getImageUrls()) {
                if (url != null && !url.isBlank()) {
                    ReviewImage img = ReviewImage.builder()
                            .review(updatedReview)
                            .imageUrl(url)
                            .build();
                    reviewImageRepository.save(img);
                }
            }
        }

        return mapToResponse(updatedReview);
    }

    @Override
    @Transactional
    public void deleteReview(String userEmail, Long reviewId) {
        User currentUser = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));

        boolean isAdmin = "ADMIN".equals(currentUser.getRole()) || "ROLE_ADMIN".equals(currentUser.getRole());
        if (!review.getUser().getId().equals(currentUser.getId()) && !isAdmin) {
            throw new IllegalArgumentException("You are not authorized to delete this review.");
        }

        reviewRepository.delete(review);
    }

    @Override
    public List<ReviewResponse> getReviewsForProduct(Long productId) {
        return reviewRepository.findByProductIdAndIsHiddenFalse(productId).stream()
                .map(this::mapToResponse)
                .collect(Collectors.toList());
    }

    @Override
    public Page<ReviewResponse> getAllReviewsAdmin(String search, Integer rating, Boolean isHidden, int page, int size) {
        PageRequest pageRequest = PageRequest.of(page, size, Sort.by(Sort.Direction.DESC, "createdAt"));
        return reviewRepository.findAllWithFilters(search, rating, isHidden, pageRequest)
                .map(this::mapToResponse);
    }

    @Override
    @Transactional
    public void setReviewHiddenStatus(Long reviewId, boolean isHidden) {
        Review review = reviewRepository.findById(reviewId)
                .orElseThrow(() -> new RuntimeException("Review not found with id: " + reviewId));
        review.setIsHidden(isHidden);
        reviewRepository.save(review);
    }

    @Override
    public ReviewStatsDTO getReviewStats() {
        Double avgRating = reviewRepository.getAverageRatingOfAllProducts();
        long totalReviews = reviewRepository.count();
        long reviewsToday = reviewRepository.countByCreatedAtAfter(LocalDate.now().atStartOfDay());

        List<Object[]> mostReviewedData = reviewRepository.getMostReviewedProducts(PageRequest.of(0, 5));
        List<ProductReviewStat> mostReviewed = mostReviewedData.stream().map(row -> {
            Long prodId = (Long) row[0];
            String name = (String) row[1];
            Long count = (Long) row[2];
            Double prodAvg = reviewRepository.getAverageRatingByProductId(prodId);
            return new ProductReviewStat(prodId, name, prodAvg != null ? prodAvg : 0.0, count);
        }).collect(Collectors.toList());

        List<Object[]> lowestRatedData = reviewRepository.getLowestRatedProducts(PageRequest.of(0, 5));
        List<ProductReviewStat> lowestRated = lowestRatedData.stream().map(row -> {
            Long prodId = (Long) row[0];
            String name = (String) row[1];
            Double prodAvg = (Double) row[2];
            long count = reviewRepository.countByProductIdAndIsHiddenFalse(prodId);
            return new ProductReviewStat(prodId, name, prodAvg != null ? prodAvg : 0.0, count);
        }).collect(Collectors.toList());

        return new ReviewStatsDTO(
                avgRating != null ? avgRating : 0.0,
                totalReviews,
                reviewsToday,
                mostReviewed,
                lowestRated
        );
    }

    @Override
    public Map<Long, Boolean> getReviewStatusForOrder(String userEmail, String orderId) {
        User user = userRepository.findByEmail(userEmail)
                .orElseThrow(() -> new UsernameNotFoundException("User not found with email: " + userEmail));

        Order order = orderRepository.findById(orderId)
                .orElseThrow(() -> new RuntimeException("Order not found with id: " + orderId));

        if (!order.getUser().getId().equals(user.getId())) {
            throw new IllegalArgumentException("Access Denied: This order does not belong to you.");
        }

        Map<Long, Boolean> statusMap = new HashMap<>();
        for (OrderItem item : order.getOrderItems()) {
            boolean alreadyReviewed = reviewRepository.existsByUserIdAndProductId(user.getId(), item.getProduct().getId());
            statusMap.put(item.getProduct().getId(), alreadyReviewed);
        }

        return statusMap;
    }

    @Override
    public String saveReviewImage(MultipartFile file) {
        if (file.isEmpty()) {
            throw new IllegalArgumentException("Cannot save empty file.");
        }

        try {
            Path uploadPath = Paths.get(UPLOAD_DIR);
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            String extension = "";
            String originalFilename = file.getOriginalFilename();
            if (originalFilename != null && originalFilename.contains(".")) {
                extension = originalFilename.substring(originalFilename.lastIndexOf("."));
            }

            String uniqueFilename = UUID.randomUUID().toString() + extension;
            Path filePath = uploadPath.resolve(uniqueFilename);
            Files.copy(file.getInputStream(), filePath);

            return "/api/reviews/images/" + uniqueFilename;
        } catch (IOException e) {
            throw new RuntimeException("Could not store image file. Error: " + e.getMessage(), e);
        }
    }

    private ReviewResponse mapToResponse(Review review) {
        List<String> imageUrls = reviewImageRepository.findByReviewId(review.getId()).stream()
                .map(ReviewImage::getImageUrl)
                .collect(Collectors.toList());

        return new ReviewResponse(
                review.getId(),
                review.getProduct().getId(),
                review.getProduct().getName(),
                review.getOrder().getOrderId(),
                review.getRating(),
                review.getTitle(),
                review.getComment(),
                review.getVerifiedPurchase(),
                review.getIsHidden(),
                review.getUser().getFullName(),
                review.getUser().getEmail(),
                review.getUser().getProfilePictureUrl(),
                imageUrls,
                review.getCreatedAt().format(formatter),
                review.getUpdatedAt().format(formatter)
        );
    }
}
