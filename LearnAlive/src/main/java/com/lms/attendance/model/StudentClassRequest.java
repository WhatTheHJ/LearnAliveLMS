package com.lms.attendance.model;

import lombok.Data;

@Data
public class StudentClassRequest {
    private String studentId;
    private int classId;
    private String remarks;  // 재수강, 조교 등 강의실별 특이사항
}
