package com.lms.attendance.model;

import java.util.List;

import lombok.Data;

@Data
public class Classroom {
    private Integer classId;
    private String className;
    private String profId;
    private Integer credit;
    private Integer capacity;
    private String courseType;
    private Boolean required;

    // 시간 관련 컬럼
    private String startTime;
    private String endTime;
    private String presentStart;
    private String presentEnd;
    private String lateEnd;

    // 다중 선택 리스트로 관리
    private List<String> recommendedGrade;
    private List<String> daysOfWeek;
}
