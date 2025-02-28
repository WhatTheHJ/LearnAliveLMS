package com.korea.attendance.controller;

import java.util.List;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.korea.attendance.model.Board;
import com.korea.attendance.service.BoardService;

@RestController
@RequestMapping("/api/boards")
public class BoardController {
	private final BoardService boardService;
	private static final Logger logger = LoggerFactory.getLogger(ClassController.class);
	
    
	public BoardController(BoardService boardService) {
        this.boardService = boardService;
    }

    @GetMapping("/{classId}")
    public List<Board> getAllBoard(@PathVariable("classId") int classId) {
    	 logger.info("📌 [DEBUG] 게시판 목록 조회 요청 도착: classId={}", classId);

    	    List<Board> boards = boardService.getAllBoards(classId);

    	    logger.info("📌 [DEBUG] 반환되는 게시판 목록: {}", boards);
        return boards;
    }
	

}
