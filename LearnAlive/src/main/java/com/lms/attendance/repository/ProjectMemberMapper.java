package com.lms.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.lms.attendance.model.ProjectMember;

@Mapper
public interface ProjectMemberMapper {

    @Insert("""
            INSERT INTO project_member (post_id, student_id, name, department, email, contact, approved_at)
            VALUES (#{postId}, #{studentId}, #{name}, #{department}, #{email}, #{contact}, #{approvedAt})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "memberId")
    void insertProjectMember(ProjectMember member);

//    @Select("SELECT * FROM project_member WHERE post_id = #{postId}")
//    List<ProjectMember> getProjectMembersByPostId(int postId);
    
    @Select("""
    		SELECT 
    		  pm.member_id, 
    		  pm.post_id, 
    		  s.student_id, 
    		  s.name, 
    		  s.department, 
    		  s.email, 
    		  s.phone AS contact, 
    		  pm.approved_at
    		FROM project_member pm
    		JOIN Student s ON pm.student_id = s.student_id
    		WHERE pm.post_id = #{postId}
    		""")
    		@Results({
    		    @Result(column = "member_id", property = "memberId"),
    		    @Result(column = "post_id", property = "postId"),
    		    @Result(column = "student_id", property = "studentId"),
    		    @Result(column = "name", property = "name"),
    		    @Result(column = "department", property = "department"),
    		    @Result(column = "email", property = "email"),
    		    @Result(column = "contact", property = "contact"),
    		    @Result(column = "approved_at", property = "approvedAt")
    		})
    		List<ProjectMember> getProjectMembersWithStudentInfoByPostId(@Param("postId") int postId);
    
    @Delete("DELETE FROM project_member WHERE member_id = #{memberId}")
    void deleteProjectMember(@Param("memberId") int memberId);
}