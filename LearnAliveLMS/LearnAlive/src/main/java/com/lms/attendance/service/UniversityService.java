package com.lms.attendance.service;

import java.util.List;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import com.lms.attendance.model.University;
import com.lms.attendance.model.Department;
import com.lms.attendance.repository.UniversityMapper;
import com.lms.attendance.repository.DepartmentMapper;
import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
public class UniversityService {
    private final UniversityMapper universityMapper;
    private final DepartmentMapper departmentMapper;

    @Transactional
    public void addUniversity(University university) {
        universityMapper.insertUniversity(university);
    }

    @Transactional
    public void updateUniversity(University university) {
        universityMapper.updateUniversity(university);
    }

    @Transactional
    public void deleteUniversity(Integer universityId) {
        universityMapper.deleteUniversity(universityId);
    }

    public List<University> getUniversities() {
        return universityMapper.getAllUniversities();
    }

    @Transactional
    public void addDepartment(Department department) {
        departmentMapper.insertDepartment(department);
    }

    @Transactional
    public void updateDepartment(Department department) {
        departmentMapper.updateDepartment(department);
    }

    @Transactional
    public void deleteDepartment(Integer departmentId) {
        departmentMapper.deleteDepartment(departmentId);
    }

    public List<Department> getDepartments() {
        return departmentMapper.getAllDepartments();
    }
}