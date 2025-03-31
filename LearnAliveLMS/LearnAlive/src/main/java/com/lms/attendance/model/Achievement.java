package com.lms.attendance.model;

import lombok.Data;

@Data
public class Achievement {
    private String userId;
    private int postCount;    // 사용자가 작성한 게시물 수
    private int totalLikes;   // 해당 게시물들이 받은 총 좋아요 수
    private int totalViews;   // 총 게시글 조회수
}