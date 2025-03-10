package com.lms.attendance.controller;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.Post;
import com.lms.attendance.service.PostService;

import java.util.List;

@CrossOrigin(origins = "http://localhost:5173")
@RestController
@RequestMapping("/api/posts")
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 게시글 목록 조회
 // 게시글 목록 조회
    @GetMapping("/{boardId}/post")
    public ResponseEntity<List<Post>> getAllPosts(@PathVariable("boardId") int boardId) {
        List<Post> posts = postService.getAllPosts(boardId); // boardId에 맞는 게시글 목록 조회
        return ResponseEntity.ok(posts); // JSON 형식으로 응답
    }

    // 게시글 추가 페이지
    // 게시글 추가 (REST API 방식)
    @PostMapping("/{boardId}/post/new")
    public ResponseEntity<Post> createPost(@PathVariable("boardId") int boardId, @RequestBody Post post) {
        
    	System.out.println("Author ID: " + post.getAuthorId());
        System.out.println("Author Role: " + post.getAuthorRole());
    	
    	Post createdPost = postService.createPost(boardId, post); // 게시글 생성
        return ResponseEntity.ok(createdPost);
    }

    
//    @PostMapping()
    
//    @GetMapping("/{boardId}/post/new")
//    public String showCreatePostForm() {
//    	return "create-post.html";
//    }
//
//    @PostMapping("/{boardId}/post/new")
//    public String createPost(Post post) {
//        postService.createPost(post); // 게시글 생성
//        return "create-post.html"; // 게시글 목록 페이지로 리디렉션
//    }

}
