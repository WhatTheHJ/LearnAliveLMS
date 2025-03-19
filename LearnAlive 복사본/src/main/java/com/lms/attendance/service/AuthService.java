package com.lms.attendance.service;

import com.lms.attendance.model.User;
import com.lms.attendance.repository.AuthMapper;

import org.springframework.stereotype.Service;

import java.util.Optional;

@Service
public class AuthService {

    private final AuthMapper authMapper;

    public AuthService(AuthMapper authMapper) {
        this.authMapper = authMapper;
    }

    public Optional<User> findUserById(String userId) {
        return authMapper.findUserById(userId);
    }
    
    // ✅ 교수자 로그인 (비밀번호 검증)
    public User loginProfessor(String userId, String password) {
        User user = authMapper.findProfessorById(userId);
        if (user != null && user.getPassword().equals(password)) {
            return user;
        }
        return null; // 비밀번호 틀림
    }
}







//bcrypt 암호화된거랑 평문 된거까지 넣을 수 있게 만듦

//package com.lms.attendance.service;
//
//import com.lms.attendance.model.User;
//import com.lms.attendance.repository.AuthMapper;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
//import org.springframework.stereotype.Service;
//
//@Service
//public class AuthService {
//
//    private final AuthMapper authMapper;
//    private final BCryptPasswordEncoder passwordEncoder; // BCryptPasswordEncoder 추가
//
//    public AuthService(AuthMapper authMapper, BCryptPasswordEncoder passwordEncoder) {
//        this.authMapper = authMapper;
//        this.passwordEncoder = passwordEncoder;  // BCryptPasswordEncoder 초기화
//    }
//
//    // ✅ 사용자 인증 (학생, 교수, 관리자)
//    public String authenticate(String userId, String password) {
//        User user = authMapper.findUserById(userId);
//        if (user == null) return null; // 사용자가 존재하지 않음
//
//        // 교수자인 경우 비밀번호 검증
//        if ("PROFESSOR".equalsIgnoreCase(user.getRole())) {
//            System.out.println("Stored password: " + user.getPassword());  // 저장된 비밀번호
//            System.out.println("Input password: " + password);  // 입력된 비밀번호
//
//            // 평문과 bcrypt 암호화된 비밀번호 비교
//            if (!isPasswordValid(password, user.getPassword())) {
//                return null; // 비밀번호 틀림
//            }
//        }
//
//        return user.getRole(); // 인증 성공 → 역할 반환
//    }
//
//    // 평문 비밀번호와 bcrypt 암호화된 비밀번호 비교하는 메서드
//    public boolean isPasswordValid(String inputPassword, String storedPassword) {
//        // 만약 저장된 비밀번호가 bcrypt로 암호화된 것이라면 bcrypt 비교
//        if (storedPassword.startsWith("$2a$")) {
//            return passwordEncoder.matches(inputPassword, storedPassword);
//        }
//        // 저장된 비밀번호가 평문이라면 평문 비교
//        return storedPassword.equals(inputPassword);
//    }
//
//    // ✅ 사용자 이름 조회 (학생, 교수, 관리자)
//    public String getUserNameByIdAndRole(String userId, String role) {
//        return authMapper.findUserNameByIdAndRole(userId, role);
//    }
//
//    // ✅ 관리자 비밀번호 조회 (DB에서 admin 비밀번호 가져오기)
//    public String getAdminPasswordById(String adminId) {
//        return authMapper.findAdminPasswordById(adminId); // DB에서 관리자 비밀번호 조회
//    }
//
//    // ✅ 새 사용자 비밀번호 저장 (회원 가입시 bcrypt로 암호화된 비밀번호 저장)
//    public String saveUserPassword(String password) {
//        return passwordEncoder.encode(password); // 비밀번호 암호화
//    }
//}