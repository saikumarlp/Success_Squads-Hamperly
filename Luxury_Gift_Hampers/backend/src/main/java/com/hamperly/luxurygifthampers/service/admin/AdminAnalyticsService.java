package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.OverallStats;
import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.RevenuePoint;
import java.util.List;

public interface AdminAnalyticsService {
    OverallStats getOverallStats();
    List<RevenuePoint> getDailyRevenue();
    List<RevenuePoint> getMonthlyRevenue();
    List<RevenuePoint> getYearlyRevenue();
}
