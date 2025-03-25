package com.lms.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.*;

import com.lms.attendance.model.Exam;
import com.lms.attendance.model.ExamQuestion;
import com.lms.attendance.model.ExamWithScore;
import com.lms.attendance.model.StudentExamResult;



@Mapper
public interface ExamMapper {

	//새로운 시험 추가
    @Insert("INSERT INTO Exam (class_id, prof_id, prof_name, title, start_time, end_time, question_count) VALUES (#{classId}, #{profId}, #{profName}, #{title}, #{startTime}, #{endTime}, #{questionCount})")
    @Options(useGeneratedKeys = true, keyProperty = "examId")
    void createExam(Exam exam);

    // 특정 클래스의 시험 목록 가져오기
    @Select("SELECT e.*, es.score " +
            "FROM Exam e " +
            "LEFT JOIN Exam_Submission es " +
            "ON e.exam_id = es.exam_id AND es.student_id = #{studentId} " + // 특정 학생의 점수만 조회
            "WHERE e.class_id = #{classId}") // 강의실 ID 기준으로 시험 목록 가져오기
    @Results({
         @Result(property = "examId", column = "exam_id"),
         @Result(property = "classId", column = "class_id"),
         @Result(property = "profId", column = "prof_id"),
         @Result(property = "profName", column = "prof_name"),
         @Result(property = "title", column = "title"),
         @Result(property = "startTime", column = "start_time"),
         @Result(property = "endTime", column = "end_time"),
         @Result(property = "createdAt", column = "created_at"),
         @Result(property = "updatedAt", column = "updated_at"),
         @Result(property = "questionCount", column = "question_count"),
         @Result(property = "score", column = "score")  // 특정 학생의 점수 표시
    })
    List<ExamWithScore> findByClassIdAndStudentId(@Param("classId") int classId, @Param("studentId") String studentId);

	
    
    //특정 시험 상세 보기
    @Select("SELECT * FROM Exam WHERE exam_id = #{examId}")
    @Results({
        @Result(property = "examId", column = "exam_id"),
        @Result(property = "classId", column = "class_id"),
        @Result(property = "profId", column = "prof_id"),
        @Result(property = "profName", column = "prof_name"), 
        @Result(property = "title", column = "title"),
        @Result(property = "startTime", column = "start_time"),
        @Result(property = "endTime", column = "end_time"),
        @Result(property = "createdAt", column = "created_at"),
        @Result(property = "updatedAt", column = "updated_at"),
        @Result(property = "questionCount", column = "question_count")
    })
    Exam getExamById(int examId);
    
    
    //시험 삭제
    @Delete("DELETE FROM Exam WHERE exam_id = #{examId}")
    void deleteExam(int examId);

    
    //시험 수정
    @Update("UPDATE Exam SET title = #{title}, prof_name = #{profName}, start_time = #{startTime}, end_time = #{endTime} WHERE exam_id = #{examId}")
    void updateExam(Exam exam);

   
    
    //  전체 시험 목록 가져오기
    @Select("SELECT * FROM Exam")
    List<Exam> findAll();
    
    
    @Insert("INSERT INTO Exam_Question (exam_id, question_text, question_type, correct_answer) VALUES (#{examId}, #{questionText}, #{questionType}, #{correctAnswer})")
    void createExamQuestion(ExamQuestion question); // 문제 저장

    
    
    // examId 기준으로 모든 학생의 시험 결과 조회
     @Select("SELECT es.submission_id AS submissionId, es.exam_id AS examId, es.student_id AS studentId, " +
            "es.submitted_at AS submittedAt, es.score, s.name " +
            "FROM exam_submission es " +
            "JOIN student s ON es.student_id = s.student_id " +
            "WHERE es.exam_id = #{examId}")
     List<StudentExamResult> findExamResultsByExamId(int examId);
}
