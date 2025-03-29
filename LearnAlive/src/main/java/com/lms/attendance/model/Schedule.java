package com.lms.attendance.model;

import java.time.LocalDate;
import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Schedule {
	private int  scheduleId ; // PK
	private String  userId; // 게시판 ID (Foreign Key)
	private LocalDate date;
	private String title;
	private String content;
	  private String color;
	  
	private boolean mark; // 0: 알람 없음, 1: 알람 있음
	private LocalDateTime createdAt;
	private LocalDateTime updatedAt;
	private LocalDateTime alarmTime; 
}