package com.lms.attendance.repository;

import com.lms.attendance.model.Grade;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface GradeMapper {

    // 학생의 성적과 강의명을 조회 (Class 테이블과 조인)
    @Select("""
        SELECT 
            g.grade_id, 
            g.student_id, 
            g.class_id, 
            g.grade, 
            c.class_name,
            DATE_FORMAT(g.created_at, '%Y-%m-%d %H:%i:%s') AS created_at,
            DATE_FORMAT(g.updated_at, '%Y-%m-%d %H:%i:%s') AS updated_at
        FROM Grade g
        JOIN Class c ON g.class_id = c.class_id
        WHERE g.student_id = #{studentId}
    """)
    List<Grade> findGradesByStudentId(@Param("studentId") String studentId);

    // 성적 추가
    @Insert("""
        INSERT INTO Grade (student_id, class_id, grade, created_at, updated_at)
        VALUES (#{studentId}, #{classId}, #{grade}, NOW(), NOW())
    """)
    @Options(useGeneratedKeys = true, keyProperty = "gradeId")
    void insertGrade(Grade grade);

    // 성적 수정
    @Update("""
        UPDATE Grade
        SET grade = #{grade}, updated_at = NOW()
        WHERE grade_id = #{gradeId}
    """)
    void updateGrade(Grade grade);

    // 성적 삭제
    @Delete("""
        DELETE FROM Grade
        WHERE grade_id = #{gradeId}
    """)
    void deleteGrade(@Param("gradeId") int gradeId);
}