package com.lms.attendance.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.AddressBook;
import com.lms.attendance.model.Exam;
import com.lms.attendance.model.Message;
import com.lms.attendance.service.MessageService;

@RestController
@RequestMapping("/api/messages")
public class MessageController {
    
    @Autowired
    private MessageService messageService;

    // 쪽지 보내기
    @PostMapping("/send")
    public ResponseEntity<String> sendMessage(@RequestBody Message message) {
        messageService.sendMessage(message);
        return ResponseEntity.ok("쪽지를 보냈습니다.");
    }

   // 쪽지 상세 조회
    @GetMapping("/{messageId}")
    public ResponseEntity<Message> getMessageById(@PathVariable int messageId) {
        Message message = messageService.getMessageById(messageId);
        System.out.println("🔍상세보기 messages: " + message);
        if (message != null) {
            return ResponseEntity.ok(message);
        } else {
            return ResponseEntity.notFound().build();
        }
    }
    
   // 받은 쪽지 목록 조회
    @GetMapping("/received/{receiverId}")
    public ResponseEntity<List<Message>> getReceivedMessages(@PathVariable String receiverId) {
        List<Message> messages = messageService.getReceivedMessages(receiverId);
        System.out.println("🔍받은쪽지 messages: " + messages);
        return ResponseEntity.ok(messages);
    }

    // 보낸 쪽지 목록 조회
    @GetMapping("/sent/{senderId}")
    public ResponseEntity<List<Message>> getSentMessages(@PathVariable String senderId) {
        List<Message> messages = messageService.getSentMessages(senderId);
        System.out.println("🔍 보낸쪽지 messages: " + messages);  
        return ResponseEntity.ok(messages);
    }

    // 쪽지 읽기 (읽음 처리)
    @PutMapping("/read/{messageId}")
    public ResponseEntity<String> markAsRead(@PathVariable int messageId) {
        messageService.markAsRead(messageId);
        return ResponseEntity.ok("쪽지를 읽음 처리했습니다.");
    }

    // 쪽지 삭제
    @DeleteMapping("/delete/{messageId}")
    public ResponseEntity<String> deleteMessage(@PathVariable int messageId) {
        messageService.deleteMessage(messageId);
        System.out.println("🔍 삭제된 messages: " + messageId);  
        return ResponseEntity.ok("쪽지를 삭제했습니다.");
    }
    
    // 주소록 조회
    @GetMapping("/addressBook")
    public List<AddressBook> getAddressBook() {
        return messageService.getAddressBook();
    }
}

