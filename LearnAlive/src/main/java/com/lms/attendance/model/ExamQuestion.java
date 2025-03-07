package com.lms.attendance.model;

import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@NoArgsConstructor
public class ExamQuestion {
    private int questionId;
    private int examId;
    private String questionText;
    private String questionType; // "multiple_choice" | "short_answer"
    private String correctAnswer;
}
