package com.lms.attendance.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class StudentExamResult {
    private int submissionId;
    private int examId;
    private String studentId;
    private LocalDateTime submittedAt;
    private int score; 
    private String name;  
}