package com.lms.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.*;

import com.lms.attendance.model.Exam;
import com.lms.attendance.model.ExamQuestion;



@Mapper
public interface ExamMapper {

    @Insert("INSERT INTO Exam (class_id, title, start_time, end_time) VALUES (#{classId}, #{title}, #{startTime}, #{endTime})")
    @Options(useGeneratedKeys = true, keyProperty = "examId")
    void createExam(Exam exam);

    @Delete("DELETE FROM Exam WHERE exam_id = #{examId}")
    void deleteExam(int examId);

    @Update("UPDATE Exam SET title = #{title}, start_time = #{startTime}, end_time = #{endTime} WHERE exam_id = #{examId}")
    void updateExam(Exam exam);

    @Select("SELECT * FROM Exam WHERE exam_id = #{examId}")
    Exam getExamById(int examId);
    
    @Select("SELECT * FROM Exam")
    List<Exam> findAll(); //  전체 시험 목록 가져오
    
    @Insert("INSERT INTO Exam_Question (exam_id, question_text, question_type, correct_answer) VALUES (#{examId}, #{questionText}, #{questionType}, #{correctAnswer})")
    void createExamQuestion(ExamQuestion question); // 문제 저장

	
}

