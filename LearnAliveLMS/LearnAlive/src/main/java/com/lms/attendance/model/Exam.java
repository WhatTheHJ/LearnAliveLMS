package com.lms.attendance.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
@AllArgsConstructor
public class Exam {
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
    private Integer score;
    
    private List<ExamQuestion> questions; // 질문들을 포함하는 리스트
    
    // questions를 설정할 때 questionCount 자동 업데이트
    public void setQuestions(List<ExamQuestion> questions) {
        this.questions = questions;
        this.questionCount = (questions != null) ? questions.size() : 0;  // 문항 수 계산하여 설정
    }

}