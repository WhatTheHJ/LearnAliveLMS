package com.lms.attendance.service;

import com.lms.attendance.model.Exam;
import com.lms.attendance.model.ExamAnswer;
import com.lms.attendance.model.ExamQuestion;
import com.lms.attendance.model.ExamResult;
import com.lms.attendance.model.ExamStudentAnswer;
import com.lms.attendance.model.ExamSubmission;
import com.lms.attendance.repository.ExamSubmissionMapper;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamSubmissionService {
    private final ExamSubmissionMapper examSubmissionMapper;
//    private final ExamMapper examMapper;
//    private final ExamQuestionMapper examQuestionMapper;
    private final ExamService examService;

    // 시험 제출 및 자동 채점
   
    public void submitExam(ExamStudentAnswer examStudentAnswer) {
    	
        // 시험 제출 정보 저장
    	ExamSubmission submission = new ExamSubmission();
    	submission.setExamId(examStudentAnswer.getExamId());
    	submission.setStudentId(examStudentAnswer.getStudentId());
    	submission.setSubmittedAt(LocalDateTime.now());
    	
    	// 교수답안
    	List<ExamQuestion> examQuestionList = examSubmissionMapper.getCorrectAnswer(submission.getExamId());
    	
    	int totalScore = 0;
    	List<Boolean> isCorrectList = new ArrayList<>();
    	
    	for (int i = 0; i < 20; i ++) {
    		// ExamQuestion 객체에서 정답을 가져온다.
    	    Integer correctAnswer = examQuestionList.get(i).getCorrectAnswer(); 

    	    // 학생 답안을 가져온다.
    	    Integer studentAnswer = examStudentAnswer.getAnswers().get(i);
    	    
    	 // 두 값이 같은지 비교 (Integer는 == 대신 equals() 사용)
    	    if (correctAnswer.equals(studentAnswer)) {
    	    	totalScore += 5;
    	    	isCorrectList.add(true);
    	    } else {
    	    	isCorrectList.add(false);
    	    }
    	}
    	
    	submission.setScore(totalScore);
    	
    	examSubmissionMapper.insertExamSubmission(submission);
    	examSubmissionMapper.updateExamScore(submission);
    	
    	ExamSubmission examSubmissionResult = examSubmissionMapper.getStudentSubmission(submission.getExamId(), submission.getStudentId());
    	// 학생이 치른 시험 id 가져오기
    	int needSubmissionId = examSubmissionResult.getSubmissionId();
    	
    	// 학생 답안지 빈공간 생성 (총 20개)
    	List<ExamAnswer> examAnswerList = new ArrayList<>();
    	for (int i = 0; i < 20; i++) {
    	    examAnswerList.add(new ExamAnswer()); // 리스트에 빈 객체 추가
    	}
    	
    	for (int i = 0; i < 20; i ++) {
    		// 교수 답안지를 통해 questionId 주입.
    		examAnswerList.get(i).setSubmissionId(needSubmissionId);
    		examAnswerList.get(i).setQuestionId(examQuestionList.get(i).getQuestionId());
    		examAnswerList.get(i).setAnswer(examStudentAnswer.getAnswers().get(i));
    		examAnswerList.get(i).setIsCorrect(isCorrectList.get(i));
    		examAnswerList.get(i).setStudentId(submission.getStudentId());
    		examAnswerList.get(i).setExamId(submission.getExamId());
    		
    		examSubmissionMapper.insertExamAnswer(examAnswerList.get(i));
    	}
    }

    // 특정 학생의 시험 제출 내역 조회
//    public ExamSubmission getStudentSubmission(int examId, String studentId) {
//        return examSubmissionMapper.getStudentSubmission(examId, studentId);
//    }
    
    public ExamResult getExamResult(int examId, String studentId) {
    	ExamResult examResult = new ExamResult();
    	// 시험 정보 다 들음
    	Exam exam = examService.getExamById(examId);
    	
    	// 학생 시험정보 + 답안 가져오기
    	
    	// 1. 시험정보
    	ExamSubmission examSubmission = examSubmissionMapper.getStudentSubmission(examId, studentId);
    	// 2. 답안들
    	List<ExamAnswer> answers = examSubmissionMapper.getStudentAnswer(examId, studentId);
    	// 최종 객체 만들기
    	examResult.setExam(exam);
    	examResult.setExamSubmission(examSubmission);
    	examResult.setAnswers(answers);
    	return examResult;
    }

    

    
}