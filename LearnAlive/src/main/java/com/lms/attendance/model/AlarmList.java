package com.lms.attendance.model;

import java.time.LocalDateTime;

import com.fasterxml.jackson.annotation.JsonFormat;

import lombok.Data;

@Data
public class AlarmList {
    private int alarmId;
    private String userId;
    private int classId;
    private String type;
    private String title;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private LocalDateTime createdAt;
    private boolean isRead;
}
