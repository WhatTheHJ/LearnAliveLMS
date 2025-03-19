package com.lms.attendance.service;

import com.lms.attendance.model.Grade;
import com.lms.attendance.repository.GradeMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class GradeServiceImpl implements GradeService {

    private final GradeMapper gradeMapper;

    public GradeServiceImpl(GradeMapper gradeMapper) {
        this.gradeMapper = gradeMapper;
    }

    @Override
    public List<Grade> getGradesByStudentId(String studentId) {
        return gradeMapper.findGradesByStudentId(studentId);
    }

    @Override
    @Transactional
    public void addGrade(Grade grade) {
        gradeMapper.insertGrade(grade);
    }

    @Override
    @Transactional
    public void updateGrade(Grade grade) {
        gradeMapper.updateGrade(grade);
    }

    @Override
    @Transactional
    public void deleteGrade(int gradeId) {
        gradeMapper.deleteGrade(gradeId);
    }
}
