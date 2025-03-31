package com.lms.attendance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import com.lms.attendance.model.Achievement;
import com.lms.attendance.repository.AchievementMapper;

@Service
public class AchievementService {

    @Autowired
    private AchievementMapper achievementMapper;

    public Achievement getUserAchievement(String userId) {
        Achievement achievement = new Achievement();
        achievement.setUserId(userId);
        achievement.setPostCount(achievementMapper.getPostCountByUser(userId));
        achievement.setTotalLikes(achievementMapper.getTotalLikesByUser(userId));
        achievement.setTotalViews(achievementMapper.getTotalViewsByUser(userId));
        return achievement;
    }
}