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
import com.lms.attendance.model.University;

@Mapper
public interface UniversityMapper {

    @Insert("INSERT INTO university (university_name) VALUES (#{universityName})")
    @Options(useGeneratedKeys = true, keyProperty = "universityId")
    void insertUniversity(University university);

    @Select("SELECT * FROM university ORDER BY university_name ASC")
    @Results(id="UniversityResultMap", value={
      @Result(property="universityId", column="university_id"),
      @Result(property="universityName", column="university_name")
    })
    List<University> getAllUniversities();

    @Update("UPDATE university SET university_name = #{universityName} WHERE university_id = #{universityId}")
    void updateUniversity(University university);

    @Delete("DELETE FROM university WHERE university_id = #{universityId}")
    void deleteUniversity(Integer universityId);
}