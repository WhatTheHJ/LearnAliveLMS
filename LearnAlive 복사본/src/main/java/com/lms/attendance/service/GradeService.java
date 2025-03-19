package com.lms.attendance.service;

import com.lms.attendance.model.Grade;
import java.util.List;

public interface GradeService {
    List<Grade> getGradesByStudentId(String studentId);
    void addGrade(Grade grade);
    void updateGrade(Grade grade);
    void deleteGrade(int gradeId);
}
