package com.lms.attendance.model;

import lombok.Data;

@Data
public class Course {
    private int classId;
    private String className;
    private int credit;
    private String professor;
    private String dayOfWeek; // 콤마(,)로 구분된 요일 문자열
    private String registrationStart;
    private String registrationEnd;
    private String startTime;
    private String endTime;
    private int capacity;
    private int remainingSeats;
}