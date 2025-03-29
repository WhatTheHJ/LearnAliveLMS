package com.lms.attendance.model;

import java.time.LocalDateTime;

import lombok.Data;

@Data
public class Message {
	 	private int messageId;
	 	private String senderId;
	    private String senderName;
	    private String receiverId;
	    private String receiverName;
	    private String title;
	    private String content;
	    private LocalDateTime sentAt;
	    private boolean isRead;
}
