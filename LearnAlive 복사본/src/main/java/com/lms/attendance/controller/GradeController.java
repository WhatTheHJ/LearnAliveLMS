package com.lms.attendance.controller;

import com.lms.attendance.model.Grade;
import com.lms.attendance.service.GradeService;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.Authentication; // Spring Security 사용
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/grades")
public class GradeController {

    private final GradeService gradeService;

    public GradeController(GradeService gradeService) {
        this.gradeService = gradeService;
    }

    // 기존: 특정 학생(studentId) 성적 조회
    @GetMapping("/student/{studentId}")
    public ResponseEntity<List<Grade>> getGradesByStudent(@PathVariable String studentId) {
        List<Grade> grades = gradeService.getGradesByStudentId(studentId);
        if (grades.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(grades);
    }

    // 새로 추가: 로그인된 학생의 성적 조회 (Authentication 객체 활용)
    @GetMapping("/me")
    public ResponseEntity<List<Grade>> getMyGrades(Authentication authentication) {
        // authentication.getName()에서 로그인된 사용자의 아이디(studentId)를 가져온다고 가정
        String studentId = authentication.getName();
        List<Grade> grades = gradeService.getGradesByStudentId(studentId);
        if (grades.isEmpty()) {
            return ResponseEntity.noContent().build();
        }
        return ResponseEntity.ok(grades);
    }

    // 성적 추가 (예: POST /api/grades)
    @PostMapping("")
    public ResponseEntity<String> addGrade(@RequestBody Grade grade) {
        gradeService.addGrade(grade);
        return ResponseEntity.status(HttpStatus.CREATED).body("성적 추가 완료");
    }

    // 성적 수정 (예: PUT /api/grades/{gradeId})
    @PutMapping("/{gradeId}")
    public ResponseEntity<String> updateGrade(@PathVariable int gradeId, @RequestBody Grade grade) {
        grade.setGradeId(gradeId);
        gradeService.updateGrade(grade);
        return ResponseEntity.ok("성적 업데이트 완료");
    }

    // 성적 삭제 (예: DELETE /api/grades/{gradeId})
    @DeleteMapping("/{gradeId}")
    public ResponseEntity<String> deleteGrade(@PathVariable int gradeId) {
        gradeService.deleteGrade(gradeId);
        return ResponseEntity.ok("성적 삭제 완료");
    }
}
