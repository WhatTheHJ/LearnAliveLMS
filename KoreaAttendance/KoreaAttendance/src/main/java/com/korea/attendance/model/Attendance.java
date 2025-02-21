package com.korea.attendance.model;

import lombok.Data;
import java.sql.Timestamp;
import java.time.LocalDate;

@Data
public class Attendance {
    private int attendanceId;
    private String studentId; // ✅ 기존 student_id가 아니라 studentId로 선언해야 함
    private String name;
    private int classId;
    private String className;
    private String date;
    private String state;
    private String reason;
    private String createdAt;
    private String updatedAt;
    private String university;  // 단과대학
    private String department;  // 학과
}
