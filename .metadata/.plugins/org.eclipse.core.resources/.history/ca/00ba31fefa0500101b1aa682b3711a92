package com.lms.attendance.controller;

import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.MyPage;
import com.lms.attendance.service.MyProfileService;

@RestController
@RequestMapping("/api/mypage")
@CrossOrigin(origins = "http://localhost:5173")
public class MyProfileController {
    private final MyProfileService myProfileService;

    public MyProfileController(MyProfileService myProfileService) {
        this.myProfileService = myProfileService;
    }

    @GetMapping("/user/{userId}/{role}")
    public ResponseEntity<MyPage> getUser(@PathVariable String userId, @PathVariable String role) {
        MyPage myPage = myProfileService.getUserById(userId, role);
        return myPage != null ? ResponseEntity.ok(myPage) : ResponseEntity.notFound().build();
    }

    @PostMapping("/update-user")
    public ResponseEntity<MyPage> updateUser(@RequestBody MyPage myPage) {
        MyPage updatedUser = myProfileService.updateUser(myPage);
        return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.badRequest().build();
    }
    
    // 비밀번호 변경
    @PostMapping("/update-password")
    public ResponseEntity<String> updatePassword(@RequestBody UpdatePasswordRequest request) {
        boolean isUpdated = myProfileService.updatePassword(request.getUserId(), request.getNewPassword());
        if (isUpdated) {
            return ResponseEntity.ok("비밀번호가 변경되었습니다.");
        } else {
            return ResponseEntity.badRequest().body("비밀번호 변경에 실패했습니다.");
        }
    }
    
    // 강의실 리스트를 가져오는 API 추가
    @GetMapping("/classes/{classId}")
    public ResponseEntity<List<String>> getClassByClassId(@PathVariable String classId) {
        List<String> classes = myProfileService.getClassByClassId(classId);
        return classes != null ? ResponseEntity.ok(classes) : ResponseEntity.notFound().build();
    }
}