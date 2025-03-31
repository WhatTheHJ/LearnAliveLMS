package com.lms.attendance.model;

import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

import java.sql.Timestamp;

@Getter
@Setter
@NoArgsConstructor
public class SurveyQuestion {
    private int questionId;
    private int surveyId;
    private String questionText;
    private String questionType;
    private String options;  // ✅ MyBatis에서 JSON 형식으로 저장될 필드
    private Integer minSelect;
    private Integer maxSelect;
    private Integer minValue;
    private Integer maxValue;
    private String minLabel; // ✅ 선형 배율 최소 라벨
    private String maxLabel; // ✅ 선형 배율 최대 라벨
    private boolean isRequired; // ✅ 필수 여부 추가
    private Timestamp createdAt; // ✅ 생성일자 추가

    // ✅ 설문 생성 시 사용할 생성자 (질문 유형에 따른 분기처리)
    public SurveyQuestion(int surveyId, String questionText, String questionType, 
                          String options, Integer minSelect, Integer maxSelect,
                          Integer minValue, Integer maxValue, String minLabel, String maxLabel,
                          boolean isRequired, Timestamp createdAt) {  // ✅ createdAt 추가
        this.surveyId = surveyId;
        this.questionText = questionText;
        this.questionType = questionType;
        this.options = (questionType.equals("radio") || questionType.equals("checkbox")) ? options : null;
        this.minSelect = questionType.equals("checkbox") ? minSelect : null;
        this.maxSelect = questionType.equals("checkbox") ? maxSelect : null;
        this.minValue = questionType.equals("linear_scale") ? minValue : null;
        this.maxValue = questionType.equals("linear_scale") ? maxValue : null;
        this.minLabel = questionType.equals("linear_scale") ? minLabel : null;
        this.maxLabel = questionType.equals("linear_scale") ? maxLabel : null;
        this.isRequired = isRequired;  // ✅ 필수 여부 저장
        this.createdAt = createdAt;  // ✅ 생성일자 저장
    }

    // ✅ MyBatis가 인식할 수 있도록 명확한 Getter/Setter 추가
    public boolean getIsRequired() {
        return isRequired;
    }

    public void setIsRequired(boolean isRequired) {
        this.isRequired = isRequired;
    }

    public Timestamp getCreatedAt() {
        return createdAt;
    }

    public void setCreatedAt(Timestamp createdAt) {
        this.createdAt = createdAt;
    }
}
