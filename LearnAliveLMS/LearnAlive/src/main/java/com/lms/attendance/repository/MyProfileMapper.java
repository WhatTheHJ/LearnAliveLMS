package com.lms.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.lms.attendance.model.MyPage;

@Mapper
public interface MyProfileMapper {
    @Select("SELECT * FROM Professor WHERE prof_id = #{userId}")
    @Results({
        @Result(property = "userId", column = "prof_id"),
        @Result(property = "role", column = "role"),
        @Result(property = "name", column = "name"),
        @Result(property = "university", column = "university"),
        @Result(property = "department", column = "department"),
        @Result(property = "email", column = "email"),
        @Result(property = "phone", column = "phone"),
        @Result(property = "password", column = "password")
    })
    MyPage findProfessorById(@Param("userId") String userId);

    @Select("SELECT * FROM Student WHERE student_id = #{userId}")
    @Results({
        @Result(property = "userId", column = "student_id"),
        @Result(property = "role", column = "role"),
        @Result(property = "name", column = "name"),
        @Result(property = "university", column = "university"),
        @Result(property = "department", column = "department"),
        @Result(property = "email", column = "email"),
        @Result(property = "phone", column = "phone"),
        @Result(property = "password", column = "password")
    })
    List<MyPage> findStudentById(@Param("userId") String userId);

    @Update("UPDATE Professor SET email = #{email}, phone = #{phone} WHERE prof_id = #{userId}")
    int updateProfessor(@Param("userId") String userId, @Param("email") String email, @Param("phone") String phone);

    @Update("UPDATE Student SET email = #{email}, phone = #{phone} WHERE student_id = #{userId}")
    int updateStudent(@Param("userId") String userId, @Param("email") String email, @Param("phone") String phone);
    
    // 비밀번호 업데이트 쿼리 추가
    @Update("UPDATE Professor SET password = #{newPassword} WHERE prof_id = #{userId}")
    int updatePassword(@Param("userId") String userId, @Param("newPassword") String newPassword);
    
    // userId에 해당하는 강의실 목록을 반환하는 SQL 쿼리
    @Select("SELECT class_name FROM Class WHERE class_id = #{classId}")
    List<String> findClassByClassId(@Param("classId") String classId);
}