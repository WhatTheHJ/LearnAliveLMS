package com.lms.attendance.controller;

import java.util.List;
import java.util.Map;

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

    
    
    
    
 // ✅ 수강생 아이디 찾기 엔드포인트
    @PostMapping("/find-id")
    public ResponseEntity<?> findStudentId(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");
        
        // studentService에 findStudentByNameAndEmail 메서드 구현 필요
        Student student = studentService.findStudentByNameAndEmail(name, email);
        if (student == null) {
            return ResponseEntity.status(404).body(
                Map.of("success", false, "message", "해당 정보와 일치하는 ID가 없습니다.")
            );
        }
        return ResponseEntity.ok(
            Map.of("success", true, "userId", student.getStudentId())  // getStudentId()는 학생 ID를 반환하는 메서드라고 가정
        );
    }
    
    // ✅ 수강생 비밀번호 재설정 엔드포인트
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetStudentPassword(@RequestBody Map<String, String> request) {
        String studentId = request.get("studentId"); // userId 대신 studentId로 받는게 좋습니다.
        String name = request.get("name");
        String phone = request.get("phone");
        String newPassword = request.get("newPassword");

        if (studentId == null || name == null || phone == null || newPassword == null ||
            studentId.isEmpty() || name.isEmpty() || phone.isEmpty() || newPassword.isEmpty()) {
            return ResponseEntity.badRequest()
                    .body(Map.of("success", false, "message", "모든 정보를 입력해주세요."));
        }
        
        Student student = studentService.findByIdAndNameAndPhone(studentId, name, phone);
        if (student == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("success", false, "message", "일치하는 정보를 찾을 수 없습니다."));
        }
        
        // updateStudent 대신 updateStudentPassword를 호출해야 비밀번호가 업데이트됩니다.
        studentService.updateStudentPassword(studentId, newPassword);
        
        return ResponseEntity.ok(
                Map.of("success", true, "message", "비밀번호가 성공적으로 재설정되었습니다."));
    }
}
    
