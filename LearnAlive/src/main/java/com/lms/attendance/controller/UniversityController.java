package com.lms.attendance.controller;

import java.util.List;
import java.util.Map;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import com.lms.attendance.model.University;
import com.lms.attendance.model.Department;
import com.lms.attendance.service.UniversityService;
import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/admin")
@RequiredArgsConstructor
public class UniversityController {

    private final UniversityService universityService;

    // 대학 추가
    @PostMapping("/university")
    public ResponseEntity<?> addUniversity(@RequestBody University university) {
        try {
            // 입력 데이터 확인 로그
            System.out.println("Received University: " + university);
            universityService.addUniversity(university);
            return ResponseEntity.ok(Map.of("success", true, "message", "대학 추가 성공"));
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "대학 추가 실패: " + e.getMessage()));
        }
    }

    // 대학 수정
    @PutMapping("/university")
    public ResponseEntity<?> updateUniversity(@RequestBody University university) {
        try {
            universityService.updateUniversity(university);
            return ResponseEntity.ok(Map.of("success", true, "message", "대학 수정 성공"));
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "대학 수정 실패: " + e.getMessage()));
        }
    }

    // 대학 삭제
    @DeleteMapping("/university/{universityId}")
    public ResponseEntity<?> deleteUniversity(@PathVariable Integer universityId) {
        try {
            universityService.deleteUniversity(universityId);
            return ResponseEntity.ok(Map.of("success", true, "message", "대학 삭제 성공"));
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "대학 삭제 실패: " + e.getMessage()));
        }
    }

    // 대학 목록 조회
    @GetMapping("/universities")
    public ResponseEntity<?> getUniversities() {
        try {
            List<University> universities = universityService.getUniversities();
            return ResponseEntity.ok(universities);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "대학 목록 조회 실패: " + e.getMessage()));
        }
    }

    // 학과 추가
    @PostMapping("/department")
    public ResponseEntity<?> addDepartment(@RequestBody Department department) {
        try {
            universityService.addDepartment(department);
            return ResponseEntity.ok(Map.of("success", true, "message", "학과 추가 성공"));
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "학과 추가 실패: " + e.getMessage()));
        }
    }

    // 학과 수정
    @PutMapping("/department")
    public ResponseEntity<?> updateDepartment(@RequestBody Department department) {
        try {
            universityService.updateDepartment(department);
            return ResponseEntity.ok(Map.of("success", true, "message", "학과 수정 성공"));
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "학과 수정 실패: " + e.getMessage()));
        }
    }

    // 학과 삭제
    @DeleteMapping("/department/{departmentId}")
    public ResponseEntity<?> deleteDepartment(@PathVariable Integer departmentId) {
        try {
            universityService.deleteDepartment(departmentId);
            return ResponseEntity.ok(Map.of("success", true, "message", "학과 삭제 성공"));
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "학과 삭제 실패: " + e.getMessage()));
        }
    }

    // 학과 목록 조회
    @GetMapping("/departments")
    public ResponseEntity<?> getDepartments() {
        try {
            List<Department> departments = universityService.getDepartments();
            return ResponseEntity.ok(departments);
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "학과 목록 조회 실패: " + e.getMessage()));
        }
    }
}