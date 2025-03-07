package com.lms.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.Exam;
import com.lms.attendance.repository.ExamMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class ExamService {
    private final ExamMapper examMapper;

    @Transactional
    public void createExam(Exam exam) {
        System.out.println("시험 데이터 저장 전: " + exam);  // 로그 추가
        examMapper.createExam(exam);
        System.out.println("시험 데이터 저장 후: " + exam);  // 저장 후 로그 추가
    }
    
    

    public void deleteExam(int examId) {
        examMapper.deleteExam(examId);
    }

    @Transactional
    public void updateExam(Exam exam) {
        examMapper.updateExam(exam);
    }
    
    public Exam getExamById(int examId) {
        return examMapper.getExamById(examId);
    }



	public List<Exam> getAllExams() {
		return examMapper.findAll();
	}
}

