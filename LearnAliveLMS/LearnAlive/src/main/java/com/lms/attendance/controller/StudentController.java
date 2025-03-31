//package com.lms.attendance.controller;
//
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.DeleteMapping;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.PutMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RequestParam;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.lms.attendance.model.Student;
//import com.lms.attendance.model.StudentClassRequest;
//import com.lms.attendance.service.StudentService;
//
//import lombok.RequiredArgsConstructor;
//
//@RestController
//@RequestMapping("/api/students")
//@RequiredArgsConstructor
//public class StudentController {
//    private final StudentService studentService;
//
//    // ✅ 수강생 등록
//    @PostMapping("/register")
//    public ResponseEntity<?> registerStudent(@RequestBody Student newStudent) {
//        studentService.registerStudent(newStudent);
//        return ResponseEntity.ok("수강생 등록 완료");
//    }
//
//    // ✅ 특정 강의실의 모든 학생 조회
//    @GetMapping("/class/{classId}")  //  `{}` 중괄호로 감싸서 명확하게 지정
//    public ResponseEntity<List<Student>> getStudentsByClass(@PathVariable("classId") int classId) {
//        List<Student> students = studentService.getStudentsByClass(classId);
//        return ResponseEntity.ok(students);
//    }
//    
//    @PutMapping("/{studentId}")
//    public ResponseEntity<?> updateStudent(
//            @PathVariable("studentId") String studentId,
//            @RequestBody Student updatedStudent) {
//        studentService.updateStudent(studentId, updatedStudent);
//        return ResponseEntity.ok("수강생 정보 업데이트 성공");
//    }
//    
//    // 수강생 삭제
//    @DeleteMapping("/{studentId}")
//    public ResponseEntity<?> deleteStudent(@PathVariable("studentId") String studentId) {
//        studentService.deleteStudent(studentId);
//        return ResponseEntity.ok("수강생 삭제 완료");
//    }
//    
//    //수강생 검색
//    @GetMapping("/search")
//    public ResponseEntity<List<Student>> searchStudents(@RequestParam("keyword") String keyword) {
//        List<Student> students = studentService.searchStudents(keyword);
//        return ResponseEntity.ok(students);
//    }
//
//    @PostMapping("/register-to-class")
//    public ResponseEntity<?> registerStudentToClass(@RequestBody StudentClassRequest request) {
//        studentService.registerStudentToClass(request.getStudentId(), request.getClassId(), request.getRemarks());
//        return ResponseEntity.ok("강의실 수강 등록 완료");
//    }
//    
//    @GetMapping("/auth/student/{studentId}")
//    public ResponseEntity<Student> getStudentById(@PathVariable("studentId") String studentId) {
//        Student student = studentService.findStudentById(studentId);
//        if (student == null) {
//            return ResponseEntity.notFound().build();
//        }
//        return ResponseEntity.ok(student);
//    }
//
//    
//    
//    
//    
// // ✅ 수강생 아이디 찾기 엔드포인트
//    @PostMapping("/find-id")
//    public ResponseEntity<?> findStudentId(@RequestBody Map<String, String> request) {
//        String name = request.get("name");
//        String email = request.get("email");
//        
//        // studentService에 findStudentByNameAndEmail 메서드 구현 필요
//        Student student = studentService.findStudentByNameAndEmail(name, email);
//        if (student == null) {
//            return ResponseEntity.status(404).body(
//                Map.of("success", false, "message", "해당 정보와 일치하는 ID가 없습니다.")
//            );
//        }
//        return ResponseEntity.ok(
//            Map.of("success", true, "userId", student.getStudentId())  // getStudentId()는 학생 ID를 반환하는 메서드라고 가정
//        );
//    }
//    
//    // ✅ 수강생 비밀번호 재설정 엔드포인트
//    @PostMapping("/reset-password")
//    public ResponseEntity<?> resetStudentPassword(@RequestBody Map<String, String> request) {
//        String studentId = request.get("studentId"); // userId 대신 studentId로 받는게 좋습니다.
//        String name = request.get("name");
//        String phone = request.get("phone");
//        String newPassword = request.get("newPassword");
//
//        if (studentId == null || name == null || phone == null || newPassword == null ||
//            studentId.isEmpty() || name.isEmpty() || phone.isEmpty() || newPassword.isEmpty()) {
//            return ResponseEntity.badRequest()
//                    .body(Map.of("success", false, "message", "모든 정보를 입력해주세요."));
//        }
//        
//        Student student = studentService.findByIdAndNameAndPhone(studentId, name, phone);
//        if (student == null) {
//            return ResponseEntity.status(404)
//                    .body(Map.of("success", false, "message", "일치하는 정보를 찾을 수 없습니다."));
//        }
//        
//        // updateStudent 대신 updateStudentPassword를 호출해야 비밀번호가 업데이트됩니다.
//        studentService.updateStudentPassword(studentId, newPassword);
//        
//        return ResponseEntity.ok(
//                Map.of("success", true, "message", "비밀번호가 성공적으로 재설정되었습니다."));
//    }
//}
//    



package com.lms.attendance.controller;

import com.lms.attendance.model.Student;
import com.lms.attendance.model.StudentClassRequest;
import com.lms.attendance.service.StudentService;
import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.security.core.context.SecurityContextHolder;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import java.util.Map;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/students")
@RequiredArgsConstructor
public class StudentController {

