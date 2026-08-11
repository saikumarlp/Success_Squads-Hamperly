package com.hamperly.luxurygifthampers.service.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.OverallStats;
import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.RevenuePoint;
import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.DateStats;
import java.util.List;

public interface AdminAnalyticsService {
    OverallStats getOverallStats();
    List<RevenuePoint> getDailyRevenue(String date);
    List<RevenuePoint> getMonthlyRevenue(String date);
    List<RevenuePoint> getYearlyRevenue(String date);
    DateStats getDateStats(String date);
    DateStats getTodayStats();
    DateStats getMonthStats(String date);
    DateStats getYearStats(String date);
}
