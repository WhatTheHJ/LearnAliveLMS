package com.lms.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;

import com.lms.attendance.model.Student;

@Mapper
public interface StudentMapper {

	// ✅ 학생 등록 (INSERT)
		@Insert("""
			    INSERT INTO Student (student_id, university, department, name, phone, email, password)
			    VALUES (#{studentId}, #{university}, #{department}, #{name}, #{phone}, #{email}, #{password})
			""")
			void registerStudent(Student student);
	
    // ✅ 학생 등록 (INSERT)
//	@Insert("""
//		    INSERT INTO Student (student_id, university, department, name, email, remarks)
//		    VALUES (#{studentId}, #{university}, #{department}, #{name}, #{email}, #{remarks})
//		""")
//		void registerStudent(Student student);
	
		// ✅ 학생 로그인
				@Select("SELECT * FROM Student WHERE student_id = #{studentId}")
				@Results({
				    @Result(column = "student_id", property = "studentId"),
				    @Result(column = "university", property = "university"),
				    @Result(column = "department", property = "department"),
				    @Result(column = "name", property = "name"),
				    @Result(column = "phone", property = "phone"),
				    @Result(column = "email", property = "email"),
				    @Result(column = "password", property = "password")
				})
				Student findStudentById(@Param("studentId") String studentId);

    // ✅ 특정 강의실에 속한 모든 학생 조회 (SELECT)
		@Select("""
			    SELECT s.student_id, s.university, s.department, s.name, s.email, sc.class_id, sc.remarks
			    FROM student_class sc
			    JOIN Student s ON sc.student_id = s.student_id
			    WHERE sc.class_id = #{classId}
			    ORDER BY 
			        s.university ASC,
			        s.department ASC,
			        s.student_id ASC
			""")
			@Results(id = "StudentResultMap", value = {
			    @Result(column = "student_id", property = "studentId"),
			    @Result(column = "university", property = "university"),
			    @Result(column = "department", property = "department"),
			    @Result(column = "name", property = "name"),
			    @Result(column = "email", property = "email"),
			    @Result(column = "class_id", property = "classId"),
			    @Result(column = "remarks", property = "remarks")
			})
			List<Student> findStudentsByClass(@Param("classId") int classId);


    // ✅ 학생 정보 업데이트 (UPDATE)
		@Update("""
			    UPDATE Student
			    SET university = #{university}, 
			        department = #{department}, 
			        name = #{name}, 
			        email = #{email}
			    WHERE student_id = #{studentId}
			""")
			void updateStudent(
			    @Param("studentId") String studentId,
			    @Param("university") String university,
			    @Param("department") String department,
			    @Param("name") String name,
			    @Param("email") String email
			);

    // ✅ 학생 삭제 (DELETE)
    @Delete("""
        DELETE FROM student_class WHERE student_id = #{studentId}
    """)
    void deleteStudent(@Param("studentId") String studentId);
    
    //학생 검색
    @Select("""
    	    SELECT s.student_id AS studentId,
    	           s.name AS name,
    	           s.university AS university,
    	           s.department AS department,
    	           s.email AS email,
    	           sc.remarks AS remarks
    	    FROM Student s
    	    LEFT JOIN student_class sc
    	      ON s.student_id = sc.student_id
    	    WHERE s.student_id LIKE CONCAT('%', #{keyword}, '%') 
    	       OR s.name LIKE CONCAT('%', #{keyword}, '%')
    	""")
    	List<Student> searchStudents(@Param("keyword") String keyword);


    
    // 수강생 강의실에 등록 쿼리
    @Insert("INSERT INTO student_class (student_id, class_id, remarks) " +
            "VALUES (#{studentId}, #{classId}, #{remarks})")
    void registerStudentToClass(@Param("studentId") String studentId,
                                @Param("classId") int classId,
                                @Param("remarks") String remarks);


}
