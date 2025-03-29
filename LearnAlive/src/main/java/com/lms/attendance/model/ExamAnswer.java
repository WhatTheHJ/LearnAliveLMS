package com.lms.attendance.model;

import lombok.Data;

@Data
public class ExamAnswer {
    private int answerId;
    private int submissionId;
    private int questionId;
    private String studentId;
    private int examId;
    private int answer;
    private Boolean isCorrect; // 정답 여부

}