    private final StudentService studentService;

    // ✅ 수강생 등록 (관리자만)
    @PostMapping("/register")
    public ResponseEntity<?> registerStudent(@RequestBody Student newStudent) {
        if (!isAdmin()) {
            return ResponseEntity.status(403).body("관리자만 등록할 수 있습니다.");
        }
        studentService.registerStudent(newStudent);
        return ResponseEntity.ok("수강생 등록 완료");
    }

    // ✅ 특정 강의실의 모든 학생 조회 (교수자 이상)
    @GetMapping("/class/{classId}")
    public ResponseEntity<List<Student>> getStudentsByClass(@PathVariable("classId") int classId) {
        if (!isProfessorOrAdmin()) {
            return ResponseEntity.status(403).build();
        }
        List<Student> students = studentService.getStudentsByClass(classId);
        return ResponseEntity.ok(students);
    }

    // ✅ 수강생 수정 (본인 또는 관리자)
    @PutMapping("/{studentId}")
    public ResponseEntity<?> updateStudent(
            @PathVariable("studentId") String studentId,
            @RequestBody Student updatedStudent) {
        if (!isSelfOrAdmin(studentId)) {
            return ResponseEntity.status(403).body("수정 권한이 없습니다.");
        }
        studentService.updateStudent(studentId, updatedStudent);
        return ResponseEntity.ok("수강생 정보 업데이트 성공");
    }

    // ✅ 수강생 삭제 (관리자만)
    @DeleteMapping("/{studentId}")
    public ResponseEntity<?> deleteStudent(@PathVariable("studentId") String studentId) {
        if (!isAdmin()) {
            return ResponseEntity.status(403).body("관리자만 삭제할 수 있습니다.");
        }
        studentService.deleteStudent(studentId);
        return ResponseEntity.ok("수강생 삭제 완료");
    }

    // ✅ 수강생 검색 (교수자 이상)
    @GetMapping("/search")
    public ResponseEntity<List<Student>> searchStudents(@RequestParam("keyword") String keyword) {
        if (!isProfessorOrAdmin()) {
            return ResponseEntity.status(403).build();
        }
        List<Student> students = studentService.searchStudents(keyword);
        return ResponseEntity.ok(students);
    }

    // ✅ 강의실 등록 (학생 본인만)
    @PostMapping("/register-to-class")
    public ResponseEntity<?> registerStudentToClass(@RequestBody StudentClassRequest request) {
        if (!isSelfOrAdmin(request.getStudentId())) {
            return ResponseEntity.status(403).body("본인만 수강 등록이 가능합니다.");
        }
        studentService.registerStudentToClass(request.getStudentId(), request.getClassId(), request.getRemarks());
        return ResponseEntity.ok("강의실 수강 등록 완료");
    }

    // ✅ 학생 정보 조회 (본인 또는 관리자)
    @GetMapping("/auth/student/{studentId}")
    public ResponseEntity<Student> getStudentById(@PathVariable("studentId") String studentId) {
        if (!isSelfOrAdmin(studentId)) {
            return ResponseEntity.status(403).build();
        }
        Student student = studentService.findStudentById(studentId);
        if (student == null) {
            return ResponseEntity.notFound().build();
        }
        return ResponseEntity.ok(student);
    }

    // ✅ 아이디 찾기 (비인증)
    @PostMapping("/find-id")
    public ResponseEntity<?> findStudentId(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");

        Student student = studentService.findStudentByNameAndEmail(name, email);
        if (student == null) {
            return ResponseEntity.status(404)
                    .body(Map.of("success", false, "message", "해당 정보와 일치하는 ID가 없습니다."));
        }
        return ResponseEntity.ok(
                Map.of("success", true, "userId", student.getStudentId()));
    }

    // ✅ 비밀번호 재설정 (비인증)
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetStudentPassword(@RequestBody Map<String, String> request) {
        String studentId = request.get("studentId");
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

        studentService.updateStudentPassword(studentId, newPassword);
        return ResponseEntity.ok(
                Map.of("success", true, "message", "비밀번호가 성공적으로 재설정되었습니다."));
    }

    // ✅ 현재 로그인된 사용자 ID
    private String getCurrentUserId() {
        return (String) SecurityContextHolder.getContext().getAuthentication().getPrincipal();
    }

    // ✅ 현재 로그인된 사용자 ROLE
    private String getCurrentUserRole() {
        return SecurityContextHolder.getContext().getAuthentication()
                .getAuthorities().stream()
                .findFirst()
                .map(Object::toString)
                .orElse("");
    }

    private boolean isStudent() {
        return "ROLE_STUDENT".equalsIgnoreCase(getCurrentUserRole());
    }

    private boolean isAdmin() {
        return "ROLE_ADMIN".equalsIgnoreCase(getCurrentUserRole());
    }

    private boolean isProfessorOrAdmin() {
        String role = getCurrentUserRole();
        return "ROLE_PROFESSOR".equalsIgnoreCase(role) || "ROLE_ADMIN".equalsIgnoreCase(role);
    }

    private boolean isSelfOrAdmin(String studentId) {
        return isAdmin() || getCurrentUserId().equals(studentId);
    }

    @PostConstruct
    public void check() {
        System.out.println("✅✅✅ StudentController Bean 생성 완료 ✅✅✅");
    }
}
