package com.hamperly.luxurygifthampers.controller.admin;

import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.OverallStats;
import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.RevenuePoint;
import com.hamperly.luxurygifthampers.dto.admin.AdminAnalyticsResponse.DateStats;
import com.hamperly.luxurygifthampers.service.admin.AdminAnalyticsService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
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
    public ResponseEntity<List<RevenuePoint>> getDailyRevenue(@RequestParam(value = "date", required = false) String date) {
        return ResponseEntity.ok(adminAnalyticsService.getDailyRevenue(date));
    }

    @GetMapping("/monthly")
    public ResponseEntity<List<RevenuePoint>> getMonthlyRevenue(@RequestParam(value = "date", required = false) String date) {
        return ResponseEntity.ok(adminAnalyticsService.getMonthlyRevenue(date));
    }

    @GetMapping("/yearly")
    public ResponseEntity<List<RevenuePoint>> getYearlyRevenue(@RequestParam(value = "date", required = false) String date) {
        return ResponseEntity.ok(adminAnalyticsService.getYearlyRevenue(date));
    }

    @GetMapping("/today")
    public ResponseEntity<DateStats> getTodayStats() {
        return ResponseEntity.ok(adminAnalyticsService.getTodayStats());
    }

    @GetMapping("/date")
    public ResponseEntity<DateStats> getDateStats(@RequestParam(value = "date", required = false) String date) {
        return ResponseEntity.ok(adminAnalyticsService.getDateStats(date));
    }

    @GetMapping("/month")
    public ResponseEntity<DateStats> getMonthStats(@RequestParam(value = "date", required = false) String date) {
        return ResponseEntity.ok(adminAnalyticsService.getMonthStats(date));
    }

    @GetMapping("/year")
    public ResponseEntity<DateStats> getYearStats(@RequestParam(value = "date", required = false) String date) {
        return ResponseEntity.ok(adminAnalyticsService.getYearStats(date));
    }
}
