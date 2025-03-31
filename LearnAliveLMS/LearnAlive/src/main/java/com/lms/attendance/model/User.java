package com.lms.attendance.model;

import lombok.Data;

@Data
public class User {
    private String userId;
    private String name;
    private String role;
    private String password; // 교수자 비밀번호 추가 (학생은 NULL)
    private String phone;
}
