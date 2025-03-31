package com.lms.attendance.controller;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class WebController {

    @GetMapping({"/", "/classroom/**"})  // ✅ React의 모든 라우트를 서빙
    public String forwardReact() {
        return "forward:/index.html";
    }
}
