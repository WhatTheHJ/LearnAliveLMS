package com.lms.attendance.model;

import lombok.Data;

@Data
public class Board {
	
	private Integer boardId;
	private Integer classId; //fk
	private String boardName;
	private Integer isDefault;

}


