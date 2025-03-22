package com.lms.attendance.service;

import java.util.List;
import org.springframework.stereotype.Service;
import com.lms.attendance.model.ExamScore;
import com.lms.attendance.repository.ExamScoreMapper;

@Service
public class ExamScoreService {
    private final ExamScoreMapper examScoreMapper;
    
    public ExamScoreService(ExamScoreMapper examScoreMapper) {
        this.examScoreMapper = examScoreMapper;
    }
    
    public List<ExamScore> getExamScoresByClassId(int classId) {
        return examScoreMapper.findExamScoresByClassId(classId);
    }
    
    public void updateExamScore(int classId, String studentId, Double score, String grade) {
        examScoreMapper.updateExamScore(classId, studentId, score, grade);
    }
    
    public void addExamScore(ExamScore examScore) {
        examScoreMapper.insertExamScore(examScore);
    }
}