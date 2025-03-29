package com.lms.attendance.repository;

import com.lms.attendance.model.AddressBook;
import com.lms.attendance.model.Message;

import java.util.List;

import org.apache.ibatis.annotations.*;

@Mapper
public interface MessageMapper {
    
    // 쪽지 보내기
    @Insert("INSERT INTO message (sender_id, sender_name, receiver_id, receiver_name, title, content, sent_at) VALUES (#{senderId}, #{senderName}, #{receiverId}, #{receiverName}, #{title}, #{content}, NOW())")
    void sendMessage(Message message);
    
    // 쪽지 상세 조회
    @Select("SELECT * FROM message WHERE message_id = #{messageId}")
    @Results({
      	 @Result(property = "messageId", column = "message_id"),
      	 @Result(property = "senderId", column = "sender_id"),
      	 @Result(property = "senderName", column = "sender_name"),
      	 @Result(property = "receiverId", column = "receiver_id"),
      	 @Result(property = "receiverName", column = "receiver_name"),
      	 @Result(property = "title", column = "title"),
      	 @Result(property = "content", column = "content"),
      	 @Result(property = "sentAt", column = "sent_at"),
      	 @Result(property = "isRead", column = "is_read")
   	})
    Message findMessageById(int messageId);
    
    // 받은 쪽지 목록 조회
    @Select("SELECT * FROM message WHERE receiver_id = #{receiverId} ORDER BY sent_at DESC")
    @Results({
   	 @Result(property = "messageId", column = "message_id"),
   	 @Result(property = "senderId", column = "sender_id"),
   	 @Result(property = "senderName", column = "sender_name"),
   	 @Result(property = "receiverId", column = "receiver_id"),
   	 @Result(property = "receiverName", column = "receiver_name"),
   	 @Result(property = "title", column = "title"),
   	 @Result(property = "content", column = "content"),
   	 @Result(property = "sentAt", column = "sent_at"),
   	 @Result(property = "isRead", column = "is_read")
	})
    List<Message> getReceivedMessages(String receiverId);

    // 보낸 쪽지 목록 조회
    @Select("SELECT * FROM message WHERE sender_id = #{senderId} ORDER BY sent_at DESC")
    @Results({
    	 @Result(property = "messageId", column = "message_id"),
    	 @Result(property = "senderId", column = "sender_id"),
    	 @Result(property = "senderName", column = "sender_name"),
    	 @Result(property = "receiverId", column = "receiver_id"),
    	 @Result(property = "receiverName", column = "receiver_name"),
    	 @Result(property = "title", column = "title"),
    	 @Result(property = "content", column = "content"),
    	 @Result(property = "sentAt", column = "sent_at"),
    	 @Result(property = "isRead", column = "is_read")
	})
    List<Message> getSentMessages(String senderId);

    // 읽음 처리
    @Update("UPDATE message SET is_read = TRUE WHERE message_id = #{messageId}")
    void markAsRead(int messageId);

    // 쪽지 삭제
    @Delete("DELETE FROM message WHERE message_id = #{messageId}")
    void deleteMessage(int messageId);
    
    // 주소록 조회
    @Select("SELECT student_id as id, name, university, department, email, phone  FROM student UNION SELECT prof_id as id, name, university, department, email, phone FROM professor")
    List<AddressBook> getAddressBook();
}
