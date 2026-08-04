package com.hamperly.luxurygifthampers.repository.admin;

import com.hamperly.luxurygifthampers.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface AdminOrderRepository extends JpaRepository<Order, String> {
    
    @Query("SELECT o FROM Order o WHERE o.status NOT IN (com.hamperly.luxurygifthampers.entity.OrderStatus.PENDING, com.hamperly.luxurygifthampers.entity.OrderStatus.CANCELLED, com.hamperly.luxurygifthampers.entity.OrderStatus.FAILED)")
    List<Order> findAllSuccessOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = com.hamperly.luxurygifthampers.entity.OrderStatus.PENDING")
    Long countPendingOrders();
}
