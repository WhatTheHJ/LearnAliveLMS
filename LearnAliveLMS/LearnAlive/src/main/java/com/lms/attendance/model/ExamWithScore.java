package com.lms.attendance.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class ExamWithScore {
    private int examId;
    private int classId;
    private String profId;
    private String profName;
    private String title;
    private LocalDateTime startTime;
    private LocalDateTime endTime;
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
    private int questionCount;
    private List<ExamQuestion> questions;
    
    private int score; 
  
}