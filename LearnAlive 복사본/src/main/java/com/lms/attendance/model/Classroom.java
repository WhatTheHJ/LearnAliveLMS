package com.lms.attendance.model;

import lombok.Data;

@Data
public class Classroom {
    private Integer classId;
    private String className;
    private String profId;
    
    // 강의 설명
    private String description;
}
