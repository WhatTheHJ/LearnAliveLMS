package com.lms.attendance.model;

import lombok.Data;

@Data
public class MyPage {
	private String userId;
	private String role;
    private String name;
    private String university;
    private String department;
    private String email;
    private String phone;
    private String password;

}