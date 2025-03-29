package com.lms.attendance.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.Schedule;
import com.lms.attendance.model.Todo;
import com.lms.attendance.repository.ScheduleMapper;
import com.lms.attendance.repository.TodoMapper;

@Service
public class ScheduleService {
	private final ScheduleMapper scheduleMapper; 
	private final TodoMapper todoMapper;
	@Autowired 
	public ScheduleService(ScheduleMapper scheduleMapper, TodoMapper todoMapper) {
        this.scheduleMapper = scheduleMapper;
		this.todoMapper = todoMapper;
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
	 
//--------------------todo리스트
	 public List<Todo> getTodosByUserId(String userId) {
		 return todoMapper.getTodosByUserId(userId);
	 }
	 
	 public Todo findById(int todoId) {
		 return todoMapper.findById(todoId);
	 }
	 
	 public Todo createTodo(Todo newTodo) {
		 todoMapper.insertTodo(newTodo);
	        return newTodo;
	    }
	 public Todo updateTodo(Todo newTodo) {
		    // newTodo에서 todoId와 completed 값을 추출하여 updateTodoCompletion 메서드를 호출
		    todoMapper.updateTodoCompletion(newTodo.getTodoId(), newTodo.isCompleted());
		    
		    // 업데이트된 newTodo 반환
		    return newTodo;
		}
	 public void deleteTodo(int todoId) {
		 todoMapper.deleteTodo(todoId);
	    }
	 // 완료된 투두 중 가장 오래된 항목 삭제
	    public void deleteOldestCompletedTodoIfNeeded() {
	        // 먼저 완료된 투두의 개수를 확인
	        int completedCount = todoMapper.countCompletedTodos();

	        // 완료된 항목이 2개 이상이면 가장 오래된 항목 삭제
	        if (completedCount >= 2) {
	            todoMapper.deleteOldestCompletedTodo();
	        }
	    }
	  public void updateTodoCompletionAndCheckOldest(Todo newTodo) {
	        // 기존 완료 상태 업데이트
	        todoMapper.updateTodoCompletion(newTodo.getTodoId(), newTodo.isCompleted());
	        
	        // 완료된 투두가 2개 이상일 경우 가장 오래된 완료된 항목 삭제
	        deleteOldestCompletedTodoIfNeeded();
	        
	    }
	  
	  
	  // userId에 해당하는 설문조사 제목을 반환하는 메서드
	    public List<Map<String, Object>> getSurveyTitlesByUserId(String userId) {
	        return scheduleMapper.findSurveyTitlesByUserId(userId);
	    }


}