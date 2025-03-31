package com.lms.attendance.model;

import lombok.Data;

@Data
public class AlarmList {
    private int alarmId;
    private String userId;
    private int classId;
    private String type;
    private String title;
    private String createdAt;
    private boolean isRead;
}