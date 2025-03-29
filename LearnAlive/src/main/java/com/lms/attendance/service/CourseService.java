package com.lms.attendance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lms.attendance.model.Course;
import com.lms.attendance.repository.CourseMapper;

@Service
public class CourseService {

    @Autowired
    private CourseMapper courseMapper;

    public List<Course> getPreRegistrationCourses() {
        return courseMapper.findAvailableCourses();
    }

    public List<Course> getMyPreRegisteredCourses(String studentId) {
        return courseMapper.findMyPreRegisteredCourses(studentId);
    }

    public void addPreRegistration(String studentId, int classId) {
        // 추가 검증 로직(중복 신청, 학점/정원 체크 등)을 필요 시 추가
        courseMapper.insertPreRegistration(studentId, classId);
    }

    public void removePreRegistration(String studentId, int classId) {
        courseMapper.deletePreRegistration(studentId, classId);
    }
}
