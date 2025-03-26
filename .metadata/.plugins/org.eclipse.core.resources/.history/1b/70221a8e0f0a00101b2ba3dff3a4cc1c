package com.lms.attendance.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.lms.attendance.model.TeamActivityPost;
import com.lms.attendance.model.TeamActivityApplication;
import com.lms.attendance.model.TeamActivityComment;
import com.lms.attendance.repository.TeamActivityPostMapper;
import com.lms.attendance.repository.TeamActivityApplicationMapper;
import com.lms.attendance.repository.TeamActivityCommentMapper;

@Service
public class TeamActivityService {
    private final TeamActivityPostMapper postMapper;
    private final TeamActivityApplicationMapper applicationMapper;
    private final TeamActivityCommentMapper commentMapper;

    public TeamActivityService(TeamActivityPostMapper postMapper,
                               TeamActivityApplicationMapper applicationMapper,
                               TeamActivityCommentMapper commentMapper) {
        this.postMapper = postMapper;
        this.applicationMapper = applicationMapper;
        this.commentMapper = commentMapper;
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
}
