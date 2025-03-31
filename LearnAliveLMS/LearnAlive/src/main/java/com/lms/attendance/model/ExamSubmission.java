package com.lms.attendance.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class ExamSubmission {
    private int submissionId;
    private int examId;
    private String studentId;
    private LocalDateTime submittedAt;
    private int score; // 채점 결과

//    private List<ExamAnswer> answers; // 학생이 제출한 답안 목록
}