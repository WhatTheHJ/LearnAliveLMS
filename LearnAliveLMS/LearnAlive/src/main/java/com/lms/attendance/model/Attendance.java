package com.lms.attendance.model;

import lombok.Data;
import java.sql.Timestamp;
import java.time.LocalDate;

import com.fasterxml.jackson.annotation.JsonFormat;

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
    private String university;  // 단과대학
    private String department;  // 학과
    private String remarks;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private String createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private String updatedAt;
}
