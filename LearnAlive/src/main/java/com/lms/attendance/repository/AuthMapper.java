package com.lms.attendance.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lms.attendance.model.User;

@Mapper
public interface AuthMapper {

    // ✅ 학생, 교수, 관리자 통합 조회 (역할(role)까지 포함)
    @Select("""
        SELECT student_id AS userId, name, 'student' AS role, password FROM Student WHERE student_id = #{userId}
        UNION ALL
        SELECT prof_id AS userId, name, 'professor' AS role, password FROM Professor WHERE prof_id = #{userId}
        UNION ALL
        SELECT admin_id AS userId, NULL AS name, 'ADMIN' AS role, password FROM Admin WHERE admin_id = #{userId}
    """)
    @Results({
        @Result(column = "userId", property = "userId"),
        @Result(column = "name", property = "name"),
        @Result(column = "role", property = "role"),
        @Result(column = "password", property = "password")
    })
    User findUserById(String userId);

    // ✅ 사용자 이름 조회 (학생, 교수)
    @Select("""
    	    SELECT name FROM Student WHERE student_id = #{userId}
    	    UNION
    	    SELECT name FROM Professor WHERE prof_id = #{userId}
    	""")
    	String findUserNameByIdAndRole(@Param("userId") String userId, @Param("role") String role);


    // ✅ 관리자 비밀번호 조회 (admin)
    @Select("SELECT password FROM Admin WHERE admin_id = #{adminId}")
    String findAdminPasswordById(String adminId);
}