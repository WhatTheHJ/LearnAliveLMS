package com.lms.attendance.model;


import lombok.AllArgsConstructor;
import lombok.Data;

@Data
@AllArgsConstructor
public class AlarmMessage {
    private String type; // EXAM, POST, NOTICE, SURVEY
    private String title;

    private String createdAt;
    private int classId;
}