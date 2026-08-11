package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.OverallStats;
import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.RevenuePoint;
import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.DateStats;
import com.hamperly.luxurygifthampers.repository.admin.AdminOrderRepository;
import com.hamperly.luxurygifthampers.repository.admin.AdminProductRepository;
import com.hamperly.luxurygifthampers.repository.admin.AdminUserRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.time.YearMonth;
import java.util.*;

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
        LocalDateTime todayStart = LocalDate.now().atStartOfDay();
        LocalDateTime todayEnd = LocalDate.now().atTime(23, 59, 59, 999999999);
        LocalDateTime monthStart = LocalDate.now().withDayOfMonth(1).atStartOfDay();
        LocalDateTime monthEnd = LocalDate.now().with(java.time.temporal.TemporalAdjusters.lastDayOfMonth()).atTime(23, 59, 59, 999999999);

        BigDecimal totalRevenue = adminOrderRepository.sumTotalRevenue();
        BigDecimal todayRevenue = adminOrderRepository.sumRevenueBetween(todayStart, todayEnd);
        BigDecimal monthlyRevenue = adminOrderRepository.sumRevenueBetween(monthStart, monthEnd);

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
    public List<RevenuePoint> getDailyRevenue(String dateStr) {
        LocalDate date = (dateStr != null && !dateStr.isEmpty()) ? LocalDate.parse(dateStr) : LocalDate.now();
        List<Object[]> results = adminOrderRepository.findHourlyRevenue(date.toString());

        Map<String, RevenuePoint> points = new TreeMap<>();
        for (int i = 0; i < 24; i++) {
            String hourStr = String.format("%02d:00", i);
            points.put(hourStr, new RevenuePoint(hourStr, BigDecimal.ZERO, 0L));
        }

        for (Object[] row : results) {
            Number hrNum = (Number) row[0];
            BigDecimal rev = (BigDecimal) row[1];
            Number cntNum = (Number) row[2];
            String hourStr = String.format("%02d:00", hrNum.intValue());
            points.put(hourStr, new RevenuePoint(hourStr, rev, cntNum.longValue()));
        }

        return new ArrayList<>(points.values());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RevenuePoint> getMonthlyRevenue(String dateStr) {
        YearMonth ym = (dateStr != null && !dateStr.isEmpty()) ? YearMonth.parse(dateStr.substring(0, 7)) : YearMonth.now();
        int daysInMonth = ym.lengthOfMonth();

        Map<String, RevenuePoint> points = new TreeMap<>();
        for (int d = 1; d <= daysInMonth; d++) {
            String dateKey = String.format("%s-%02d", ym.toString(), d);
            points.put(dateKey, new RevenuePoint(dateKey, BigDecimal.ZERO, 0L));
        }

        List<Object[]> results = adminOrderRepository.findDailyRevenueForMonth(ym.getYear(), ym.getMonthValue());
        for (Object[] row : results) {
            java.sql.Date sqlDate = (java.sql.Date) row[0];
            LocalDate lDate = sqlDate.toLocalDate();
            String dateKey = lDate.toString();
            BigDecimal rev = (BigDecimal) row[1];
            Number cntNum = (Number) row[2];
            points.put(dateKey, new RevenuePoint(dateKey, rev, cntNum.longValue()));
        }

        return new ArrayList<>(points.values());
    }

    @Override
    @Transactional(readOnly = true)
    public List<RevenuePoint> getYearlyRevenue(String dateStr) {
        int year;
        if (dateStr != null && !dateStr.isEmpty()) {
            if (dateStr.contains("-")) {
                year = LocalDate.parse(dateStr).getYear();
            } else {
                year = Integer.parseInt(dateStr);
            }
        } else {
            year = LocalDate.now().getYear();
        }

        Map<String, RevenuePoint> points = new TreeMap<>();
        for (int m = 1; m <= 12; m++) {
            String monthKey = String.format("%d-%02d", year, m);
            points.put(monthKey, new RevenuePoint(monthKey, BigDecimal.ZERO, 0L));
        }

        List<Object[]> results = adminOrderRepository.findMonthlyRevenueForYear(year);
        for (Object[] row : results) {
            Number mthNum = (Number) row[0];
            BigDecimal rev = (BigDecimal) row[1];
            Number cntNum = (Number) row[2];
            String monthKey = String.format("%d-%02d", year, mthNum.intValue());
            points.put(monthKey, new RevenuePoint(monthKey, rev, cntNum.longValue()));
        }

        return new ArrayList<>(points.values());
    }

    @Override
    @Transactional(readOnly = true)
    public DateStats getDateStats(String dateStr) {
        LocalDate date = (dateStr != null && !dateStr.isEmpty()) ? LocalDate.parse(dateStr) : LocalDate.now();
        LocalDateTime start = date.atStartOfDay();
        LocalDateTime end = date.atTime(23, 59, 59, 999999999);
        return fetchDateStats(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public DateStats getTodayStats() {
        LocalDateTime start = LocalDate.now().atStartOfDay();
        LocalDateTime end = LocalDate.now().atTime(23, 59, 59, 999999999);
        return fetchDateStats(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public DateStats getMonthStats(String dateStr) {
        YearMonth ym = (dateStr != null && !dateStr.isEmpty()) ? YearMonth.parse(dateStr.substring(0, 7)) : YearMonth.now();
        LocalDateTime start = ym.atDay(1).atStartOfDay();
        LocalDateTime end = ym.atEndOfMonth().atTime(23, 59, 59, 999999999);
        return fetchDateStats(start, end);
    }

    @Override
    @Transactional(readOnly = true)
    public DateStats getYearStats(String dateStr) {
        int year;
        if (dateStr != null && !dateStr.isEmpty()) {
            if (dateStr.contains("-")) {
                year = LocalDate.parse(dateStr).getYear();
            } else {
                year = Integer.parseInt(dateStr);
            }
        } else {
            year = LocalDate.now().getYear();
        }
        LocalDateTime start = LocalDate.of(year, 1, 1).atStartOfDay();
        LocalDateTime end = LocalDate.of(year, 12, 31).atTime(23, 59, 59, 999999999);
        return fetchDateStats(start, end);
    }

    private DateStats fetchDateStats(LocalDateTime start, LocalDateTime end) {
        BigDecimal revenue = adminOrderRepository.sumRevenueBetween(start, end);
        Long count = adminOrderRepository.countOrdersBetween(start, end);
        BigDecimal avg = adminOrderRepository.avgOrderValueBetween(start, end);
        Long productsSold = adminOrderRepository.sumProductsSoldBetween(start, end);
        return new DateStats(revenue, count, avg, productsSold);
    }
}
