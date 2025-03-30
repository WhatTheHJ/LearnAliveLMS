package com.lms.attendance.model;

import java.util.List;

import lombok.Data;

@Data
public class ExamResult {
	private Exam exam;
	private ExamSubmission examSubmission;
  private List<ExamAnswer> answers; // 학생이 제출한 답안 목록
public void setExamAnswer(List<ExamAnswer> answers) {
	// TODO Auto-generated method stub
	
}
}