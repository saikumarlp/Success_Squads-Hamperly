package com.hamperly.luxurygifthampers.controller.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.OverallStats;
import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.RevenuePoint;
import com.hamperly.luxurygifthampers.service.admin.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequestMapping("/api/admin/analytics")
public class AdminAnalyticsController {

    @Autowired
    private AdminAnalyticsService adminAnalyticsService;

    @GetMapping("/overall")
    public ResponseEntity<OverallStats> getOverallStats() {
        return ResponseEntity.ok(adminAnalyticsService.getOverallStats());
    }

    @GetMapping("/daily")
    public ResponseEntity<List<RevenuePoint>> getDailyRevenue() {
        return ResponseEntity.ok(adminAnalyticsService.getDailyRevenue());
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<RevenuePoint>> getMonthlyRevenue() {
        return ResponseEntity.ok(adminAnalyticsService.getMonthlyRevenue());
    }

    @GetMapping("/yearly")
    public ResponseEntity<List<RevenuePoint>> getYearlyRevenue() {
        return ResponseEntity.ok(adminAnalyticsService.getYearlyRevenue());
    }
}
