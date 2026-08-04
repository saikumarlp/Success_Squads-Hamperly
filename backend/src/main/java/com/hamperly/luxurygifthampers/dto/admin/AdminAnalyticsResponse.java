package com.hamperly.luxurygifthampers.dto.admin;

import java.math.BigDecimal;

public class AdminAnalyticsResponse {

    public static class OverallStats {
        private BigDecimal totalRevenue;
        private BigDecimal todayRevenue;
        private BigDecimal monthlyRevenue;
        private Long totalProducts;
        private Long totalUsers;
        private Long totalOrders;
        private Long pendingOrders;
        private Long outOfStockProducts;

        public OverallStats() {
        }

        public OverallStats(BigDecimal totalRevenue, BigDecimal todayRevenue, BigDecimal monthlyRevenue, Long totalProducts, Long totalUsers, Long totalOrders, Long pendingOrders, Long outOfStockProducts) {
            this.totalRevenue = totalRevenue;
            this.todayRevenue = todayRevenue;
            this.monthlyRevenue = monthlyRevenue;
            this.totalProducts = totalProducts;
            this.totalUsers = totalUsers;
            this.totalOrders = totalOrders;
            this.pendingOrders = pendingOrders;
            this.outOfStockProducts = outOfStockProducts;
        }

        // Getters and Setters
        public BigDecimal getTotalRevenue() { return totalRevenue; }
        public void setTotalRevenue(BigDecimal totalRevenue) { this.totalRevenue = totalRevenue; }

        public BigDecimal getTodayRevenue() { return todayRevenue; }
        public void setTodayRevenue(BigDecimal todayRevenue) { this.todayRevenue = todayRevenue; }

        public BigDecimal getMonthlyRevenue() { return monthlyRevenue; }
        public void setMonthlyRevenue(BigDecimal monthlyRevenue) { this.monthlyRevenue = monthlyRevenue; }

        public Long getTotalProducts() { return totalProducts; }
        public void setTotalProducts(Long totalProducts) { this.totalProducts = totalProducts; }

        public Long getTotalUsers() { return totalUsers; }
        public void setTotalUsers(Long totalUsers) { this.totalUsers = totalUsers; }

        public Long getTotalOrders() { return totalOrders; }
        public void setTotalOrders(Long totalOrders) { this.totalOrders = totalOrders; }

        public Long getPendingOrders() { return pendingOrders; }
        public void setPendingOrders(Long pendingOrders) { this.pendingOrders = pendingOrders; }

        public Long getOutOfStockProducts() { return outOfStockProducts; }
        public void setOutOfStockProducts(Long outOfStockProducts) { this.outOfStockProducts = outOfStockProducts; }
    }

    public static class RevenuePoint {
        private String period;
        private BigDecimal revenue;
        private Long ordersCount;

        public RevenuePoint() {
        }

        public RevenuePoint(String period, BigDecimal revenue, Long ordersCount) {
            this.period = period;
            this.revenue = revenue;
            this.ordersCount = ordersCount;
        }

        // Getters and Setters
        public String getPeriod() { return period; }
        public void setPeriod(String period) { this.period = period; }

        public BigDecimal getRevenue() { return revenue; }
        public void setRevenue(BigDecimal revenue) { this.revenue = revenue; }

        public Long getOrdersCount() { return ordersCount; }
        public void setOrdersCount(Long ordersCount) { this.ordersCount = ordersCount; }
    }
}
