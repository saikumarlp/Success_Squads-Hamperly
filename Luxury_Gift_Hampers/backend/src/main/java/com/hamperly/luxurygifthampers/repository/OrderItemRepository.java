package com.hamperly.luxurygifthampers.repository;

import com.hamperly.luxurygifthampers.entity.OrderItem;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface OrderItemRepository extends JpaRepository<OrderItem, Long> {
    List<OrderItem> findByOrderOrderId(String orderId);
}
