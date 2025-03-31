package com.lms.attendance.controller;

import java.time.LocalDate;
import java.util.List;
import java.util.Map;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.Schedule;
import com.lms.attendance.model.Todo;
import com.lms.attendance.service.ScheduleService;

@RestController
@RequestMapping("/api/schedules/{userId}")
public class ScheduleController {

    @Autowired
    private ScheduleService scheduleService;

    @GetMapping("/")
    public ResponseEntity<List<Schedule>> getAllSchedule(@PathVariable("userId") String userId) {
        try {
            // userId에 해당하는 일정 조회
            List<Schedule> schedules = scheduleService.getScheduleByUserId(userId);
            
            if (schedules.isEmpty()) {
                return new ResponseEntity<>(HttpStatus.NO_CONTENT); // 일정이 없다면 204 상태 반환
            }
            
            return ResponseEntity.ok(schedules); // 일정들이 있을 경우 200 상태와 함께 반환
        } catch (Exception e) {
            return new ResponseEntity<>(HttpStatus.INTERNAL_SERVER_ERROR); // 에러가 발생하면 500 상태 반환
        }
    }
    
    // 일정 추가
    @PostMapping("/")
    public ResponseEntity<String> createSchedule(@RequestBody Schedule schedule) {
        try {
            scheduleService.createSchedule(schedule);
            return new ResponseEntity<>("Schedule created successfully", HttpStatus.CREATED);
        } catch (Exception e) {
            return new ResponseEntity<>("Error creating schedule", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 일정 삭제
    @DeleteMapping("/{scheduleId}")
    public ResponseEntity<?> deleteSchedule(@PathVariable("scheduleId") int scheduleId) {
    	  System.out.println("삭제할 scheduleId: " + scheduleId); // 로그 추가
    	    
    	    // 실제 삭제 로직을 호출
    	    scheduleService.deleteSchedule(scheduleId);
    	    
    	    return ResponseEntity.ok("삭제 완료");
    }

    // 일정 수정
    @PutMapping("/{scheduleId}")
    public ResponseEntity<String> updateSchedule(@PathVariable("scheduleId") int scheduleId, @RequestBody Schedule schedule) {
        try {
            schedule.setScheduleId(scheduleId);  // Update the schedule ID
            scheduleService.updateSchedule(schedule);
            return new ResponseEntity<>("Schedule updated successfully", HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>("Error updating schedule", HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 날짜별 일정 조회
    @GetMapping("/{date}")
    public ResponseEntity<List<Schedule>> getScheduleByDate(@PathVariable String date) {
        try {
            LocalDate localDate = LocalDate.parse(date);
            List<Schedule> schedules = scheduleService.getScheduleByDate(localDate);
            return new ResponseEntity<>(schedules, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }

    // 알람이 설정된 일정 조회
    @GetMapping("/alarm")
    public ResponseEntity<List<Schedule>> getSchedulesWithAlarm() {
        try {
            List<Schedule> schedules = scheduleService.getSchedulesWithAlarm();
            return new ResponseEntity<>(schedules, HttpStatus.OK);
        } catch (Exception e) {
            return new ResponseEntity<>(null, HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    
 //------------------------------todo
    
    // 특정 사용자의 투두 리스트 가져오기
    @GetMapping("/todos")
    public List<Todo> getTodosByUserId(@PathVariable("userId") String userId) {
    	 System.out.println("UserId 받아온 값: " + userId);  // userId 확인
    	 List<Todo> todos = scheduleService.getTodosByUserId(userId);
    	 System.out.println("조회된 todos: " + todos);  // todos 내용 확인
    	    return todos;
    }

    // 투두 추가
    @PostMapping("/todos")
    public Todo createTodo(@RequestBody Todo newTodo) {
        return scheduleService.createTodo(newTodo);
    }

    // 투두 완료 상태 업데이트
    @PutMapping("/todos/{todoId}")
    public Todo updateTodo(@PathVariable("todoId") int todoId, @RequestBody Todo updatedTodo) {
        updatedTodo.setTodoId(todoId);
        return scheduleService.updateTodo(updatedTodo);
    }

    // 투두 삭제
    @DeleteMapping("/todos/{todoId}")
    public void deleteTodo(@PathVariable("todoId") int todoId) {
        scheduleService.deleteTodo(todoId);
    }

    // 완료된 투두 중 가장 오래된 항목 삭제
    @DeleteMapping("/oldest-completed")
    public void deleteOldestCompletedTodo() {
        scheduleService.deleteOldestCompletedTodoIfNeeded();
    }

    // 투두 완료 상태 업데이트 및 가장 오래된 완료된 투두 삭제
    @PutMapping("/todos/{todoId}/complete")
    public Todo updateTodoCompletionAndCheckOldest(@PathVariable("todoId") int todoId, @RequestBody Todo updatedTodo) {
        updatedTodo.setTodoId(todoId);
        scheduleService.updateTodoCompletionAndCheckOldest(updatedTodo);
        return updatedTodo;
    }
    //------------------------
    // userId에 해당하는 설문조사 제목을 조회하는 엔드포인트
    @GetMapping("/calendar")
    public List<Map<String, Object>> getSurveyTitles(@PathVariable("userId") String userId) {
        return scheduleService.getSurveyTitlesByUserId(userId);
    }
    
}