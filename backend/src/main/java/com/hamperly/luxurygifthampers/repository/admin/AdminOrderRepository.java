package com.hamperly.luxurygifthampers.repository.admin;

import com.hamperly.luxurygifthampers.entity.Order;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.List;

@Repository
public interface AdminOrderRepository extends JpaRepository<Order, String> {
    
    @Query("SELECT o FROM Order o WHERE o.status NOT IN (com.hamperly.luxurygifthampers.entity.OrderStatus.PENDING, com.hamperly.luxurygifthampers.entity.OrderStatus.CANCELLED, com.hamperly.luxurygifthampers.entity.OrderStatus.FAILED)")
    List<Order> findAllSuccessOrders();

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status = com.hamperly.luxurygifthampers.entity.OrderStatus.PENDING")
    Long countPendingOrders();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status NOT IN (com.hamperly.luxurygifthampers.entity.OrderStatus.PENDING, com.hamperly.luxurygifthampers.entity.OrderStatus.CANCELLED, com.hamperly.luxurygifthampers.entity.OrderStatus.FAILED)")
    BigDecimal sumTotalRevenue();

    @Query("SELECT COALESCE(SUM(o.totalAmount), 0) FROM Order o WHERE o.status NOT IN (com.hamperly.luxurygifthampers.entity.OrderStatus.PENDING, com.hamperly.luxurygifthampers.entity.OrderStatus.CANCELLED, com.hamperly.luxurygifthampers.entity.OrderStatus.FAILED) AND o.createdAt >= :start AND o.createdAt <= :end")
    BigDecimal sumRevenueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COUNT(o) FROM Order o WHERE o.status NOT IN (com.hamperly.luxurygifthampers.entity.OrderStatus.PENDING, com.hamperly.luxurygifthampers.entity.OrderStatus.CANCELLED, com.hamperly.luxurygifthampers.entity.OrderStatus.FAILED) AND o.createdAt >= :start AND o.createdAt <= :end")
    Long countOrdersBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(AVG(o.totalAmount), 0) FROM Order o WHERE o.status NOT IN (com.hamperly.luxurygifthampers.entity.OrderStatus.PENDING, com.hamperly.luxurygifthampers.entity.OrderStatus.CANCELLED, com.hamperly.luxurygifthampers.entity.OrderStatus.FAILED) AND o.createdAt >= :start AND o.createdAt <= :end")
    BigDecimal avgOrderValueBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query("SELECT COALESCE(SUM(oi.quantity), 0) FROM OrderItem oi JOIN oi.order o WHERE o.status NOT IN (com.hamperly.luxurygifthampers.entity.OrderStatus.PENDING, com.hamperly.luxurygifthampers.entity.OrderStatus.CANCELLED, com.hamperly.luxurygifthampers.entity.OrderStatus.FAILED) AND o.createdAt >= :start AND o.createdAt <= :end")
    Long sumProductsSoldBetween(@Param("start") LocalDateTime start, @Param("end") LocalDateTime end);

    @Query(value = "SELECT HOUR(o.created_at) as hr, COALESCE(SUM(o.total_amount), 0) as rev, COUNT(o.order_id) as cnt " +
            "FROM orders o " +
            "WHERE o.status NOT IN ('PENDING', 'CANCELLED', 'FAILED') " +
            "AND DATE(o.created_at) = :dateStr " +
            "GROUP BY HOUR(o.created_at) " +
            "ORDER BY hr ASC", nativeQuery = true)
    List<Object[]> findHourlyRevenue(@Param("dateStr") String dateStr);

    @Query(value = "SELECT DATE(o.created_at) as dt, COALESCE(SUM(o.total_amount), 0) as rev, COUNT(o.order_id) as cnt " +
            "FROM orders o " +
            "WHERE o.status NOT IN ('PENDING', 'CANCELLED', 'FAILED') " +
            "AND YEAR(o.created_at) = :year " +
            "AND MONTH(o.created_at) = :month " +
            "GROUP BY DATE(o.created_at) " +
            "ORDER BY dt ASC", nativeQuery = true)
    List<Object[]> findDailyRevenueForMonth(@Param("year") int year, @Param("month") int month);

    @Query(value = "SELECT MONTH(o.created_at) as mth, COALESCE(SUM(o.total_amount), 0) as rev, COUNT(o.order_id) as cnt " +
            "FROM orders o " +
            "WHERE o.status NOT IN ('PENDING', 'CANCELLED', 'FAILED') " +
            "AND YEAR(o.created_at) = :year " +
            "GROUP BY MONTH(o.created_at) " +
            "ORDER BY mth ASC", nativeQuery = true)
    List<Object[]> findMonthlyRevenueForYear(@Param("year") int year);
}
