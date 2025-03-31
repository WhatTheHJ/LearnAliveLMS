package com.lms.attendance.repository;

import java.util.List;
import org.apache.ibatis.annotations.*;

import com.lms.attendance.model.Todo;

@Mapper
public interface TodoMapper {

    // 특정 사용자의 투두 리스트 가져오기
    @Select("SELECT * FROM todo_list WHERE user_id = #{userId}")
    @Results({
        @Result(property = "todoId", column = "todo_id"),
        @Result(property = "userId", column = "user_id"),
        @Result(property = "text", column = "text"),
        @Result(property = "completed", column = "completed"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at")
    })
    List<Todo> getTodosByUserId(@Param("userId") String userId);
    
    @Select("SELECT * FROM todo_list WHERE todo_id = #{todoId}")
    Todo findById(@Param("todoId") int todoId);

    // 투두 추가
    @Insert("INSERT INTO todo_list (user_id, text) VALUES (#{userId}, #{text})")
    @Result(property = "userId", column = "user_id")
    @Options(useGeneratedKeys = true, keyProperty = "todoId")
    void insertTodo(Todo todo);

    // 투두 완료 상태 업데이트
    @Update("UPDATE todo_list SET completed = #{completed}, updated_at = CURRENT_TIMESTAMP WHERE todo_id = #{todoId}")
    void updateTodoCompletion(@Param("todoId") int todoId, @Param("completed") boolean completed);

    // 특정 투두 삭제
    @Delete("DELETE FROM todo_list WHERE todo_id = #{todoId}")
    void deleteTodo(@Param("todoId") int todoId);

    // 완료된 투두의 개수를 세는 쿼리
    @Select("SELECT COUNT(*) FROM todo_list WHERE completed = true")
    int countCompletedTodos();

    // 완료된 투두 중 가장 오래된 항목 삭제 (완료된 항목이 2개 이상일 때)
    @Delete("DELETE FROM todo_list WHERE completed = true AND todo_id IN (SELECT todo_id FROM (SELECT todo_id FROM todo_list WHERE completed = true ORDER BY updated_at ASC LIMIT 1) AS subquery)")
    void deleteOldestCompletedTodo();
}