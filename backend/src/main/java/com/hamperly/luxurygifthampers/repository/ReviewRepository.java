package com.hamperly.luxurygifthampers.repository;

import com.hamperly.luxurygifthampers.entity.Review;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

@Repository
public interface ReviewRepository extends JpaRepository<Review, Long> {

    List<Review> findByProductIdAndIsHiddenFalse(Long productId);

    List<Review> findByProductId(Long productId);

    long countByProductIdAndIsHiddenFalse(Long productId);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.product.id = :productId AND r.isHidden = false")
    Double getAverageRatingByProductId(@Param("productId") Long productId);

    boolean existsByUserIdAndProductId(Long userId, Long productId);

    Optional<Review> findByUserIdAndProductId(Long userId, Long productId);

    long countByCreatedAtAfter(LocalDateTime dateTime);

    @Query("SELECT AVG(r.rating) FROM Review r WHERE r.isHidden = false")
    Double getAverageRatingOfAllProducts();

    @Query("SELECT r.product.id, r.product.name, COUNT(r) FROM Review r GROUP BY r.product.id, r.product.name ORDER BY COUNT(r) DESC")
    List<Object[]> getMostReviewedProducts(Pageable pageable);

    @Query("SELECT r.product.id, r.product.name, AVG(CAST(r.rating as double)) FROM Review r GROUP BY r.product.id, r.product.name ORDER BY AVG(CAST(r.rating as double)) ASC")
    List<Object[]> getLowestRatedProducts(Pageable pageable);

    @Query("SELECT r FROM Review r WHERE " +
           "(:search IS NULL OR LOWER(r.product.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.user.fullName) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(r.comment) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:rating IS NULL OR r.rating = :rating) AND " +
           "(:isHidden IS NULL OR r.isHidden = :isHidden)")
    Page<Review> findAllWithFilters(@Param("search") String search, 
                                    @Param("rating") Integer rating, 
                                    @Param("isHidden") Boolean isHidden, 
                                    Pageable pageable);
}
