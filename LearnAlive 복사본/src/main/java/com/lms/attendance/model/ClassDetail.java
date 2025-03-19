package com.lms.attendance.model;

import lombok.Data;

@Data
public class ClassDetail {
    private int classId;
    private String className;
    private String profId;
    private String professorName;
    private String professorEmail;
    
    // 새로 추가된 필드: 강의별 점수와 등급
    private Double score;    // 강의별 점수
    private String grade;    // 등급
}
