package com.lms.attendance.model;

import lombok.Data;

@Data
public class ClassDetail {
    private int classId;
    private String className;
    private String profId;
    private String professorName;
    private String professorEmail;
    
    // 강의별 점수와 등급
    private Double score;    // 강의별 점수
    private String grade;    // 등급
    
    // 강의 설명
    private String description;
}
