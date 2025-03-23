package com.lms.attendance.model;

import lombok.Data;

@Data
public class ClassDetail {
    private int classId;
    private String className;
    private String profId;
    private String professorName;
    private String professorEmail;
}
