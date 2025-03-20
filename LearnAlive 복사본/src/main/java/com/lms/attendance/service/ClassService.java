package com.lms.attendance.service;

import com.lms.attendance.model.ClassDetail;
import com.lms.attendance.model.ClassSettings;
import com.lms.attendance.model.Classroom;
import com.lms.attendance.repository.ClassMapper;

import org.slf4j.Logger;
import org.slf4j.LoggerFactory;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class ClassService {

    private static final Logger logger = LoggerFactory.getLogger(ClassService.class);
    private final ClassMapper classMapper;

    public ClassService(ClassMapper classMapper) {
        this.classMapper = classMapper;
    }

    public List<Classroom> getClassesByUserId(String userId) {
        logger.info("📌 [DEBUG] ClassService.getClassesByUserId 호출: userId={}", userId);

        List<Classroom> classrooms = classMapper.findClassesByUserId(userId);

        logger.info("📌 [DEBUG] DB에서 조회된 강의실: {}", classrooms);

        return classrooms;
    }
    
    public void addClassroom(Classroom newClass) {
        classMapper.insertClassroom(newClass);
    }
    
    // ✅ 강의실 삭제 로직 추가
    @Transactional
    public void deleteClassById(int classId) {
        classMapper.deleteClassById(classId);
    }
    
    // 모든 강의실 가져오기
    public List<Classroom> getAllClasses() {
        return classMapper.findAllClasses();
    }

    // 특정 강의실의 출석 시간 설정 조회
    public ClassSettings getClassSettingsById(int classId) {
        return classMapper.findClassSettingsById(classId);
    }
    
 // ✅ 출석 시간 설정 변경
    public void updateClassSettings(ClassSettings settings) {
        classMapper.updateClassSettings(settings);
    }
    
    // 클래서 정보 요청 서비스
    public ClassDetail getClassDetail(int classId) {
        return classMapper.findClassDetailById(classId);
    }
    
    // 새로 추가된 성적 업데이트 메서드
    public void updateClassGrade(int classId, Double score, String grade) {
        logger.info("📌 [DEBUG] updateClassGrade 호출: classId={}, score={}, grade={}", classId, score, grade);
        classMapper.updateClassGrade(classId, score, grade);
    }
    
    public void updateClassDescription(int classId, String description) {
        classMapper.updateClassDescription(classId, description);
    }
}
