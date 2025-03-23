package com.lms.attendance.service;

import com.lms.attendance.model.Professor;

import java.util.List;

public interface ProfessorService {
    List<Professor> getAllProfessors();
    Professor getProfessorById(String prof_id);
    void saveProfessor(Professor professor);
    void updateProfessor(Professor professor);
    void deleteProfessor(String prof_id);
    Professor findByNameAndEmail(String name, String email);  // ID 찾기 추가
    Professor findByIdAndNameAndPhone(String userId, String name, String phone); // 비밀번호 찾기 추가
}