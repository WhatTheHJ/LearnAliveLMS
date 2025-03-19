package com.lms.attendance.service;

import java.util.List;

import org.springframework.stereotype.Service;

import com.lms.attendance.model.Student;
import com.lms.attendance.repository.StudentMapper;
import com.lms.attendance.repository.SurveyMapper;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class StudentService {
    private final StudentMapper studentMapper;
    private final SurveyMapper surveyMapper;

    // ✅ 수강생 등록
    public void registerStudent(Student newStudent) {
        studentMapper.registerStudent(newStudent);
    }

    // ✅ 특정 강의실의 모든 학생 조회
    public List<Student> getStudentsByClass(int classId) {
        return studentMapper.findStudentsByClass(classId);
    }

    // ✅ 학생 데이터 수정 (매개변수 매칭 수정)
    public void updateStudent(String studentId, Student updatedStudent) {
        studentMapper.updateStudent(
            studentId,
            updatedStudent.getUniversity(),
            updatedStudent.getDepartment(),
            updatedStudent.getName(),
            updatedStudent.getEmail(),
            updatedStudent.getClassId(),
            updatedStudent.getRemarks() // ✅ remarks 추가
        );
    }

    // ✅ 수강생 삭제
    public void deleteStudent(String studentId) {
        studentMapper.deleteStudent(studentId);
    }
    
    /** 응답 가능 시간 업데이트*/
    public boolean updateSurveyTimes(Long surveyId, String newStartTime, String newEndTime) {
        int updatedRows = surveyMapper.updateSurveyTimes(surveyId, newStartTime, newEndTime);
        return updatedRows > 0;
    }
}
