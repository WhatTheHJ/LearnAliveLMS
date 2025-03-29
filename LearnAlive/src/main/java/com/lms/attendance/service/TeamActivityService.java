package com.lms.attendance.service;

import java.time.LocalDateTime;
import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.TeamActivityPost;
import com.lms.attendance.model.TeamActivityApplication;
import com.lms.attendance.model.TeamActivityComment;
import com.lms.attendance.model.ProjectMember;
import com.lms.attendance.model.Student;
import com.lms.attendance.repository.TeamActivityPostMapper;
import com.lms.attendance.repository.TeamActivityApplicationMapper;
import com.lms.attendance.repository.TeamActivityCommentMapper;
import com.lms.attendance.repository.ProjectMemberMapper;

@Service
public class TeamActivityService {
    private final TeamActivityPostMapper postMapper;
    private final TeamActivityApplicationMapper applicationMapper;
    private final TeamActivityCommentMapper commentMapper;
    private final ProjectMemberMapper projectMemberMapper;
    private final StudentService studentService;  // 학생 정보 조회 서비스

    public TeamActivityService(TeamActivityPostMapper postMapper,
                               TeamActivityApplicationMapper applicationMapper,
                               TeamActivityCommentMapper commentMapper,
                               ProjectMemberMapper projectMemberMapper,
                               StudentService studentService) {
        this.postMapper = postMapper;
        this.applicationMapper = applicationMapper;
        this.commentMapper = commentMapper;
        this.projectMemberMapper = projectMemberMapper;
        this.studentService = studentService;
    }

    // 팀 활동 게시글 생성
    @Transactional
    public TeamActivityPost createTeamActivityPost(TeamActivityPost post) {
        postMapper.createPost(post);
        // 삽입 후 DB에 저장된 데이터를 다시 조회하여 반환 (작성일, 작성자 등 기본값 반영)
        return postMapper.getPostById(post.getPostId());
    }

    // 모든 팀 활동 게시글 조회
    public List<TeamActivityPost> getAllTeamActivityPosts() {
        return postMapper.getAllPosts();
    }

    // 특정 팀 활동 게시글 조회
    public TeamActivityPost getTeamActivityPostById(int postId) {
        return postMapper.getPostById(postId);
    }

    // 참가 신청 생성 (학생이 신청)
    @Transactional
    public TeamActivityApplication applyForTeamActivity(TeamActivityApplication application) {
        application.setStatus("PENDING");
        applicationMapper.applyForTeamActivity(application);
        return application;
    }

    // 신청 상태 업데이트 (승인/거절)
    public void updateApplicationStatus(int applicationId, String status) {
        applicationMapper.updateApplicationStatus(applicationId, status);
    }

    // 특정 게시글에 대한 참가 신청 목록 조회
    public List<TeamActivityApplication> getApplicationsByPostId(int postId) {
        return applicationMapper.getApplicationsByPostId(postId);
    }

    public TeamActivityApplication getApplicationById(int applicationId) {
        return applicationMapper.getApplicationById(applicationId);
    }

    // 댓글 추가
    @Transactional
    public TeamActivityComment addComment(TeamActivityComment comment) {
        commentMapper.addComment(comment);
        return comment;
    }

    // 특정 게시글의 댓글 목록 조회
    public List<TeamActivityComment> getCommentsByPostId(int postId) {
        return commentMapper.getCommentsByPostId(postId);
    }
    
    // 추가된 부분: 강의실(classId)별 팀 활동 게시글 목록 조회
    public List<TeamActivityPost> getTeamActivityPostsByClassId(int classId) {
        return postMapper.getPostsByClassId(classId);
    }
    
    @Transactional
    public void deleteTeamActivityPost(int postId) {
        postMapper.deletePost(postId);
    }
    
    @Transactional
    public void updateTeamActivityPostTeamMembers(int postId, List<String> teamMembers) {
        postMapper.updateTeamMembers(postId, teamMembers);
    }
    
    public void updateLikeCount(int postId, int increment) {
        postMapper.updateLikeCount(postId, increment);
    }
    
    // 신청 승인 후 프로젝트 멤버 등록 메서드 추가
    @Transactional
    public void approveApplicationAndAddMember(int applicationId) {
        // 신청 상태를 APPROVED로 업데이트
        applicationMapper.updateApplicationStatus(applicationId, "APPROVED");
        // 신청 정보를 조회
        TeamActivityApplication application = applicationMapper.getApplicationById(applicationId);
        
        // 로그 추가: 신청자의 학번 출력
        System.out.println("신청자 학번: " + application.getApplicantStudentId());
        
        // 학생 정보를 조회 (StudentService에서 전체 정보를 제공한다고 가정)
        Student student = studentService.findStudentById(application.getApplicantStudentId());
        if (student == null) {
            throw new RuntimeException("학생 정보를 찾을 수 없습니다.");
        }
        // 프로젝트 멤버 객체 생성 및 등록
        ProjectMember member = new ProjectMember();
        member.setPostId(application.getPostId());
        member.setStudentId(student.getStudentId());
        member.setName(student.getName());
        member.setDepartment(student.getDepartment());
        member.setEmail(student.getEmail());
        member.setContact(student.getContact());
        member.setApprovedAt(LocalDateTime.now());
        projectMemberMapper.insertProjectMember(member);
    }
    
    // 승인된 프로젝트 멤버 목록 조회
    public List<ProjectMember> getProjectMembersByPostId(int postId) {
        return projectMemberMapper.getProjectMembersWithStudentInfoByPostId(postId);
    }
    
    @Transactional
    public void deleteProjectMember(int memberId) {
        projectMemberMapper.deleteProjectMember(memberId);
    }
}