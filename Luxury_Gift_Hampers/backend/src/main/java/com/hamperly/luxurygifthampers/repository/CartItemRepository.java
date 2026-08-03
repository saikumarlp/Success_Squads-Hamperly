package com.hamperly.luxurygifthampers.repository;

import com.hamperly.luxurygifthampers.entity.CartItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public interface CartItemRepository extends JpaRepository<CartItem, Long> {
    List<CartItem> findByUserId(Long userId);
    
    Optional<CartItem> findByUserIdAndProductId(Long userId, Long productId);

    @Query("SELECT COALESCE(SUM(c.quantity), 0) FROM CartItem c WHERE c.user.id = :userId")
    Integer sumQuantityByUserId(@Param("userId") Long userId);

    void deleteByUserIdAndProductId(Long userId, Long productId);
}
