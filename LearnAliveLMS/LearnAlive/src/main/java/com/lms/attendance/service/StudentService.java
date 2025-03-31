package com.lms.attendance.service;

import java.util.List;

import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
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
    private final BCryptPasswordEncoder passwordEncoder;
    
 // ✅ 학습자(학생) 회원가입
    public void registerStudent(Student newStudent) {
        // 비밀번호 해싱 후 저장
        newStudent.setPassword(passwordEncoder.encode(newStudent.getPassword()));
        studentMapper.registerStudent(newStudent);
    }
    
    //학습자 학번 중복확인
    public Student findStudentById(String studentId) {
        return studentMapper.findStudentById(studentId);
    }

    // ✅ 수강생 등록
//    public void registerStudent(Student newStudent) {
//        studentMapper.registerStudent(newStudent);
//    }

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
            updatedStudent.getEmail()
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
    
    //학생 검색
    public List<Student> searchStudents(String keyword) {
        return studentMapper.searchStudents(keyword);
    }
    
    public void registerStudentToClass(String studentId, int classId, String remarks) {
        studentMapper.registerStudentToClass(studentId, classId, remarks);
    }

    
    
    
    
 // ✅ [추가] 학습자 아이디 찾기
    public Student findStudentByNameAndEmail(String name, String email) {
        return studentMapper.findStudentByNameAndEmail(name, email);
    }
    
    // ✅ [추가] 학습자 비밀번호 재설정을 위한 정보 조회 (ID, 이름, 전화번호 일치 여부 확인)
    public Student findByIdAndNameAndPhone(String studentId, String name, String phone) {
        return studentMapper.findByIdAndNameAndPhone(studentId, name, phone);
    }
    
    // ✅ [추가] 학습자 비밀번호 재설정 (새 비밀번호를 암호화 후 업데이트)
    public void updateStudentPassword(String studentId, String newPassword) {
        String encryptedPassword = passwordEncoder.encode(newPassword);
        studentMapper.updateStudentPassword(studentId, encryptedPassword);
    }
}
    
    
