package com.lms.attendance.service;

import java.util.List;


import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lms.attendance.model.Post;
import com.lms.attendance.repository.PostMapper;

@Service
public class PostService {
	private final PostMapper postMapper; 
	@Autowired  // Spring이 자동으로 PostMapper를 주입
    public PostService(PostMapper postMapper) {
        this.postMapper = postMapper;
    }
	
	public void createPost(Post newPost) { //게시글 작성
        postMapper.createPost(newPost); 
    }
	
	public void deletePostByPostId(int postid) { //게시글 삭제
		postMapper.deletePostByPostId(postid);
	}
	
	public void updatePost(int postid, Post updatedPost) { //게시글 수정
        postMapper.updatePost(
            postid,
            updatedPost.getTitle(),
            updatedPost.getContent(),
            updatedPost.getAuthor()
        );
	}
        //boardid에 맞는 게시글 가져오기
        public List<Post> getAllPosts(int boardId) {
            return postMapper.getAllPosts(boardId);
        }
        
        //게시글 제목으로 조회하기
        public List<Post> searchPostsByTitle(String title) {
            return postMapper.searchPostsByTitle(title);
        }
        
    }
	
	


