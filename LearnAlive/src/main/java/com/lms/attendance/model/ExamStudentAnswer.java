package com.lms.attendance.model;

import java.util.List;

import lombok.Data;

@Data
public class ExamStudentAnswer {
	private int examId;
	private String studentId;
	private List<Integer> answers; 
	
}