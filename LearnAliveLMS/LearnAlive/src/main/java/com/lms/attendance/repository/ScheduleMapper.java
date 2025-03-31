package com.lms.attendance.repository;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;
import java.util.Map;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Result;
import org.apache.ibatis.annotations.Results;
import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import org.apache.ibatis.type.JdbcType;

import com.lms.attendance.model.Schedule;

public interface ScheduleMapper {
	
	//일정 전체 조회
	@Select("SELECT * FROM schedule WHERE user_id = #{userId}")
	@Results({
	    @Result(property = "scheduleId", column = "schedule_id"),
	    @Result(property = "userId", column = "user_id"),
	    @Result(property = "date", column = "date"),
	    @Result(property = "title", column = "title"),
	    @Result(property = "content", column = "content"),
	    @Result(property = "color", column = "color"),
	    @Result(property = "mark", column = "mark"),
	    @Result(property = "createdAt", column = "created_at"),
	    @Result(property = "updatedAt", column = "updated_at"),
	    @Result(property = "alarmTime", column = "alarm_time", javaType = LocalDateTime.class, jdbcType = JdbcType.TIMESTAMP)
	})
	List<Schedule> getAllSchedule(@Param("userId") String userId);

    // 일정 생성
    @Insert("INSERT INTO schedule (user_id, date, title, content, mark, color, alarm_time) " +
            "VALUES (#{userId}, #{date}, #{title}, #{content}, #{mark}, #{color},  #{alarmTime, jdbcType=TIMESTAMP})")
    
    void createSchedule(Schedule newSchedule);

    // 일정 삭제
    @Delete("DELETE FROM schedule WHERE schedule_id = #{scheduleId}")
    	@Result(property = "scheduleId", column = "schedule_id")
    void deleteScheduleByScheduleId(int scheduleId);

    // 일정 수정
    @Update("UPDATE schedule SET title = #{title}, content = #{content}, updated_at = CURRENT_TIMESTAMP WHERE schedule_id = #{scheduleId}")
    void updateSchedule(Schedule schedule);


    // 날짜별 일정 조회
    @Select("SELECT * FROM schedule WHERE date = #{date}")
    List<Schedule> getScheduleByDate(LocalDate date);

    // 알람이 설정된 일정 조회
    @Select("SELECT * FROM schedule WHERE mark = 1")
    List<Schedule> getSchedulesWithAlarm();
    
    
    @Select("""
    	    SELECT sp.title, sp.end_time, sp.survey_id  
    	    FROM survey_post sp
    	    JOIN survey_board sb ON sp.board_id = sb.board_id
    	    WHERE sb.class_id IN (
    	    
    	        -- 학생의 경우
    	        SELECT s.class_id
    	        FROM Student_class s
    	        JOIN Student st ON s.student_id = st.student_id
    	        WHERE st.student_id = #{userId}

    	    )
    	""")
    @Results({
        @Result(column = "title", property = "title"),
        @Result(column = "end_time", property = "endTime"),
        @Result(column = "survey_id", property = "surveyId")
    })
    List<Map<String, Object>> findSurveyTitlesByUserId(String userId);

    
    
}