package com.korea.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;

import com.korea.attendance.model.Classroom;

@Mapper
public interface ClassMapper {
    
	@Select("(SELECT c.class_id AS classId, c.class_name AS className, c.prof_id AS profId " +
	        "FROM Class c JOIN Student s ON c.class_id = s.class_id WHERE s.student_id = #{userId}) " +
	        "UNION " +
	        "(SELECT c.class_id AS classId, c.class_name AS className, c.prof_id AS profId " +
	        "FROM Class c WHERE c.prof_id = #{userId})")
	List<Classroom> findClassesByUserId(String userId);

	@Insert("""
	        INSERT INTO Class (class_name, prof_id)
	        VALUES (#{className}, #{profId})
	    """)
	    void insertClassroom(Classroom newClass);
	
	// ✅ 강의실 삭제 SQL
    @Delete("DELETE FROM Class WHERE class_id = #{classId}")
    void deleteClassById(int classId);
	
    //모든 강의실 가져오기
    @Select("SELECT class_id, class_name, prof_id FROM Class")
    @Results({
        @Result(column = "class_id", property = "classId"),
        @Result(column = "class_name", property = "className"),
        @Result(column = "prof_id", property = "profId")
    })
    List<Classroom> findAllClasses();
}
