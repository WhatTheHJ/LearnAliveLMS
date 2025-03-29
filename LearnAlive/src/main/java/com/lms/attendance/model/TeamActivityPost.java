package com.lms.attendance.model;

import lombok.Data;
import java.time.LocalDateTime;
import java.util.List;

@Data
public class TeamActivityPost {
    private int postId;              // 게시글 ID
    private int classId;             // 연계된 강의실 ID
    private String title;                // 게시글 제목
    private String content;              // 게시글 내용
    private String authorId;             // 작성자 학번
    private String authorName;           // 작성자 이름
    private String department;           // 학과 정보
    private String email;                // 이메일
    private String contact;              // 연락처
    private int likes = 0;               // 좋아요 수
    // team_members 컬럼은 JSON 배열 형태로 저장되며, List<String> 타입으로 매핑 (필요시 타입 핸들러 적용)
    private List<String> teamMembers;    
    private LocalDateTime createdAt;     // 생성 시각
    private LocalDateTime updatedAt;     // 수정 시각
}