package com.lms.attendance.controller;

import com.lms.attendance.model.Notice;
import com.lms.attendance.service.NoticeService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/notice")
public class NoticeController {

    private final NoticeService noticeService;

    public NoticeController(NoticeService noticeService) {
        this.noticeService = noticeService;
    }

    // 공지사항 전체 목록 조회
    @GetMapping
    public List<Notice> getAllNotices() {
        return noticeService.getAllNotices();
    }

    // 공지사항 생성
    @PostMapping
    public void createNotice(@RequestBody Notice notice) {
        noticeService.createNotice(notice);
    }

    // 공지사항 수정
    @PutMapping("/{notice_id}")
    public void updateNotice(@PathVariable int notice_id, @RequestBody Notice notice) {
        notice.setNotice_id(notice_id);  // notice_id를 noticeId로 설정
        noticeService.updateNotice(notice);
    }

    // 공지사항 삭제
    @DeleteMapping("/{notice_id}")
    public void deleteNotice(@PathVariable int notice_id) {
        noticeService.deleteNotice(notice_id);
    }

    @GetMapping("/{notice_id}")
    public Notice getNoticeById(@PathVariable int notice_id) {
        return noticeService.getNoticeById(notice_id); // 서비스 메서드 호출
    }
}