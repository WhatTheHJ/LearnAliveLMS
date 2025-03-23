package com.lms.attendance.repository;

import java.util.List;
import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Options;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Update;
import com.lms.attendance.model.Department;

@Mapper
public interface DepartmentMapper {

    @Insert("INSERT INTO department (department_name, university_id) VALUES (#{departmentName}, #{universityId})")
    @Options(useGeneratedKeys = true, keyProperty = "departmentId")
    void insertDepartment(Department department);

    @Select("SELECT * FROM department ORDER BY department_name ASC")
    @Results(id="DepartmentResultMap", value={
      @Result(property="departmentId", column="department_id"),
      @Result(property="departmentName", column="department_name"),
      @Result(property="universityId", column="university_id")
    })
    List<Department> getAllDepartments();

    @Update("UPDATE department SET department_name = #{departmentName}, university_id = #{universityId} WHERE department_id = #{departmentId}")
    void updateDepartment(Department department);

    @Delete("DELETE FROM department WHERE department_id = #{departmentId}")
    void deleteDepartment(Integer departmentId);
}