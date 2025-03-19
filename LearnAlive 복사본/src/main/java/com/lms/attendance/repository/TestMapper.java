package com.lms.attendance.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface TestMapper {

    // 학생 수 조회
    @Select("SELECT COUNT(*) FROM Student")
    long getStudentCount();
}
