package com.lms.attendance.controller;

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
import com.lms.attendance.service.AuthService;
import com.lms.attendance.service.StudentService;

@CrossOrigin(origins = "http://localhost:5173", allowCredentials = "true")
@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;
    private final StudentService studentService;

    public AuthController(AuthService authService, StudentService studentService) {
        this.authService = authService;
        this.studentService = studentService;
    
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
        // 관리자 계정에 대해서는 비밀번호 확인을 추가
        if ("admin".equalsIgnoreCase(request.getUserId())) {
            // 관리자 계정 비밀번호 확인 (DB에서 가져오기)
            String adminPassword = authService.getAdminPasswordById(request.getUserId()); // DB에서 비밀번호 가져오기

            // DB에서 비밀번호를 가져오지 못했거나 비밀번호가 일치하지 않으면 로그인 실패
            if (adminPassword == null || !authService.isPasswordValid(request.getPassword(), adminPassword)) {
                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                        .body(Map.of("success", false, "message", "잘못된 관리자 비밀번호입니다."));
            }

            // 관리자 로그인의 경우 역할을 "ADMIN"으로 설정
            String role = "admin";
            String roleInKorean = "관리자";
            return ResponseEntity.ok(Map.of(
                    "success", true,
                    "message", "로그인 성공",
                    "role", role,
                    "username", roleInKorean,
                    "userId", request.getUserId()     // userId 추가
            ));
        }

        // 일반 사용자 로그인 처리
        String role = authService.authenticate(request.getUserId(), request.getPassword());

        if (role == null) {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
                    .body(Map.of("success", false, "message", "잘못된 ID 또는 비밀번호입니다."));
        }

        // 사용자 이름 조회 (관리자는 이름 없음)
        String name = "admin".equalsIgnoreCase(role) ? null : authService.getUserNameByIdAndRole(request.getUserId(), role);

        // 역할 한글 변환
        String roleInKorean = switch (role.toLowerCase()) {
            case "admin" -> "관리자";
            case "professor" -> "교수자";
            case "student" -> "학생";
            default -> "알 수 없음";
        };

        // 로그인 성공 응답
        return ResponseEntity.ok(Map.of(
                "success", true,
                "message", "로그인 성공",
                "role", role,
                "username", name,
                "userId", request.getUserId()     // userId 추가
        ));
    }
}