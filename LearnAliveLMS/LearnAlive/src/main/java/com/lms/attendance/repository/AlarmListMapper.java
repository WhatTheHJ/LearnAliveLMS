package com.lms.attendance.repository;

import java.util.List;

import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Select;

import com.lms.attendance.model.AlarmList;

@Mapper
public interface AlarmListMapper {

    @Insert("""
        INSERT INTO alarm_list (user_id, class_id, type, title, created_at, is_read)
        VALUES (#{userId}, #{classId}, #{type}, #{title}, #{createdAt}, #{isRead})
    """)
    void insertAlarm(AlarmList alarm);

    @Select("SELECT * FROM alarm_list WHERE user_id = #{userId} ORDER BY created_at DESC LIMIT 20")
    List<AlarmList> getAlarmsByUserId(String userId);
    
    @Select("SELECT student_id FROM student_class WHERE class_id = #{classId}")
    List<String> findStudentIdsByClassId(int classId);

    @Select("SELECT prof_id FROM class WHERE class_id = #{classId}")
    String findProfessorIdByClassId(int classId); // 교수는 1명이라 단일 반환
}