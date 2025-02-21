package com.korea.attendance.service;

import com.korea.attendance.model.Classroom;
import com.korea.attendance.repository.ClassMapper;
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

}
