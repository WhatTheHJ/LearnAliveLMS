package com.lms.attendance.model;

import lombok.Data;
import java.math.BigDecimal;

@Data
public class Grade {
    private int gradeId;         // 성적 ID (PK)
    private String studentId;    // 학생 ID
    private int classId;         // 강의 ID
    private BigDecimal grade;    // 성적 (예: 100.00 만점)
    private String createdAt;    // 생성일시
    private String updatedAt;    // 수정일시

    // 조회용: 강의명 (Class 테이블과 조인)
    private String className;
}
