package com.lms.attendance.model;

import lombok.Data;

import java.sql.Timestamp;

@Data
public class ExamBoard {
    private int boardId;
    private int classId;
    private String boardName;
    private Timestamp createdAt;
    private Timestamp updatedAt;
}
