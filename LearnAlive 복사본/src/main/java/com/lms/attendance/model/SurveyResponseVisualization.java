package com.lms.attendance.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data  // ✅ getter, setter, toString, equals, hashCode 자동 생성
@NoArgsConstructor  // ✅ 기본 생성자 자동 생성
@AllArgsConstructor // ✅ 모든 필드를 포함한 생성자 자동 생성
public class SurveyResponseVisualization {
    private int surveyId;         // 설문조사 ID
    private int questionId;       // 질문 ID
    private String questionText;  // 질문 내용
    private String questionType;  // 질문 유형 (radio, checkbox, text, linear_scale)
    private String response;      // 응답 내용 (문자열)
    private String studentId;     // 응답한 학생의 학번 (서술형 질문에서 필요)
    private String name;          // 응답한 학생의 이름 (서술형 질문에서 필요)
}
