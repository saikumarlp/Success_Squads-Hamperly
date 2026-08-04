package com.hamperly.luxurygifthampers.repository.admin;

import com.hamperly.luxurygifthampers.entity.Product;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.Pageable;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

@Repository
public interface AdminProductRepository extends JpaRepository<Product, Long> {
    
    @Query("SELECT p FROM Product p WHERE " +
           "(:search IS NULL OR LOWER(p.name) LIKE LOWER(CONCAT('%', :search, '%')) OR LOWER(p.description) LIKE LOWER(CONCAT('%', :search, '%'))) AND " +
           "(:categoryId IS NULL OR p.category.id = :categoryId)")
    Page<Product> searchProducts(@Param("search") String search, @Param("categoryId") Long categoryId, Pageable pageable);

    @Query("SELECT COUNT(p) FROM Product p WHERE p.stock <= 0")
    Long countOutOfStockProducts();
}
