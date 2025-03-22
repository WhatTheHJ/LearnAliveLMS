package com.lms.attendance.model;

import lombok.AllArgsConstructor;
import lombok.Data;
import lombok.NoArgsConstructor;

@Data
@AllArgsConstructor
@NoArgsConstructor
public class Professor {
    private String prof_id;      // 교수 ID
    private String adminId;      // 관리자의 ID (외래 키)
    private String name;         // 교수 이름
    private String department;   // 교수 학과
    private String email;
    private String password;
    private String phone;
    private String university;
}