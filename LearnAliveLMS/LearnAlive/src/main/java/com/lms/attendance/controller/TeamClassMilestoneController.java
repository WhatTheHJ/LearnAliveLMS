//// ClassMilestoneController.java
//package com.lms.attendance.controller;
//
//import java.util.List;
//import java.util.Map;
//
//import org.springframework.http.ResponseEntity;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestBody;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.lms.attendance.model.TeamClassMilestone;
//import com.lms.attendance.service.TeamClassMilestoneService;
//
//@RestController
//@RequestMapping("/api/class-milestones")
//public class TeamClassMilestoneController {
//
//    private final TeamClassMilestoneService classMilestoneService;
//
//    public TeamClassMilestoneController(TeamClassMilestoneService classMilestoneService) {
//        this.classMilestoneService = classMilestoneService;
//    }
//
//    // 교수용: 특정 강의실(classId)에 공통 마일스톤 등록
//    @PostMapping("/{classId}")
//    public ResponseEntity<String> createClassMilestones(
//            @PathVariable int classId,
//            @RequestBody Map<String, List<Map<String, Object>>> requestBody) {
//
//        List<Map<String, Object>> milestonesData = requestBody.get("milestones");
//        if(milestonesData == null || milestonesData.isEmpty()){
//            return ResponseEntity.badRequest().body("마일스톤 데이터가 없습니다.");
//        }
//        try {
//            classMilestoneService.createMilestones(classId, milestonesData);
//            return ResponseEntity.ok("공통 마일스톤이 성공적으로 저장되었습니다.");
//        } catch(Exception e) {
//            e.printStackTrace();
//            return ResponseEntity.status(500).body("서버 오류 발생");
//        }
//    }
//    
// // TeamClassMilestoneController.java
//    @GetMapping("/{classId}")
//    public ResponseEntity<List<TeamClassMilestone>> getClassMilestones(@PathVariable int classId) {
//        List<TeamClassMilestone> milestones = classMilestoneService.getClassMilestones(classId);
//        return ResponseEntity.ok(milestones);
//    }
//
//
//    
//    // 학생/팀원용: 특정 강의실(classId)와 게시글(postId)에 대해 공통 마일스톤과 진행 상태 조인 조회
//    @GetMapping("/{classId}/posts/{postId}")
//    public ResponseEntity<List<Map<String, Object>>> getMilestonesForPost(
//            @PathVariable int classId,
//            @PathVariable int postId) {
//        List<Map<String, Object>> milestones = classMilestoneService.getMilestonesForPost(classId, postId);
//        return ResponseEntity.ok(milestones);
//    }
//}



package com.lms.attendance.controller;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import com.lms.attendance.model.TeamClassMilestone;
import com.lms.attendance.service.TeamClassMilestoneService;

@RestController
@RequestMapping("/api/class-milestones")
public class TeamClassMilestoneController {

    private final TeamClassMilestoneService classMilestoneService;

    public TeamClassMilestoneController(TeamClassMilestoneService classMilestoneService) {
        this.classMilestoneService = classMilestoneService;
    }

    // 교수용: 특정 강의실(classId)에 공통 마일스톤 등록
    @PostMapping("/{classId}")
    public ResponseEntity<String> createClassMilestones(
            @PathVariable int classId,
            @RequestBody Map<String, List<Map<String, Object>>> requestBody) {

        List<Map<String, Object>> milestonesData = requestBody.get("milestones");
        if(milestonesData == null || milestonesData.isEmpty()){
            return ResponseEntity.badRequest().body("마일스톤 데이터가 없습니다.");
        }
        try {
            classMilestoneService.createMilestones(classId, milestonesData);
            return ResponseEntity.ok("공통 마일스톤이 성공적으로 저장되었습니다.");
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류 발생");
        }
    }
    
    @GetMapping("/{classId}")
    public ResponseEntity<List<TeamClassMilestone>> getClassMilestones(@PathVariable int classId) {
        List<TeamClassMilestone> milestones = classMilestoneService.getClassMilestones(classId);
        return ResponseEntity.ok(milestones);
    }
    
    // 학생/팀원용: 특정 강의실(classId)와 게시글(postId)에 대해 공통 마일스톤과 진행 상태 조인 조회
    @GetMapping("/{classId}/posts/{postId}")
    public ResponseEntity<List<Map<String, Object>>> getMilestonesForPost(
            @PathVariable int classId,
            @PathVariable int postId) {
        List<Map<String, Object>> milestones = classMilestoneService.getMilestonesForPost(classId, postId);
        return ResponseEntity.ok(milestones);
    }
    
    // 업데이트 엔드포인트: 특정 마일스톤 수정 (PUT)
    @PutMapping("/{milestoneId}")
    public ResponseEntity<String> updateClassMilestone(
         @PathVariable int milestoneId,
         @RequestBody Map<String, Object> milestoneData) {
         try {
             // milestoneData에서 title, dueDate 추출
             String title = (String) milestoneData.get("title");
             String dueDateStr = (String) milestoneData.get("dueDate");
             // dueDate 문자열을 LocalDateTime으로 변환 (필요시 replace(" ", "T") 사용)
             LocalDateTime dueDate = LocalDateTime.parse(dueDateStr.replace(" ", "T"));
             
             classMilestoneService.updateMilestone(milestoneId, title, dueDate);
             return ResponseEntity.ok("마일스톤이 성공적으로 업데이트되었습니다.");
         } catch(Exception e) {
             e.printStackTrace();
             return ResponseEntity.status(500).body("서버 오류 발생");
         }
    }
    
    
    @DeleteMapping("/{milestoneId}")
    public ResponseEntity<String> deleteClassMilestone(@PathVariable int milestoneId) {
        try {
            classMilestoneService.deleteMilestone(milestoneId);
            return ResponseEntity.ok("마일스톤이 삭제되었습니다.");
        } catch(Exception e) {
            e.printStackTrace();
            return ResponseEntity.status(500).body("서버 오류 발생");
        }
    }
    
}
