package com.lms.attendance.model;

import lombok.Data;

@Data
public class ClassSettings {
	private int classId;
    private String startTime;
    private String endTime;
    private String presentStart;
    private String presentEnd;
    private String lateEnd;
}
