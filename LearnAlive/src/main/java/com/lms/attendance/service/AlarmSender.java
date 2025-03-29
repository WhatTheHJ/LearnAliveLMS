package com.lms.attendance.service;

import com.lms.attendance.model.AlarmList;
import com.lms.attendance.model.AlarmMessage;
import com.lms.attendance.repository.AlarmListMapper;

import lombok.RequiredArgsConstructor;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;

import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class AlarmSender {
	
	private final AlarmListService alarmListService;
	private final AlarmListMapper alarmListMapper;
    private final SimpMessagingTemplate messagingTemplate;

    public void sendToUsersInClass(int classId, AlarmMessage message) {
        List<String> userIds = new ArrayList<>();
        userIds.addAll(alarmListMapper.findStudentIdsByClassId(classId));

        String profId = alarmListMapper.findProfessorIdByClassId(classId);
        if (profId != null) userIds.add(profId);

        for (String userId : userIds) {
            System.out.println("📤 WebSocket 알림 전송: userId = " + userId + ", title = " + message.getTitle());

            messagingTemplate.convertAndSend("/topic/user/" + userId, message); // ✅ 유저별 전송

            AlarmList alarm = new AlarmList();
            alarm.setUserId(userId);
            alarm.setClassId(classId);
            alarm.setType(message.getType());
            alarm.setTitle(message.getTitle());
            alarm.setCreatedAt(message.getCreatedAt());
            alarm.setRead(false);

            alarmListService.saveAlarm(alarm);
        }
    }
    
    public void sendToAllUsers(AlarmMessage message) {
        // 모든 사용자 ID를 가져오는 메서드 호출 (필요 시 직접 구현)
        List<String> allUserIds = alarmListMapper.findAllUserIds();

        for (String userId : allUserIds) {
            System.out.println("📤 WebSocket 전역 알림 전송: userId = " + userId + ", title = " + message.getTitle());

            messagingTemplate.convertAndSend("/topic/user/" + userId, message); // ✅ 유저별 전송

            AlarmList alarm = new AlarmList();
            alarm.setUserId(userId);
            alarm.setClassId(0);  // 공지사항이므로 classId는 0
            alarm.setType(message.getType());
            alarm.setTitle(message.getTitle());
            alarm.setCreatedAt(message.getCreatedAt());
            alarm.setRead(false);

            alarmListService.saveAlarm(alarm);
        }
    }
    
    
    
    // 특정 사용자에게 알림 전송
    public void sendToSpecificUsers(List<String> userIds, AlarmMessage message) {
        for (String userId : userIds) {
            sendAlarmToUser(userId, message);
        }
    }
    private void sendAlarmToUser(String userId, AlarmMessage message) {
        System.out.println("📤 WebSocket 알림 전송: userId = " + userId + ", title = " + message.getTitle());
        messagingTemplate.convertAndSend("/topic/user/" + userId, message);

        AlarmList alarm = new AlarmList();
        alarm.setUserId(userId);
        alarm.setClassId(message.getClassId());
        alarm.setType(message.getType());
        alarm.setTitle(message.getTitle());
        alarm.setCreatedAt(message.getCreatedAt());
        alarm.setRead(false);

        alarmListService.saveAlarm(alarm);
    }
}


    
    
