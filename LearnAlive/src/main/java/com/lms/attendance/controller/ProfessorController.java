package com.lms.attendance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestHeader;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.Professor;
import com.lms.attendance.service.ProfessorService;

import jakarta.annotation.PostConstruct;
import lombok.RequiredArgsConstructor;


@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/professors")
@RequiredArgsConstructor
public class ProfessorController {

    private final ProfessorService professorService;
    private final BCryptPasswordEncoder passwordEncoder;  // BCryptPasswordEncoder 추가

    // ✅ 모든 교수 조회 (관리자만 가능)
    @GetMapping
    public ResponseEntity<?> getAllProfessors(@RequestHeader("Authorization") String token) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "관리자만 조회 가능합니다."));
        }
        List<Professor> professors = professorService.getAllProfessors();
        return ResponseEntity.ok(professors);
    }

    // ✅ 교수 등록 (관리자만 가능)
    @PostMapping("/add")  // 이 부분을 /add로 맞춰줍니다.
    public ResponseEntity<?> registerProfessor(@RequestHeader("Authorization") String token, @RequestBody Professor professor) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "관리자만 등록할 수 있습니다."));
        }
        if (professor.getProf_id() == null || professor.getProf_id().isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "교수 ID는 필수 입력값입니다."));
        }
        professorService.saveProfessor(professor);
        return ResponseEntity.ok(Map.of("success", true, "message", "교수 등록 완료"));
    }

    // ✅ 교수 정보 수정 (관리자만 가능)
    @PutMapping("/{prof_id}")
    public ResponseEntity<?> updateProfessor(@RequestHeader("Authorization") String token, 
                                              @PathVariable("prof_id") String prof_id, 
                                              @RequestBody Professor updatedProfessor) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "관리자만 수정할 수 있습니다."));
        }

        // 비밀번호가 있을 경우 처리
        if (updatedProfessor.getPassword() != null && !updatedProfessor.getPassword().isEmpty()) {
            // 비밀번호 암호화 처리 (필요시)
            updatedProfessor.setPassword(passwordEncoder.encode(updatedProfessor.getPassword()));  // 비밀번호 암호화
        }

        professorService.updateProfessor(updatedProfessor);
        return ResponseEntity.ok(Map.of("success", true, "message", "교수 정보 업데이트 성공"));
    }

    // ✅ 교수 삭제 (관리자만 가능)
    @DeleteMapping("/{prof_id}")
    public ResponseEntity<?> deleteProfessor(@RequestHeader("Authorization") String token, 
                                              @PathVariable("prof_id") String prof_id) {
        if (!isAdmin(token)) {
            return ResponseEntity.status(403).body(Map.of("success", false, "message", "관리자만 삭제할 수 있습니다."));
        }
        professorService.deleteProfessor(prof_id);
        return ResponseEntity.ok(Map.of("success", true, "message", "교수 삭제 완료"));
    }
    
    // ✅ ID 찾기
    @PostMapping("/find-id")
    public ResponseEntity<?> findProfessorId(@RequestBody Map<String, String> request) {
        String name = request.get("name");
        String email = request.get("email");

        Professor professor = professorService.findByNameAndEmail(name, email);
        if (professor == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "해당 정보와 일치하는 ID가 없습니다."));
        }

        return ResponseEntity.ok(Map.of("success", true, "userId", professor.getProf_id()));
    }

 // ✅ 비밀번호 재설정 엔드포인트
    @PostMapping("/reset-password")
    public ResponseEntity<?> resetProfessorPassword(@RequestBody Map<String, String> request) {
        String userId = request.get("userId");
        String name = request.get("name");
        String phone = request.get("phone");
        String newPassword = request.get("newPassword");

        // 입력 값 검증
        if (userId == null || name == null || phone == null || newPassword == null ||
            userId.isEmpty() || name.isEmpty() || phone.isEmpty() || newPassword.isEmpty()) {
            return ResponseEntity.badRequest().body(Map.of("success", false, "message", "모든 정보를 입력해주세요."));
        }
        
        // 교수 정보 조회
        Professor professor = professorService.findByIdAndNameAndPhone(userId, name, phone);
        if (professor == null) {
            return ResponseEntity.status(404).body(Map.of("success", false, "message", "일치하는 정보를 찾을 수 없습니다."));
        }
        
        // 새 비밀번호 설정 (평문 상태로 전달)
        professor.setPassword(newPassword);
        professorService.updateProfessor(professor);
        
        return ResponseEntity.ok(Map.of("success", true, "message", "비밀번호가 성공적으로 재설정되었습니다."));
    }


    // JWT 토큰에서 역할 추출하는 메서드 (임시 구현)
    private boolean isAdmin(String token) {
        // 실제 JWT 파싱 코드 구현 필요 (예: JWTDecoder 또는 JwtParser 사용)
        String role = extractRoleFromToken(token);  // JWT에서 역할 정보 추출
        return "admin".equalsIgnoreCase(role);
    }

    // JWT 토큰에서 역할(Role) 추출하는 메서드 (임시 구현)
    private String extractRoleFromToken(String token) {
        // 실제 JWT 토큰 파싱 로직을 여기에 구현해야 합니다.
        // 예시로 "admin"을 리턴
        return "admin"; // TODO: JWT에서 role을 추출하는 로직 구현
    }
    @PostConstruct
    public void check() {
        System.out.println("✅✅✅ ProfessorController Bean 생성 완료 ✅✅✅");
    }
}