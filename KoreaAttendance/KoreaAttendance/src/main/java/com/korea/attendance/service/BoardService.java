package com.korea.attendance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.korea.attendance.model.Board;
import com.korea.attendance.model.Post;
import com.korea.attendance.repository.BoardMapper;
import com.korea.attendance.repository.PostMapper;

@Service
public class BoardService {
	
	private final BoardMapper boardMapper; 
	
	@Autowired  // Spring이 자동으로 주입
    public BoardService(BoardMapper boardMapper) {
        this.boardMapper = boardMapper;
    }
	
	
	public void createBoard(Board newboard) { 
		boardMapper.createBoard(newboard); 
    }
	
	public void deleteBoardByBoardId(int boardId) { //게시글 삭제
		boardMapper.deleteBoardByBoardId(boardId);
	}
	
	public List<Board> getAllBoards(int classId) {
        return boardMapper.getAllBoard(classId);
    }
	
	
	 

}
