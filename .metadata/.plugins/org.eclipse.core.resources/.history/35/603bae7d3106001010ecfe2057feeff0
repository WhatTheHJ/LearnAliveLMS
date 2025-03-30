package com.lms.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.*;

import com.lms.attendance.model.ExamQuestion;

@Mapper
public interface ExamQuestionMapper {
    
    // 시험 문제 등록
	@Insert("INSERT INTO Exam_Question (exam_id, question_title, question_text, correct_answer,  answer1, answer2, answer3, answer4) " +
	        "VALUES (#{examId}, #{questionTitle}, #{questionText}, #{correctAnswer}, #{answer1}, #{answer2}, #{answer3}, #{answer4})")
    @Options(useGeneratedKeys = true, keyProperty = "questionId")
    void createExamQuestion(ExamQuestion question);

    // 특정 시험의 문제 목록 조회
    @Select("SELECT * FROM Exam_Question WHERE exam_id = #{examId}")
    @Results({
        @Result(property = "questionId", column = "question_id"),
        @Result(property = "examId", column = "exam_id"),
        @Result(property = "questionTitle", column = "question_title"),
        @Result(property = "questionText", column = "question_text"),
        @Result(property = "correctAnswer", column = "correct_answer"),
        @Result(property = "answer1", column = "answer1"),
        @Result(property = "answer2", column = "answer2"),
        @Result(property = "answer3", column = "answer3"),
        @Result(property = "answer4", column = "answer4")
    })
    List<ExamQuestion> getQuestionsByExamId(@Param("examId") int examId);

    // 특정 시험의 모든 문제 삭제
    @Delete("DELETE FROM Exam_Question WHERE exam_id = #{examId}")
    void deleteQuestionsByExamId(@Param("examId") int examId);
}