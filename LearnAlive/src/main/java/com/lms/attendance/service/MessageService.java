package com.lms.attendance.service;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.lms.attendance.model.AddressBook;
import com.lms.attendance.model.Message;
import com.lms.attendance.repository.MessageMapper;

@Service
public class MessageService {
    
    @Autowired
    private MessageMapper messageMapper;

    // 쪽지 보내기
    public void sendMessage(Message message) {
        messageMapper.sendMessage(message);
    }

    // 쪽지 상세 조회
    public Message getMessageById(int messageId) {
        return messageMapper.findMessageById(messageId);
    }
    
    // 받은 쪽지 목록 조회
    public List<Message> getReceivedMessages(String receiverId) {
        return messageMapper.getReceivedMessages(receiverId);
    }

    // 보낸 쪽지 목록 조회
    public List<Message> getSentMessages(String senderId) {
        return messageMapper.getSentMessages(senderId);
    }

    // 특정 쪽지 읽기 (읽음 처리)
    public void markAsRead(int messageId) {
        messageMapper.markAsRead(messageId);
    }

    // 쪽지 삭제
    public void deleteMessage(int messageId) {
        messageMapper.deleteMessage(messageId);
    }
    
    // 주소록 조회
    public List<AddressBook> getAddressBook() {
        return messageMapper.getAddressBook();
    }
}

