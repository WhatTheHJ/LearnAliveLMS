package com.korea.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.korea.attendance.model.Board;
import com.korea.attendance.model.Post;


public interface BoardMapper {
	
	@Insert("""
	        INSERT INTO board (board_id, class_id, board_name, board_type)
	        VALUES (#{boardId}, #{classId}, #{boardName}, #{boardType})
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
