package com.lms.attendance.repository;

import java.util.List;
import org.apache.ibatis.annotations.*;
import com.lms.attendance.model.ExamScore;

@Mapper
public interface ExamScoreMapper {
	
	@Select("SELECT es.exam_id, s.class_id, s.student_id, es.score, es.grade, s.name as studentName " +
	        "FROM Student s LEFT JOIN exam_score es ON s.student_id = es.student_id AND s.class_id = es.class_id " +
	        "WHERE s.class_id = #{classId}")
	@Results({
	    @Result(property = "examId", column = "exam_id"),
	    @Result(property = "classId", column = "class_id"),
	    @Result(property = "studentId", column = "student_id"),
	    @Result(property = "score", column = "score"),
	    @Result(property = "grade", column = "grade"),
	    @Result(property = "studentName", column = "studentName")
	})
	List<ExamScore> findExamScoresByClassId(@Param("classId") int classId);

    @Insert("INSERT INTO exam_score (class_id, student_id, score, grade) " +
            "VALUES (#{classId}, #{studentId}, #{score}, #{grade})")
    void insertExamScore(ExamScore examScore);

    @Update("UPDATE exam_score SET score = #{score}, grade = #{grade} " +
            "WHERE class_id = #{classId} AND student_id = #{studentId}")
    void updateExamScore(@Param("classId") int classId,
                         @Param("studentId") String studentId,
                         @Param("score") Double score,
                         @Param("grade") String grade);
}