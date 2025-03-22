package com.lms.attendance.model;

import lombok.Data;

@Data
public class ExamScore {
    private Integer examId;
    private Integer classId;
    private String studentId;
    private Double score;
    private String grade;
    private String studentName;
}