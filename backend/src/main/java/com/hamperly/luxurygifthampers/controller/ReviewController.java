package com.hamperly.luxurygifthampers.controller;

import com.hamperly.luxurygifthampers.dto.ReviewRequest;
import com.hamperly.luxurygifthampers.dto.ReviewResponse;
import com.hamperly.luxurygifthampers.dto.admin.ReviewStatsDTO;
import com.hamperly.luxurygifthampers.service.ReviewService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.data.domain.Page;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import org.springframework.security.core.userdetails.UserDetails;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.nio.file.Path;
import java.nio.file.Paths;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

@RestController
@RequestMapping("/api")
public class ReviewController {

    @Autowired
    private ReviewService reviewService;

    // 1. Submit review
    @PostMapping("/reviews")
    public ResponseEntity<ReviewResponse> submitReview(
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        ReviewResponse response = reviewService.submitReview(userDetails.getUsername(), request);
        return ResponseEntity.ok(response);
    }

    // 2. Edit review
    @PutMapping("/reviews/{id}")
    public ResponseEntity<ReviewResponse> updateReview(
            @PathVariable("id") Long reviewId,
            @Valid @RequestBody ReviewRequest request,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        ReviewResponse response = reviewService.updateReview(userDetails.getUsername(), reviewId, request);
        return ResponseEntity.ok(response);
    }

    // 3. Delete review
    @DeleteMapping("/reviews/{id}")
    public ResponseEntity<Map<String, String>> deleteReview(
            @PathVariable("id") Long reviewId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        reviewService.deleteReview(userDetails.getUsername(), reviewId);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Review deleted successfully.");
        return ResponseEntity.ok(response);
    }

    // 4. Get product reviews
    @GetMapping("/products/{id}/reviews")
    public ResponseEntity<List<ReviewResponse>> getProductReviews(@PathVariable("id") Long productId) {
        List<ReviewResponse> reviews = reviewService.getReviewsForProduct(productId);
        return ResponseEntity.ok(reviews);
    }

    // 5. Get review eligibility/status for an order
    @GetMapping("/reviews/check-order/{orderId}")
    public ResponseEntity<Map<Long, Boolean>> getReviewStatusForOrder(
            @PathVariable("orderId") String orderId,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        Map<Long, Boolean> status = reviewService.getReviewStatusForOrder(userDetails.getUsername(), orderId);
        return ResponseEntity.ok(status);
    }

    // 6. Upload review image
    @PostMapping("/reviews/upload")
    public ResponseEntity<Map<String, String>> uploadImage(
            @RequestParam("file") MultipartFile file,
            @AuthenticationPrincipal UserDetails userDetails) {
        if (userDetails == null) {
            return ResponseEntity.status(401).build();
        }
        String imageUrl = reviewService.saveReviewImage(file);
        Map<String, String> response = new HashMap<>();
        response.put("imageUrl", imageUrl);
        return ResponseEntity.ok(response);
    }

    // 7. Serve review image (Public)
    @GetMapping("/reviews/images/{filename:.+}")
    public ResponseEntity<Resource> serveImage(@PathVariable String filename) {
        try {
            Path filePath = Paths.get("uploads/reviews").resolve(filename);
            Resource resource = new UrlResource(filePath.toUri());

            if (resource.exists() || resource.isReadable()) {
                String contentType = "image/jpeg";
                if (filename.toLowerCase().endsWith(".png")) {
                    contentType = "image/png";
                } else if (filename.toLowerCase().endsWith(".gif")) {
                    contentType = "image/gif";
                } else if (filename.toLowerCase().endsWith(".webp")) {
                    contentType = "image/webp";
                }
                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .body(resource);
            } else {
                return ResponseEntity.notFound().build();
            }
        } catch (Exception e) {
            return ResponseEntity.internalServerError().build();
        }
    }

    // ==========================================
    // ADMIN ENDPOINTS (Secured via /api/admin/**)
    // ==========================================

    // 8. Admin reviews page with search/filters
    @GetMapping("/admin/reviews")
    public ResponseEntity<Page<ReviewResponse>> getAllReviewsAdmin(
            @RequestParam(value = "search", required = false) String search,
            @RequestParam(value = "rating", required = false) Integer rating,
            @RequestParam(value = "isHidden", required = false) Boolean isHidden,
            @RequestParam(value = "page", defaultValue = "0") int page,
            @RequestParam(value = "size", defaultValue = "10") int size) {
        Page<ReviewResponse> response = reviewService.getAllReviewsAdmin(search, rating, isHidden, page, size);
        return ResponseEntity.ok(response);
    }

    // 9. Admin Hide review
    @PatchMapping("/admin/reviews/{id}/hide")
    public ResponseEntity<Map<String, String>> hideReview(@PathVariable("id") Long reviewId) {
        reviewService.setReviewHiddenStatus(reviewId, true);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Review hidden successfully.");
        return ResponseEntity.ok(response);
    }

    // 10. Admin Unhide review
    @PatchMapping("/admin/reviews/{id}/unhide")
    public ResponseEntity<Map<String, String>> unhideReview(@PathVariable("id") Long reviewId) {
        reviewService.setReviewHiddenStatus(reviewId, false);
        Map<String, String> response = new HashMap<>();
        response.put("message", "Review unhidden successfully.");
        return ResponseEntity.ok(response);
    }

    // 11. Admin Review stats
    @GetMapping("/admin/reviews/stats")
    public ResponseEntity<ReviewStatsDTO> getReviewStats() {
        ReviewStatsDTO stats = reviewService.getReviewStats();
        return ResponseEntity.ok(stats);
    }
}
