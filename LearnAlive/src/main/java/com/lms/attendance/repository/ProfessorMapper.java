package com.lms.attendance.repository;

import com.lms.attendance.model.Professor;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface ProfessorMapper {

    @Select("SELECT * FROM professor")
    List<Professor> getAllProfessors();

    @Select("SELECT * FROM professor WHERE prof_id = #{prof_id}")
    Professor getProfessorById(@Param("prof_id") String prof_id);

    @Insert("INSERT INTO professor (prof_id, name, department, email, password, phone, university) " +
            "VALUES (#{prof_id}, #{name}, #{department}, #{email}, #{password}, #{phone}, #{university})")
    void insertProfessor(Professor professor);

    @Update("UPDATE professor " +
            "SET name = #{name}, department = #{department}, email = #{email}, password = #{password}, phone = #{phone}, university = #{university}" +
            "WHERE prof_id = #{prof_id}")
    void updateProfessor(Professor professor);

    @Delete("DELETE FROM professor WHERE prof_id = #{prof_id}")
    void deleteProfessor(@Param("prof_id") String prof_id);

    @Select("SELECT * FROM professor WHERE name = #{name} AND email = #{email}")
    Professor findByNameAndEmail(@Param("name") String name, @Param("email") String email);

    @Select("SELECT * FROM professor WHERE prof_id = #{userId} AND name = #{name} AND phone = #{phone}")
    Professor findByIdAndNameAndPhone(@Param("userId") String userId, @Param("name") String name, @Param("phone") String phone);
}