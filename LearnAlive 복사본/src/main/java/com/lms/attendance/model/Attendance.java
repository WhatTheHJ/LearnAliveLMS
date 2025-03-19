package com.lms.attendance.model;

import lombok.Data;
import java.sql.Timestamp;
import java.time.LocalDate;
import com.fasterxml.jackson.annotation.JsonFormat;

@Data
public class Attendance {
    private int attendanceId;
    private String studentId; 
    private String name;
    private int classId;
    private String className;
    private String date;
    private String state;
    private String reason;
    private String university;
    private String department;
    private String remarks;
    
    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private String createdAt;

    @JsonFormat(shape = JsonFormat.Shape.STRING, pattern = "yyyy-MM-dd HH:mm:ss")
    private String updatedAt;
}
