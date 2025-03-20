package com.lms.attendance.repository;

import com.lms.attendance.model.ExamAnswer;
import com.lms.attendance.model.ExamQuestion;
import com.lms.attendance.model.ExamSubmission;
import java.util.List;

import org.apache.ibatis.annotations.*;

@Mapper
public interface ExamSubmissionMapper {

    // 1. 시험 제출 정보 저장 
    @Insert("INSERT INTO Exam_Submission (exam_id, student_id, submitted_at) VALUES (#{examId}, #{studentId}, #{submittedAt})")
    @Options(useGeneratedKeys = true, keyProperty = "submissionId")
    void insertExamSubmission(ExamSubmission submission);

    // 2. 학생 답변 저장
    @Insert("INSERT INTO Exam_Answer (submission_id, question_id, student_id, exam_id, answer, is_correct) VALUES (#{submissionId}, #{questionId}, #{studentId}, #{examId}, #{answer}, #{isCorrect})")
    void insertExamAnswer(ExamAnswer answer);

    // 3. 정답 조회
//    @Select("SELECT correct_answer FROM Exam_Question WHERE question_id = #{questionId}")
//    int getCorrectAnswer(int questionId);
    
    @Select("SELECT * FROM Exam_Question WHERE exam_id = #{examId} ORDER BY question_id ASC")
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
    List<ExamQuestion> getCorrectAnswer(int examId);

    // 4. 최종 점수 업데이트
    @Update("UPDATE Exam_Submission SET score = #{score} WHERE submission_id = #{submissionId}")
    void updateExamScore(ExamSubmission submission);

    
    
    
    
    // 5. 학생 시험 제출 내역 조회
    @Select("SELECT * FROM Exam_Submission WHERE exam_id = #{examId} AND student_id = #{studentId}")
    @Results({
        @Result(property = "submissionId", column = "submission_id"),
        @Result(property = "examId", column = "exam_id"),
        @Result(property = "studentId", column = "student_id"),
        @Result(property = "submittedAt", column = "submitted_at"),
        @Result(property = "score", column = "score")
    })
    ExamSubmission getStudentSubmission(@Param("examId") int examId, @Param("studentId") String studentId);
    
    
 // 학생 답변 조회
    @Select("SELECT * from Exam_Answer WHERE student_id = #{studentId} AND exam_id = #{examId};")
    @Results({
        @Result(property = "answerId", column = "answer_id"),
        @Result(property = "submissionId", column = "submission_id"),
        @Result(property = "questionId", column = "question_id"),
        @Result(property = "studentId", column = "student_id"),
        @Result(property = "examId", column = "exam_id"),
        @Result(property = "answer", column = "answer"),
        @Result(property = "isCorrect", column = "is_correct")
    })
    List<ExamAnswer> getStudentAnswer(@Param("examId") int examId, @Param("studentId") String studentId);
}