package com.lms.attendance.service;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lms.attendance.repository.LikeMapper;
import com.lms.attendance.repository.PostMapper;

@Service
public class LikeService {

    @Autowired
    private LikeMapper likeMapper;

    @Autowired
    private PostMapper postMapper;

    // 게시글에 좋아요를 추가하거나 제거하는 메서드
    public void toggleLike(int postId, String userId) {
        // 1. 좋아요가 이미 존재하는지 확인
        boolean isLiked = likeMapper.isLiked(postId, userId);

        if (isLiked) {
            // 2. 좋아요가 이미 눌린 상태라면 좋아요를 제거
            likeMapper.removeLike(postId, userId);
            // 3. 게시글의 좋아요 수 감소
            postMapper.decrementLikes(postId);
        } else {
            // 4. 좋아요가 눌리지 않았다면 좋아요 추가
            likeMapper.addLike(postId, userId);
            // 5. 게시글의 좋아요 수 증가
            postMapper.incrementLikes(postId);
        }
    }
    // 게시글에 대한 전체 좋아요 수 가져오기
    public int getTotalLikes(int postId) {
        return postMapper.getTotalLikes(postId);
    }

	public boolean isLiked(int postId, String userId) {
		return likeMapper.isLiked(postId, userId);
	}
}