//package com.lms.attendance.controller;
//
//import org.springframework.beans.factory.annotation.Autowired;
//import org.springframework.http.ResponseEntity;
//import org.springframework.stereotype.Controller;
//import org.springframework.ui.Model;
//import org.springframework.web.bind.annotation.GetMapping;
//import org.springframework.web.bind.annotation.PathVariable;
//import org.springframework.web.bind.annotation.PostMapping;
//import org.springframework.web.bind.annotation.RequestMapping;
//import org.springframework.web.bind.annotation.RestController;
//
//import com.lms.attendance.model.Post;
//import com.lms.attendance.service.PostService;
//
//import java.util.List;
//
//@RestController
//@RequestMapping("/api/posts")
//public class PostController {
//    private final PostService postService;
//
//    @Autowired
//    public PostController(PostService postService) {
//        this.postService = postService;
//    }
//
//    // 게시글 목록 조회
//    @GetMapping("/{boardId}/post")
//    public ResponseEntity<List<Post>> getAllPosts(@PathVariable("boardId") int boardId) {
//        List<Post> posts = postService.getAllPosts(boardId); // boardId에 맞는 게시글 목록 조회
//        return ResponseEntity.ok(posts); // JSON 형식으로 응답
//    }
//
//
//    // 게시글 추가 페이지
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
//}









package com.lms.attendance.controller;

import org.slf4j.Logger;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
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
    @GetMapping("/{boardId}/post")
    public ResponseEntity<List<Post>> getAllPosts(@PathVariable("boardId") int boardId) {
        List<Post> posts = postService.getAllPosts(boardId); // boardId에 맞는 게시글 목록 조회
        // ✅ 서버에서 데이터 확인
        for (Post post : posts) {
            System.out.println("게시글 정보: " + post.getPostId() + ", authorId: " + post.getAuthorId());
        }
        return ResponseEntity.ok(posts); // JSON 형식으로 응답
    }
    
    @GetMapping("/{postId}")
    public ResponseEntity<List<Post>> getPostById(@PathVariable("postId") int postId) {
        List<Post> posts = postService.getPostById(postId); // boardId에 맞는 게시글 목록 조회
        return ResponseEntity.ok(posts); // JSON 형식으로 응답
    }

    // 게시글 추가 (REST API 방식)
    @PostMapping("/{boardId}/post/new")
    public ResponseEntity<Post> createPost(@PathVariable("boardId") int boardId, @RequestBody Post post) {
        
    	System.out.println("Author ID: " + post.getAuthorId());
        System.out.println("Author Role: " + post.getAuthorRole());
    	
    	Post createdPost = postService.createPost(boardId, post); // 게시글 생성
        return ResponseEntity.ok(createdPost);
    }
    
    // 게시판 삭제
    @DeleteMapping("/{postId}/delete")
    public ResponseEntity<String> deletePost(@PathVariable("postId") int postId) {
        postService.deletePostByPostId(postId);
        return ResponseEntity.ok("게시글 삭제 성공");
    }
    
    // 특정 게시판(boardId)에서 특정 사용자(userId)가 작성한 게시글 목록 조회
    @GetMapping("/user/{userId}/posts")
    public ResponseEntity<List<Post>> getPostsByUser(
            @PathVariable("userId") int userId
    ) {
        List<Post> posts = postService.getUsersAllPosts(userId);
        return ResponseEntity.ok(posts);
    }
}
//    @DeleteMapping("/{postId}")
//    public ResponseEntity<String> deletePost(@PathVariable("postId") int postId) {
////        Logger.info("📌 [DEBUG] 게시글 삭제 요청 도착: postId={}", postId);
//
//        try {
//            postService.deletePostByPostId(postId);  // 게시판 삭제 서비스 호출
//            return new ResponseEntity<>("게시글이 성공적으로 삭제되었습니다.", HttpStatus.OK);
//        } catch (Exception e) {
////            logger.error("❌ 게시판 삭제 실패: {}", e.getMessage());
//            return new ResponseEntity<>("게시글 삭제 실패", HttpStatus.INTERNAL_SERVER_ERROR);
//        }
//    }

    
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