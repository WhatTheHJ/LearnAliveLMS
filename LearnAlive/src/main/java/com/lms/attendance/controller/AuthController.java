package com.lms.attendance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.LoginRequest;
import com.lms.attendance.model.Student;
import com.lms.attendance.repository.AuthMapper;
import com.lms.attendance.service.AuthService;
import com.lms.attendance.service.StudentService;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final StudentService studentService;
    private final AuthMapper authMapper;
    
    public AuthController(AuthService authService, StudentService studentService, AuthMapper authMapper) {
        this.authService = authService;
        this.studentService = studentService;
        this.authMapper = authMapper;
    
    }

 // ✅ 학습자(학생) 회원가입
    @PostMapping("/register/student")
    public ResponseEntity<?> registerStudent(@RequestBody Student student) {
    	System.out.println("회원가입 요청 받은 학생 정보: " + student);
        try {
            studentService.registerStudent(student);
            return ResponseEntity.ok(Map.of("success", true, "message", "학생 회원가입 성공!"));
        } catch (Exception e) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "학생 회원가입 실패!"));
        }
    }

  //학습자 학번 중복확인
    @PostMapping("/checkStudentId")
    public ResponseEntity<?> checkStudentId(@RequestBody Map<String, String> request) {
        String studentId = request.get("studentId");
        if (studentId == null || studentId.trim().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "학번을 입력하세요."));
        }
        // StudentService의 findStudentById 메서드를 사용하여 중복 확인
        Student existingStudent = studentService.findStudentById(studentId);
        boolean available = (existingStudent == null);
        return ResponseEntity.ok(Map.of("available", available));
    }
    
    
    
    // ✅ 통합 로그인 (학생, 교수, 관리자)
    @PostMapping("/login")
    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
        System.out.println("로그인 시도 userId: " + request.getUserId());
        String userId = request.getUserId();
        String password = request.getPassword();

        // ✅ 관리자 로그인 처리
        if ("admin".equalsIgnoreCase(userId)) {
            String adminPassword = authService.getAdminPasswordById(userId);
            if (adminPassword == null || !authService.isPasswordValid(password, adminPassword)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "잘못된 관리자 비밀번호입니다."));
            }

            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "로그인 성공",
                    "role", "ADMIN",
                    "username", "관리자",
                    "userId", userId,
                    "classIds", List.of()  // 관리자에겐 classId 없음
            ));
        }

        // ✅ 일반 사용자 로그인
        String role = authService.authenticate(userId, password);
        if (role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "잘못된 ID 또는 비밀번호입니다."));
        }

//        String name = authService.getUserNameByIdAndRole(userId, role);

        List<Integer> classIds = authMapper.findClassIdByUserId(userId);  // ✅ 학생/교수 모두 포함
        System.out.println("📘 로그인한 사용자의 강의실 목록: " + classIds);
        // 사용자 이름 조회 (관리자는 이름 없음)
        String name = "ADMIN".equalsIgnoreCase(role) ? null : authService.getUserNameByIdAndRole(request.getUserId(), role);

        // 역할 한글 변환
        String roleInKorean = switch (role.toLowerCase()) {
            case "ADMIN" -> "관리자";
            case "PROFESSOR" -> "교수자";
            case "STUDENT" -> "학생";
            default -> "알 수 없음";
        };

        // 로그인 성공 응답
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "로그인 성공",
                "role", role,
                "username", name,
                "classId", classIds  ,
                "userId", request.getUserId()     // userId 추가
        ));
    }
}