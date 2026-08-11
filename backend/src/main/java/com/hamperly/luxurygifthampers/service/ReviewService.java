package com.hamperly.luxurygifthampers.service;

import com.hamperly.luxurygifthampers.dto.ReviewRequest;
import com.hamperly.luxurygifthampers.dto.ReviewResponse;
import com.hamperly.luxurygifthampers.dto.admin.ReviewStatsDTO;
import org.springframework.data.domain.Page;
import org.springframework.web.multipart.MultipartFile;

import java.util.List;
import java.util.Map;

public interface ReviewService {

    ReviewResponse submitReview(String userEmail, ReviewRequest request);

    ReviewResponse updateReview(String userEmail, Long reviewId, ReviewRequest request);

    void deleteReview(String userEmail, Long reviewId);

    List<ReviewResponse> getReviewsForProduct(Long productId);

    Page<ReviewResponse> getAllReviewsAdmin(String search, Integer rating, Boolean isHidden, int page, int size);

    void setReviewHiddenStatus(Long reviewId, boolean isHidden);

    ReviewStatsDTO getReviewStats();

    Map<Long, Boolean> getReviewStatusForOrder(String userEmail, String orderId);

    String saveReviewImage(MultipartFile file);
}
