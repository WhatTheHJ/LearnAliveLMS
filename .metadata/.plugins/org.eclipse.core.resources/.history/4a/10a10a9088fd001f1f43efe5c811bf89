package com.lms.attendance.repository;

import java.util.List;


import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lms.attendance.model.Board;



public interface BoardMapper {
	
	//수동으로 생성하는 게시판은 is_default값이 1이 되도록
	@Insert("""
	        INSERT INTO board (board_id, class_id, board_name, board_type, is_default)
	        VALUES (#{boardId}, #{classId}, #{boardName}, #{boardType}, 1)
	    """)
	    void createBoard(Board newboard);
	
	@Delete("DELETE FROM board WHERE board_id = #{boardId}")
    void deleteBoardByBoardId(int boardId);
	
	
	@Results({
	    @Result(property = "boardId", column = "board_id"),
	    @Result(property = "classId", column = "class_id"),
	    @Result(property = "boardName", column = "board_name"),
	    @Result(property = "isDefault", column = "is_default"),
	    @Result(property = "boardType", column = "board_type")
	})
	@Select("SELECT * FROM board WHERE class_id = #{classId}")
	List<Board> getAllBoard(@Param("classId") int classId);

}
