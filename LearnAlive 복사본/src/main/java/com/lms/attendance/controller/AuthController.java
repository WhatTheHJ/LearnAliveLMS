package com.lms.attendance.controller;

import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.LoginRequest;
import com.lms.attendance.model.User;
import com.lms.attendance.service.AuthService;

@RestController
@RequestMapping("/api/auth")
public class AuthController {

    private final AuthService authService;

    public AuthController(AuthService authService) {
        this.authService = authService;
    }

    //학생 로그인(비밀번호 없음)
    @GetMapping("/{userId}")  // ✅ URL 매핑 수정
    public User getUserRole(@PathVariable("userId") String userId) {
        return authService.findUserById(userId)
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다."));
    }
    
 // ✅ 교수자 로그인 (비밀번호 검증)
    @PostMapping("/professor-login")
    public ResponseEntity<User> loginProfessor(@RequestBody LoginRequest request) {
        User user = authService.loginProfessor(request.getUserId(), request.getPassword());
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }
}










//package com.lms.attendance.controller;
//
//import org.springframework.http.HttpStatus;
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.*;
//
//import com.lms.attendance.model.LoginRequest;
//import com.lms.attendance.service.AuthService;
//
//import java.util.Map;
//
//@RestController
//@RequestMapping("/api/auth")
//public class AuthController {
//
//    private final AuthService authService;
//
//    public AuthController(AuthService authService) {
//        this.authService = authService;
//    }
//
//    // ✅ 통합 로그인 (학생, 교수, 관리자)
//    @PostMapping("/login")
//    public ResponseEntity<?> login(@RequestBody LoginRequest request) {
//        // 관리자 계정에 대해서는 비밀번호 확인을 추가
//        if ("admin".equalsIgnoreCase(request.getUserId())) {
//            // 관리자 계정 비밀번호 확인 (DB에서 가져오기)
//            String adminPassword = authService.getAdminPasswordById(request.getUserId()); // DB에서 비밀번호 가져오기
//
//            // DB에서 비밀번호를 가져오지 못했거나 비밀번호가 일치하지 않으면 로그인 실패
//            if (adminPassword == null || !authService.isPasswordValid(request.getPassword(), adminPassword)) {
//                return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                        .body(Map.of("success", false, "message", "잘못된 관리자 비밀번호입니다."));
//            }
//
//            // 관리자 로그인의 경우 역할을 "ADMIN"으로 설정
//            String role = "ADMIN";
//            String roleInKorean = "관리자";
//            return ResponseEntity.ok(Map.of(
//                    "success", true,
//                    "message", "로그인 성공",
//                    "role", role,
//                    "username", roleInKorean,
//                    "userId", request.getUserId()
//            ));
//        }
//
//        // 일반 사용자 로그인 처리
//        String role = authService.authenticate(request.getUserId(), request.getPassword());
//
//        if (role == null) {
//            return ResponseEntity.status(HttpStatus.UNAUTHORIZED)
//                    .body(Map.of("success", false, "message", "잘못된 ID 또는 비밀번호입니다."));
//        }
//
//        // 사용자 이름 조회 (관리자는 이름 없음)
//        String name = "ADMIN".equalsIgnoreCase(role) ? null : authService.getUserNameByIdAndRole(request.getUserId(), role);
//
//        // 역할 한글 변환
//        String roleInKorean = switch (role) {
//            case "ADMIN" -> "관리자";
//            case "professor" -> "교수자";
//            case "STUDENT" -> "학생";
//            default -> "알 수 없음";
//        };
//
//        // 로그인 성공 응답
//        return ResponseEntity.ok(Map.of(
//                "success", true,
//                "message", "로그인 성공",
//                "role", role,
//                "username", name != null ? name + " (" + roleInKorean + ")" : roleInKorean,
//                "userId", request.getUserId()
//        ));
//    }
//}