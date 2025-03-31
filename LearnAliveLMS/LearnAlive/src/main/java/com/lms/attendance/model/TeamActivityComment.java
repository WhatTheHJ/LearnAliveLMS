package com.lms.attendance.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TeamActivityComment {
    private int commentId;           // 댓글 ID
    private int postId;              // 댓글이 달린 게시글 ID
    private String commenterId;          // 댓글 작성자의 학번
    private String content;              // 댓글 내용
    private LocalDateTime createdAt;     // 댓글 작성 시각
}