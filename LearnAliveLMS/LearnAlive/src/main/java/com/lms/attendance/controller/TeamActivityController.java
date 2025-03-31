package com.lms.attendance.controller;

import com.lms.attendance.model.TeamActivityPost;
import com.lms.attendance.model.TeamActivityApplication;
import com.lms.attendance.model.TeamActivityComment;
import com.lms.attendance.model.ProjectMember;
import com.lms.attendance.service.TeamActivityService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/team-activities")
public class TeamActivityController {

    private final TeamActivityService teamActivityService;

    public TeamActivityController(TeamActivityService teamActivityService) {
        this.teamActivityService = teamActivityService;
    }

    // 팀 활동 게시글 생성
    @PostMapping("/posts")
    public ResponseEntity<TeamActivityPost> createPost(@RequestBody TeamActivityPost post) {
        TeamActivityPost createdPost = teamActivityService.createTeamActivityPost(post);
        return ResponseEntity.ok(createdPost);
    }

    // 팀 활동 게시글 목록 조회
    @GetMapping("/posts")
    public ResponseEntity<List<TeamActivityPost>> getAllPosts() {
        List<TeamActivityPost> posts = teamActivityService.getAllTeamActivityPosts();
        return ResponseEntity.ok(posts);
    }

    // 특정 팀 활동 게시글 조회
    @GetMapping("/posts/{postId}")
    public ResponseEntity<TeamActivityPost> getPost(@PathVariable("postId") int postId) {
        TeamActivityPost post = teamActivityService.getTeamActivityPostById(postId);
        return ResponseEntity.ok(post);
    }

    // 팀 활동 참가 신청 (학생이 참가 신청)
    @PostMapping("/{postId}/apply")
    public ResponseEntity<TeamActivityApplication> applyForTeamActivity(
            @PathVariable("postId") int postId,
            @RequestParam("applicantId") String applicantId) {
        TeamActivityApplication application = new TeamActivityApplication();
        application.setPostId(postId);
        application.setApplicantStudentId(applicantId);
        application.setStatus("PENDING");
        teamActivityService.applyForTeamActivity(application);
        return ResponseEntity.ok(application);
    }

//    // 참가 신청 승인
//    @PutMapping("/applications/{applicationId}/approve")
//    public ResponseEntity<String> approveApplication(@PathVariable("applicationId") int applicationId) {
//        teamActivityService.updateApplicationStatus(applicationId, "APPROVED");
//        return ResponseEntity.ok("참가 신청이 승인되었습니다.");
//    }

    // 참가 신청 거절
    @PutMapping("/applications/{applicationId}/reject")
    public ResponseEntity<String> rejectApplication(@PathVariable("applicationId") int applicationId) {
        teamActivityService.updateApplicationStatus(applicationId, "REJECTED");
        return ResponseEntity.ok("참가 신청이 거절되었습니다.");
    }

    // 특정 게시글의 참가 신청 목록 조회
    @GetMapping("/{postId}/applications")
    public ResponseEntity<List<TeamActivityApplication>> getApplicationsByPost(@PathVariable("postId") int postId) {
        List<TeamActivityApplication> applications = teamActivityService.getApplicationsByPostId(postId);
        return ResponseEntity.ok(applications);
    }

    // 팀 활동 게시글에 댓글 추가
    @PostMapping("/{postId}/comments")
    public ResponseEntity<TeamActivityComment> addComment(
            @PathVariable("postId") int postId,
            @RequestBody TeamActivityComment comment) {
        comment.setPostId(postId);
        teamActivityService.addComment(comment);
        return ResponseEntity.ok(comment);
    }

    // 특정 게시글의 댓글 목록 조회
    @GetMapping("/{postId}/comments")
    public ResponseEntity<List<TeamActivityComment>> getComments(@PathVariable("postId") int postId) {
        List<TeamActivityComment> comments = teamActivityService.getCommentsByPostId(postId);
        return ResponseEntity.ok(comments);
    }
    
    // 추가된 부분: 강의실(classId)별 팀 활동 게시글 목록 조회
    @GetMapping("/posts/class/{classId}")
    public ResponseEntity<List<TeamActivityPost>> getPostsByClassId(@PathVariable("classId") int classId) {
        List<TeamActivityPost> posts = teamActivityService.getTeamActivityPostsByClassId(classId);
        return ResponseEntity.ok(posts);
    }
    
    @DeleteMapping("/posts/{postId}")
    public ResponseEntity<String> deletePost(@PathVariable("postId") int postId) {
        teamActivityService.deleteTeamActivityPost(postId);
        return ResponseEntity.ok("게시글이 삭제되었습니다.");
    }
    
    @PostMapping("/posts/{postId}/attend")
    public ResponseEntity<TeamActivityPost> attendPost(
            @PathVariable("postId") int postId,
            @RequestParam("attendeeId") String attendeeId) {
        TeamActivityPost post = teamActivityService.getTeamActivityPostById(postId);
        List<String> teamMembers = post.getTeamMembers();
        if (!teamMembers.contains(attendeeId)) {
            teamMembers.add(attendeeId);
            teamActivityService.updateTeamActivityPostTeamMembers(postId, teamMembers);
        }
        post = teamActivityService.getTeamActivityPostById(postId);
        return ResponseEntity.ok(post);
    }
    
    @PutMapping("/posts/{postId}/like")
    public ResponseEntity<TeamActivityPost> toggleLike(
          @PathVariable("postId") int postId,
          @RequestParam("increment") int increment) {
        teamActivityService.updateLikeCount(postId, increment);
        TeamActivityPost updatedPost = teamActivityService.getTeamActivityPostById(postId);
        return ResponseEntity.ok(updatedPost);
    }
    
    // 참가 신청 승인 (게시글 작성자 전용)
    @PutMapping("/applications/{applicationId}/approve")
    public ResponseEntity<String> approveApplication(@PathVariable("applicationId") int applicationId) {
        teamActivityService.approveApplicationAndAddMember(applicationId);
        return ResponseEntity.ok("참가 신청이 승인되었고, 프로젝트 멤버로 등록되었습니다.");
    }

    // 승인된 프로젝트 멤버 목록 조회
    @GetMapping("/posts/{postId}/members")
    public ResponseEntity<List<ProjectMember>> getProjectMembers(@PathVariable("postId") int postId) {
        List<ProjectMember> members = teamActivityService.getProjectMembersByPostId(postId);
        return ResponseEntity.ok(members);
    }
    
    @DeleteMapping("/project-members/{memberId}")
    public ResponseEntity<String> deleteProjectMember(@PathVariable("memberId") int memberId) {
        teamActivityService.deleteProjectMember(memberId);
        return ResponseEntity.ok("프로젝트 멤버 삭제 완료");
    }
}