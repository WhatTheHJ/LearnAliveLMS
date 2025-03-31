package com.lms.attendance.model;

import lombok.Data;
import lombok.NoArgsConstructor;

	@Data
	@NoArgsConstructor
	public class ExamQuestion {
	    private int questionId;
	    private int examId;
	    private String questionTitle;
	    private String questionText;
	    private int correctAnswer;
	    private String answer1;
	    private String answer2;
	    private String answer3;
	    private String answer4;
	    
	  
}