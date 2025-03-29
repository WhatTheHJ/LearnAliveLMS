package com.lms.attendance.repository;

import com.lms.attendance.model.ExamAnswer;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ExamAnswerMapper {

    // 1. 답안 저장
    @Insert("INSERT INTO Exam_Answer (submission_id, question_id, answer, is_correct) " +
            "VALUES (#{submissionId}, #{questionId}, #{answer}, #{isCorrect})")
    void insertExamAnswer(ExamAnswer answer);

    // 2. 답안 목록 조회 (특정 제출에 대한 모든 답안)
    @Select("SELECT * FROM Exam_Answer WHERE submission_id = #{submissionId}")
    @Results({
        @Result(property = "answerId", column = "answer_id"),
        @Result(property = "submissionId", column = "submission_id"),
        @Result(property = "questionId", column = "question_id"),
        @Result(property = "answers", column = "answers"),
        @Result(property = "isCorrect", column = "is_correct")
    })
    List<ExamAnswer> getExamAnswersBySubmissionId(int submissionId);

    // 3. 특정 학생의 답안 조회 (시험 ID와 학생 ID로 답안 조회)
    @Select("SELECT * FROM Exam_Answer WHERE submission_id IN (SELECT submission_id FROM Exam_Submission " +
            "WHERE exam_id = #{examId} AND student_id = #{studentId})")
    @Results({
        @Result(property = "answerId", column = "answer_id"),
        @Result(property = "submissionId", column = "submission_id"),
        @Result(property = "questionId", column = "question_id"),
        @Result(property = "answers", column = "answers"),
        @Result(property = "isCorrect", column = "is_correct")
    })
    List<ExamAnswer> getExamAnswersByStudent(@Param("examId") int examId, @Param("studentId") String studentId);

    // 4. 답안 업데이트 (정답 여부 등)
    @Update("UPDATE Exam_Answer SET is_correct = #{isCorrect} WHERE answer_id = #{answerId}")
    void updateExamAnswer(ExamAnswer answer);
}