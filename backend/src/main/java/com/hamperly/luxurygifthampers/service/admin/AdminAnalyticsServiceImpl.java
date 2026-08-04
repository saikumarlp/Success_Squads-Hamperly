package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.OverallStats;
import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.RevenuePoint;
import com.hamperly.luxurygifthampers.entity.Order;
import com.hamperly.luxurygifthampers.repository.admin.AdminOrderRepository;
import com.hamperly.luxurygifthampers.repository.admin.AdminProductRepository;
import com.hamperly.luxurygifthampers.repository.admin.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.YearMonth;
import java.time.format.DateTimeFormatter;
import java.util.*;
import java.util.stream.Collectors;

@Service
public class AdminAnalyticsServiceImpl implements AdminAnalyticsService {

    @Autowired
    private AdminOrderRepository adminOrderRepository;

    @Autowired
    private AdminProductRepository adminProductRepository;

    @Autowired
    private AdminUserRepository adminUserRepository;

    @Override
    @Transactional(readOnly = true)
    public OverallStats getOverallStats() {
        List<Order> successOrders = adminOrderRepository.findAllSuccessOrders();

        BigDecimal totalRevenue = BigDecimal.ZERO;
        BigDecimal todayRevenue = BigDecimal.ZERO;
        BigDecimal monthlyRevenue = BigDecimal.ZERO;

        LocalDate today = LocalDate.now();
        YearMonth thisMonth = YearMonth.now();

        for (Order order : successOrders) {
            BigDecimal amt = order.getTotalAmount() != null ? order.getTotalAmount() : BigDecimal.ZERO;
            totalRevenue = totalRevenue.add(amt);

            if (order.getCreatedAt() != null) {
                LocalDate orderDate = order.getCreatedAt().toLocalDate();
                if (orderDate.equals(today)) {
                    todayRevenue = todayRevenue.add(amt);
                }
                if (YearMonth.from(orderDate).equals(thisMonth)) {
                    monthlyRevenue = monthlyRevenue.add(amt);
                }
            }
        }

        Long totalProducts = adminProductRepository.count();
        Long totalUsers = adminUserRepository.count();
        Long totalOrders = adminOrderRepository.count();
        Long pendingOrders = adminOrderRepository.countPendingOrders();
        Long outOfStockProducts = adminProductRepository.countOutOfStockProducts();

        return new OverallStats(
                totalRevenue,
                todayRevenue,
                monthlyRevenue,
                totalProducts,
                totalUsers,
                totalOrders,
                pendingOrders,
                outOfStockProducts
        );
    }

    @Override
    @Transactional(readOnly = true)
    public List<RevenuePoint> getDailyRevenue() {
        List<Order> successOrders = adminOrderRepository.findAllSuccessOrders();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM-dd");

        Map<String, List<Order>> grouped = successOrders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .collect(Collectors.groupingBy(o -> o.getCreatedAt().format(formatter)));

        List<RevenuePoint> list = new ArrayList<>();
        grouped.forEach((period, orders) -> {
            BigDecimal total = orders.stream()
                    .map(Order::getTotalAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            list.add(new RevenuePoint(period, total, (long) orders.size()));
        });

        list.sort(Comparator.comparing(RevenuePoint::getPeriod));
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RevenuePoint> getMonthlyRevenue() {
        List<Order> successOrders = adminOrderRepository.findAllSuccessOrders();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy-MM");

        Map<String, List<Order>> grouped = successOrders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .collect(Collectors.groupingBy(o -> o.getCreatedAt().format(formatter)));

        List<RevenuePoint> list = new ArrayList<>();
        grouped.forEach((period, orders) -> {
            BigDecimal total = orders.stream()
                    .map(Order::getTotalAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            list.add(new RevenuePoint(period, total, (long) orders.size()));
        });

        list.sort(Comparator.comparing(RevenuePoint::getPeriod));
        return list;
    }

    @Override
    @Transactional(readOnly = true)
    public List<RevenuePoint> getYearlyRevenue() {
        List<Order> successOrders = adminOrderRepository.findAllSuccessOrders();
        DateTimeFormatter formatter = DateTimeFormatter.ofPattern("yyyy");

        Map<String, List<Order>> grouped = successOrders.stream()
                .filter(o -> o.getCreatedAt() != null)
                .collect(Collectors.groupingBy(o -> o.getCreatedAt().format(formatter)));

        List<RevenuePoint> list = new ArrayList<>();
        grouped.forEach((period, orders) -> {
            BigDecimal total = orders.stream()
                    .map(Order::getTotalAmount)
                    .filter(Objects::nonNull)
                    .reduce(BigDecimal.ZERO, BigDecimal::add);
            list.add(new RevenuePoint(period, total, (long) orders.size()));
        });

        list.sort(Comparator.comparing(RevenuePoint::getPeriod));
        return list;
    }
}
