package com.korea.attendance.model;

import java.sql.Timestamp;

public class Post {
	private Integer postId; // PK
	private Integer boardId; // 게시판 ID (Foreign Key)
	private String authorId;
	private String authorRole;
	private String author;
	private String title;
	private String content;
	private Timestamp createdAt;
	private Integer view;
	private Integer likes;
	private Timestamp updatedAt;
	private String likedByUser;
	private String filePath;     
}
