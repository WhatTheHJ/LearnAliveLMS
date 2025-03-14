package com.lms.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.Exam;
import com.lms.attendance.model.ExamQuestion;
import com.lms.attendance.repository.ExamMapper;
import com.lms.attendance.repository.ExamQuestionMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional
public class ExamService {
    private final ExamMapper examMapper;
    private final ExamQuestionMapper examQuestionMapper;  // ExamQuestion을 다룰 Mapper 추가

    // 새로운 시험 추가 (시험과 질문을 함께 저장)
    public void createExam(Exam exam) {
        // 1. 시험 정보 저장
        examMapper.createExam(exam);
        
        // 2. 시험에 속하는 질문들 저장
        for (ExamQuestion  question : exam.getQuestions()) {
        	question.setExamId(exam.getExamId());  // 시험 ID 설정
            examQuestionMapper.createExamQuestion(question);  // 질문 저장
        }
    }
    
    // 특정 클래스의 시험 목록 가져오기
    public List<Exam> getExamsByClassId(int classId) {
        return examMapper.findByClassId(classId);  // 예시: 클래스 ID로 시험 목록을 가져오는 메서드
    }

    // 특정 시험 상세 보기
    public Exam getExamById(int examId) {
        // 시험 정보 가져오기
        Exam exam = examMapper.getExamById(examId);
        
        // 해당 시험에 속하는 질문들 가져오기
        List<ExamQuestion> questions = examQuestionMapper.getQuestionsByExamId(examId);
        exam.setQuestions(questions);  // 시험에 질문 목록 추가
        
        return exam;
    }

    // 시험 삭제
    public void deleteExam(int examId) {
        // 시험에 속한 질문들 삭제
        examQuestionMapper.deleteQuestionsByExamId(examId);
        
        // 시험 삭제
        examMapper.deleteExam(examId);
    }

    // 시험 수정
    public void updateExam(Exam exam) {
        // 시험 정보 수정
        examMapper.updateExam(exam);
        
        // 해당 시험의 기존 질문들 삭제 후 새 질문 저장 (이 부분은 로직에 따라 다를 수 있음)
        examQuestionMapper.deleteQuestionsByExamId(exam.getExamId()); // 기존 질문 삭제
        for (ExamQuestion examQuestion : exam.getQuestions()) {
        	examQuestion.setExamId(exam.getExamId());  // 시험 ID 설정
            examQuestionMapper.createExamQuestion(examQuestion);  // 새 질문 저장
        }
    }
}
