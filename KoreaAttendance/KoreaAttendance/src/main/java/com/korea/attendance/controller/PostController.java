package com.korea.attendance.controller;

import com.korea.attendance.model.Post;
import com.korea.attendance.service.PostService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Controller;
import org.springframework.ui.Model;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PostMapping;

import java.util.List;

@Controller
public class PostController {

    private final PostService postService;

    @Autowired
    public PostController(PostService postService) {
        this.postService = postService;
    }

    // 게시글 목록 조회
    @GetMapping("/post")
    public String getAllPosts(Model model) {
        List<Post> posts = postService.getAllPosts();
        model.addAttribute("posts", posts);
        return "posts";
    }

    // 게시글 추가 페이지
    @GetMapping("post/new")
    public String showCreatePostForm() {
    	return "create-post.html";
    }
    @PostMapping("post/new")
    public String createPost(Post post) {
        postService.createPost(post); // 게시글 생성
        return "create-post.html"; // 게시글 목록 페이지로 리디렉션
    }

}
