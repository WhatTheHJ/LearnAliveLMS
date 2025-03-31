//package com.lms.attendance.model;
//
//import lombok.Data;
//import java.time.LocalDateTime;
//
//@Data
//public class TeamClassMilestone {
//    private int milestoneId;
//    private int classId;
//    private String title;
//    private LocalDateTime dueDate;
//    private LocalDateTime createdAt;
//    private LocalDateTime updatedAt;
//}


package com.lms.attendance.model;

import lombok.Data;
import java.time.LocalDateTime;

@Data
public class TeamClassMilestone {
    private int milestoneId;
    private int classId;
    private String title;
    private LocalDateTime dueDate;
    // 만약 createdAt, updatedAt 값을 사용하고 싶다면
    private LocalDateTime createdAt;
    private LocalDateTime updatedAt;
}
