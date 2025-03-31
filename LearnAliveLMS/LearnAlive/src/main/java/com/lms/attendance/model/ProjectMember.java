package com.lms.attendance.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ProjectMember {
    private int memberId;        // auto-generated primary key
    private int postId;          // 연관된 팀 활동 게시글 ID
    private String studentId;    // 학생 학번
    private String name;         // 학생 이름
    private String department;   // 학과 정보
    private String email;        // 이메일
    private String contact;      // 연락처
    private LocalDateTime approvedAt;  // 승인 시각
}