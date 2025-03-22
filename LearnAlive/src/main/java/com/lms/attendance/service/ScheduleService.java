package com.lms.attendance.service;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.Schedule;
import com.lms.attendance.repository.ScheduleMapper;

@Service
public class ScheduleService {
	private final ScheduleMapper scheduleMapper; 
	@Autowired 
	public ScheduleService(ScheduleMapper scheduleMapper) {
        this.scheduleMapper = scheduleMapper;
    }
	
	
	public List<Schedule> getScheduleByUserId(String userId) {
	    // userId에 해당하는 일정을 조회하는 매퍼 메서드 호출
	    return scheduleMapper.getAllSchedule(userId);
	}
	
	
		public Schedule createSchedule(Schedule newSchedule) {
		 scheduleMapper.createSchedule(newSchedule);
	        return newSchedule;
	    }

	    // 일정 업데이트
	 		public Schedule updateSchedule(Schedule schedule) {
	        // DB에서 일정을 업데이트
	        scheduleMapper.updateSchedule(schedule);
	        return schedule;
	    }

	    // 일정 삭제
	 		@Transactional
	    public void deleteSchedule(int scheduleId) {
	    	scheduleMapper.deleteScheduleByScheduleId(scheduleId);
	    }

	    // 알람이 설정된 일정 조회
	    public List<Schedule> getSchedulesWithAlarm() {
	        return scheduleMapper.getSchedulesWithAlarm();
	    }


		public List<Schedule> getScheduleByDate(LocalDate date) {
			return scheduleMapper.getScheduleByDate(date);
		}

}
