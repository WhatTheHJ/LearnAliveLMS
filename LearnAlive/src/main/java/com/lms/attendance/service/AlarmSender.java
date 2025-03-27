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
            alarm.setCreatedAt(message.getCreatedAt() != null ? message.getCreatedAt() : LocalDateTime.now());
 alarm.setRead(false);
 System.out.println("🔍 AlarmMessage createdAt: " + message.getCreatedAt());

            alarmListService.saveAlarm(alarm);
        }
    }

    
    
}
