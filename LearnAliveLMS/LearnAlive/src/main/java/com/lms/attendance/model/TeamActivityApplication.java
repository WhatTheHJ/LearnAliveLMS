package com.lms.attendance.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TeamActivityApplication {
    private int applicationId;       // 신청 ID
    private int postId;              // 연계된 팀 활동 게시글 ID
    private String applicantStudentId;   // 참가 신청한 학생의 학번
    private String status;               // 신청 상태: PENDING, APPROVED, REJECTED
    private LocalDateTime appliedAt;     // 신청 시각
}