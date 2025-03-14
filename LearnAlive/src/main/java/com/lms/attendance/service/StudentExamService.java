package com.lms.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.StudentExam;
import com.lms.attendance.repository.StudentExamMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentExamService {

    private final StudentExamMapper studentExamMapper;

    // 📌 시험 문제 조회
    public List<StudentExam.ExamQuestion> getExamQuestions(int examId) {
        return studentExamMapper.findQuestionsByExamId(examId);
    }

    // 📌 시험 제출 & 자동 채점
    @Transactional
    public void submitExam(int examId, String studentId, List<StudentExam.ExamAnswer> answers) {
        // 1. 시험 제출 정보 저장
        StudentExam.ExamSubmission submission = new StudentExam.ExamSubmission();
        submission.setExamId(examId);
        submission.setStudentId(studentId);
        studentExamMapper.insertExamSubmission(submission);

        // 2. 학생 답안 저장
        for (StudentExam.ExamAnswer answer : answers) {
            answer.setSubmissionId(submission.getSubmissionId());
            studentExamMapper.insertExamAnswer(answer);
        }

        // 3. 자동 채점 (객관식 문제)
        studentExamMapper.autoGradeAnswers(submission.getSubmissionId());

        // 4. 점수 업데이트
        studentExamMapper.updateScore(submission.getSubmissionId());
    }

    // 📌 시험 점수 조회
    public Integer getExamScore(int submissionId) {
        return studentExamMapper.getScore(submissionId);
    }
}
