package com.lms.attendance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lms.attendance.model.Achievement;
import com.lms.attendance.service.AchievementService;

@RestController
@RequestMapping("/api/achievements")
@CrossOrigin(origins = "http://localhost:5173")
public class AchievementController {

    @Autowired
    private AchievementService achievementService;

    // 특정 사용자(userId)의 업적(게시물 수, 총 좋아요 수) 조회
    @GetMapping("/{userId}")
    public ResponseEntity<Achievement> getAchievementByUser(@PathVariable("userId") String userId) {
        Achievement achievement = achievementService.getUserAchievement(userId);
        return ResponseEntity.ok(achievement);
    }
}