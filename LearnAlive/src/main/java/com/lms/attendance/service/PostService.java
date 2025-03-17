package com.lms.attendance.service;

import java.util.Arrays;
import java.util.HashSet;
import java.util.List;
import java.util.Optional;
import java.util.Set;

import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.Post;
import com.lms.attendance.repository.PostMapper;

@Service
public class PostService {
	private final PostMapper postMapper; 
	@Autowired  // Spring이 자동으로 PostMapper를 주입
    public PostService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }
	
	@Transactional //트랜잭션 단위로 실행?
	public Post getPostById(int postId) {
        postMapper.increaseViewCount(postId); // 조회수 증가
        return postMapper.getPostById(postId); // 게시글 조회
	}
	 
        
	public Post createPost(int boardId, Post newPost) { //게시글 작성
		 newPost.setBoardId(boardId); // 게시글에 boardId 설정
        postMapper.createPost(newPost); 
        return newPost;
    }
	
	public void deletePostByPostId(int postid) { //게시글 삭제
		postMapper.deletePostByPostId(postid);
	}
	
	public Post updatePost(int postid, Post updatedPost) { //게시글 수정
        postMapper.updatePost(
            postid,
            updatedPost.getTitle(),
            updatedPost.getContent()
//            updatedPost.getAuthor()
        );
		return updatedPost;
	}
        //boardid에 맞는 게시글 가져오기
        public List<Post> getAllPosts(int boardId) {
            return postMapper.getAllPosts(boardId);
        }
       
       
        
        //게시글 제목으로 조회하기
        public List<Post> searchPostsByTitle(String title) {
            return postMapper.searchPostsByTitle(title);
        }
        
		/*
		 * //좋아요 기능 public Post likePost(int postId, String userId) {
		 * 
		 * Post post = postMapper.getPostById(postId);
		 * 
		 * // 이미 좋아요를 눌렀는지 확인 Set<String> likedByUser = new
		 * HashSet<>(Arrays.asList(Optional.ofNullable(post.getLikedByUser()).orElse("")
		 * .split(","))); if (likedByUser.contains(userId.toString())) { throw new
		 * IllegalStateException("이미 좋아요를 눌렀습니다."); }
		 * 
		 * // 좋아요 추가 likedByUser.add(userId.toString()); post.setLikes(post.getLikes() +
		 * 1); post.setLikedByUser(String.join(",", likedByUser)); // 리스트를 CSV 문자열로 변환
		 * 
		 * // DB 업데이트 postMapper.likePost(post); return post; }
		 */
        
    }
	
	


