package com.lms.attendance.model;

import java.time.LocalDateTime;

public class Notice {
    
    private int notice_id; // noticeId -> notice_id로 변경
    private String title;
    private String content;
    private LocalDateTime created_at; // createdAt -> created_at으로 변경

    // Getter & Setter
    public int getNotice_id() { return notice_id; } // noticeId -> notice_id로 변경
    public void setNotice_id(int notice_id) { this.notice_id = notice_id; } // noticeId -> notice_id으로 변경

    public String getTitle() { return title; }
    public void setTitle(String title) { this.title = title; }

    public String getContent() { return content; }
    public void setContent(String content) { this.content = content; }

    public LocalDateTime getCreated_at() { return created_at; } // createdAt -> created_at으로 변경
    public void setCreated_at(LocalDateTime created_at) { this.created_at = created_at; } // createdAt -> created_at으로 변경
}