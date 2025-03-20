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
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.http.HttpHeaders;
import org.springframework.http.HttpStatus;
import org.springframework.http.MediaType;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.ModelAttribute;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;
import org.springframework.web.multipart.MultipartFile;

import com.fasterxml.jackson.databind.ObjectMapper;
import com.lms.attendance.model.Post;
import com.lms.attendance.service.LikeService;
import com.lms.attendance.service.PostService;

import jakarta.servlet.http.HttpSession;

import java.io.IOException;
import java.net.MalformedURLException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.Collections;
import java.util.HashMap;
import java.util.List;
import java.util.Map;

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
    public ResponseEntity<?> createPost(@PathVariable("boardId") int boardId, 
                                        @RequestParam(value = "file", required = false) MultipartFile file, 
                                        @RequestParam("post") String postDataJson) throws IOException {
        // JSON 파싱
        ObjectMapper objectMapper = new ObjectMapper();
        Post post = objectMapper.readValue(postDataJson, Post.class);

        // 파일 경로를 설정
        String filePath = null;
        
        if (file != null && !file.isEmpty()) {
            // 파일 이름 설정
            String fileName = System.currentTimeMillis() + "_" + file.getOriginalFilename();
            // 파일이 저장될 경로 (서버의 uploads 폴더에 저장)
            Path uploadPath = Paths.get(System.getProperty("user.home") + "/uploads/");

            // 디렉토리가 없으면 생성
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            // 파일 저장
            Path fileDestination = uploadPath.resolve(fileName);
            file.transferTo(fileDestination.toFile());

            // 파일 경로 저장 (상대 경로로 저장)
            filePath = "/uploads/" + fileName;
        }

        // 파일 경로를 Post 객체에 설정 (파일이 있으면, 없으면 null)
        if (filePath != null) {
            post.setFilePath(filePath);
        }

        // 게시글 생성
        Post createdPost = postService.createPost(boardId, post);
        
        // 게시글 생성 후 응답 반환
        return ResponseEntity.ok(createdPost);
    }

    @GetMapping("/{postId}/download")
    public ResponseEntity<Resource> downloadFile(@PathVariable("postId") int postId) throws MalformedURLException {
        System.out.println("요청된 postId: " + postId); // 로그 찍기

        // 게시글 정보 가져오기
        Post post = postService.getPostById(postId);
        String filePath = post.getFilePath();

        if (filePath != null) {
            // 파일 경로 (시스템의 사용자 홈 디렉토리와 결합하여 절대 경로로 생성)
            Path path = Paths.get(System.getProperty("user.home") + filePath);
            System.out.println("파일 경로: " + path.toString());

            // 파일이 존재하는지 확인
            if (Files.exists(path)) {
                // 파일 리소스를 반환
                Resource resource = new UrlResource(path.toUri());

                // 이미지 파일의 MIME 타입을 설정
                String fileName = path.getFileName().toString();
                String contentType = "application/octet-stream"; // 기본값

                // 파일 확장자에 따라 MIME 타입을 설정
                if (fileName.endsWith(".png")) {
                    contentType = "image/png";
                } else if (fileName.endsWith(".jpg") || fileName.endsWith(".jpeg")) {
                    contentType = "image/jpeg";
                }

                return ResponseEntity.ok()
                        .contentType(MediaType.parseMediaType(contentType))
                        .header(HttpHeaders.CONTENT_DISPOSITION, "attachment; filename=\"" + fileName + "\"")
                        .body(resource);
            } else {
                // 파일을 찾을 수 없는 경우
                return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
            }
        } else {
            // 파일 경로가 없는 경우
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body(null);
        }
    }
    
    // 좋아요 토글 API
    @PostMapping("/{postId}/like")
    public ResponseEntity<Map<String, Object>> toggleLike(@PathVariable("postId") int postId, @RequestParam("userId") String userId) {
        try {
            // 좋아요 처리 후 최신 좋아요 수 반환
            likeService.toggleLike(postId, userId);

            // 최신 좋아요 수를 가져옴
            int totalLikes = likeService.getTotalLikes(postId);

            // 응답 구성
            Map<String, Object> response = new HashMap<>();
            response.put("totalLikes", totalLikes);
            return ResponseEntity.ok(response);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                .body(Collections.singletonMap("error", "좋아요 처리 중 오류가 발생했습니다."));
        }
    }

    @GetMapping("/{postId}/isLiked")
    public ResponseEntity<Boolean> checkIfLiked(@PathVariable("postId") int postId, @RequestParam("userId") String userId) {
        boolean isLiked = likeService.isLiked(postId, userId);
        return ResponseEntity.ok(isLiked);
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