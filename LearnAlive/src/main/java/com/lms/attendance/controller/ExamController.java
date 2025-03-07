package com.lms.attendance.controller;

import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.Exam;
import com.lms.attendance.service.ExamService;

import lombok.RequiredArgsConstructor;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;



@RestController
@RequestMapping(value= "/api/professor/exams", consumes = "application/json")
@RequiredArgsConstructor
public class ExamController {
    private final ExamService examService;

    /** 시험 생성 API */
    @PostMapping
    public ResponseEntity<String> createExam(@RequestBody Exam exam) {
    	System.out.println("시험 데이터: " + exam); // 전송 데이터 확인
        examService.createExam(exam);
        return ResponseEntity.ok("시험이 성공적으로 생성되었습니다.");
    }
    
    /** 시험 목록 가져오기 */
    @GetMapping
    public ResponseEntity<List<Exam>> getExams() {
        List<Exam> exams = examService.getAllExams();  // 시험 목록을 가져오는 서비스 메서드
        return ResponseEntity.ok(exams);
    }
    
    @DeleteMapping("/{examId}")
    public ResponseEntity<Void> deleteExam(@PathVariable int examId) {
        examService.deleteExam(examId);
        return ResponseEntity.ok().build();
    }

    @PutMapping("/{examId}")
    public ResponseEntity<Void> updateExam(@PathVariable int examId, @RequestBody Exam exam) {
        exam.setExamId(examId);
        examService.updateExam(exam);
        return ResponseEntity.ok().build();
    }

    @GetMapping("/{examId}")
    public ResponseEntity<Exam> getExam(@PathVariable int examId) {
        return ResponseEntity.ok(examService.getExamById(examId));
    }
}
