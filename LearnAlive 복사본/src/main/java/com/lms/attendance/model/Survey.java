package com.lms.attendance.model;

import java.time.LocalDateTime;
import java.util.List;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import lombok.Singular;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Survey {
    private int surveyId;
    private int boardId;
    private String title;
    private String startTime;
    private String endTime;

    private LocalDateTime createdAt;  // ✅ 추가
    private LocalDateTime updatedAt;  // ✅ 추가

    @Singular
    private List<SurveyQuestion> questions; // ✅ 설문 질문을 포함하여 저장할 수 있도록 설정
}
