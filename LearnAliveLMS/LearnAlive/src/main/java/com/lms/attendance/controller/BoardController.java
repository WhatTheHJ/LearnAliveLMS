package com.lms.attendance.controller;

import java.util.List;


import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.Board;
import com.lms.attendance.service.BoardService;


@RestController
@RequestMapping("/api/boards")
public class BoardController {
	private final com.lms.attendance.service.BoardService boardService;
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
    
 // 게시판 추가
    @PostMapping("/{classId}/addBoard")
    public ResponseEntity<String> addBoard(@RequestBody Board board) {
        logger.info("📌 [DEBUG] 게시판 추가 요청 도착: {}", board);

        try {
            boardService.createBoard(board);  // 게시판 추가 서비스 호출
            return new ResponseEntity<>("게시판이 성공적으로 추가되었습니다.", HttpStatus.CREATED);
        } catch (Exception e) {
            logger.error("❌ 게시판 추가 실패: {}", e.getMessage());
            return new ResponseEntity<>("게시판 추가 실패", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 게시판 삭제
    @DeleteMapping("/{boardId}")
    public ResponseEntity<String> deleteBoard(@PathVariable("boardId") int boardId) {
        logger.info("📌 [DEBUG] 게시판 삭제 요청 도착: boardId={}", boardId);

        try {
            boardService.deleteBoardByBoardId(boardId);  // 게시판 삭제 서비스 호출
            return new ResponseEntity<>("게시판이 성공적으로 삭제되었습니다.", HttpStatus.OK);
        } catch (Exception e) {
            logger.error("❌ 게시판 삭제 실패: {}", e.getMessage());
            return new ResponseEntity<>("게시판 삭제 실패", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
}