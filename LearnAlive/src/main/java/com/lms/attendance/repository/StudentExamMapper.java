package com.lms.attendance.repository;

import org.apache.ibatis.annotations.Mapper;

import com.lms.attendance.model.StudentExam;

import java.util.List;

import org.apache.ibatis.annotations.*;

@Mapper
public interface StudentExamMapper {

    // 📌 시험 제출 관련
    @Insert("INSERT INTO Exam_Submission (exam_id, student_id, submitted_at, score) VALUES (#{examId}, #{studentId}, NOW(), NULL)")
    @Options(useGeneratedKeys = true, keyProperty = "submissionId")
    void insertExamSubmission(StudentExam.ExamSubmission submission);

    @Select("SELECT * FROM Exam_Submission WHERE student_id = #{studentId} AND exam_id = #{examId}")
    StudentExam.ExamSubmission findExamSubmission(@Param("studentId") String studentId, @Param("examId") int examId);

    // 📌 시험 문제 조회
    @Select("SELECT * FROM Exam_Question WHERE exam_id = #{examId}")
    List<StudentExam.ExamQuestion> findQuestionsByExamId(int examId);

    // 📌 학생 답변 저장
    @Insert("INSERT INTO Exam_Answer (submission_id, question_id, answer) VALUES (#{submissionId}, #{questionId}, #{answer})")
    void insertExamAnswer(StudentExam.ExamAnswer answer);

    // 📌 자동 채점 (객관식 문제)
    @Update("""
        UPDATE Exam_Answer a
        JOIN Exam_Question q ON a.question_id = q.question_id
        SET a.is_correct = CASE 
            WHEN q.question_type = 'multiple_choice' AND a.answer = q.correct_answer THEN true
            ELSE false 
        END
        WHERE a.submission_id = #{submissionId}
    """)
    void autoGradeAnswers(int submissionId);

    // 📌 채점된 점수 업데이트
    @Update("""
        UPDATE Exam_Submission
        SET score = (SELECT COUNT(*) FROM Exam_Answer WHERE submission_id = #{submissionId} AND is_correct = true)
        WHERE submission_id = #{submissionId}
    """)
    void updateScore(int submissionId);

    // 📌 제출된 시험 점수 조회
    @Select("SELECT score FROM Exam_Submission WHERE submission_id = #{submissionId}")
    Integer getScore(int submissionId);
}

