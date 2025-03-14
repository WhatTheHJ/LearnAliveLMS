package com.lms.attendance.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class StudentExam {

    // 시험 제출 정보
    @Data
    public static class ExamSubmission {
        private int submissionId;
        private int examId;
        private String studentId;
        private LocalDateTime submittedAt;
        private Integer score; // 자동 채점된 점수
    }

    // 시험 문제 정보
    @Data
    public static class ExamQuestion {
        private int questionId;
        private int examId;
        private String questionText;
        private String questionType; // "multiple_choice" 또는 "short_answer"
        private String correctAnswer; // 객관식일 경우 정답
    }

    // 학생 답변 정보
    @Data
    public static class ExamAnswer {
        private int answerId;
        private int submissionId;
        private int questionId;
        private String answer;
        private Boolean isCorrect; // 객관식일 경우 정답 여부
    }
}
