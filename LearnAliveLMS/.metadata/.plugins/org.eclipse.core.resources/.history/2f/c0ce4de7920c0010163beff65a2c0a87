package com.lms.attendance.controller;

import java.util.List;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.Student;
import com.lms.attendance.model.StudentClassRequest;
import com.lms.attendance.service.StudentService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {
    private final StudentService studentService;

    // ✅ 수강생 등록
    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student newStudent) {
        studentService.registerStudent(newStudent);
        return ResponseEntity.ok("수강생 등록 완료");
    }

    // ✅ 특정 강의실의 모든 학생 조회
    @GetMapping("/class/{classId}")  //  `{}` 중괄호로 감싸서 명확하게 지정
    public ResponseEntity<List<Student>> getStudentsByClass(@PathVariable("classId") int classId) {
        List<Student> students = studentService.getStudentsByClass(classId);
        return ResponseEntity.ok(students);
    }
    
    @PutMapping("/{studentId}")
    public ResponseEntity<?> updateStudent(
            @PathVariable("studentId") String studentId,
            @RequestBody Student updatedStudent) {
        studentService.updateStudent(studentId, updatedStudent);
        return ResponseEntity.ok("수강생 정보 업데이트 성공");
    }
    
    // 수강생 삭제
    @DeleteMapping("/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable("studentId") String studentId) {
        studentService.deleteStudent(studentId);
        return ResponseEntity.ok("수강생 삭제 완료");
    }
    
    //수강생 검색
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam("keyword") String keyword) {
        List<Student> students = studentService.searchStudents(keyword);
        return ResponseEntity.ok(students);
    }

    @PostMapping("/register-to-class")
    public ResponseEntity<?> registerStudentToClass(@RequestBody StudentClassRequest request) {
        studentService.registerStudentToClass(request.getStudentId(), request.getClassId(), request.getRemarks());
        return ResponseEntity.ok("강의실 수강 등록 완료");
    }
    
    @GetMapping("/auth/student/{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable("studentId") String studentId) {
        Student student = studentService.findStudentById(studentId);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(student);
    }
}
