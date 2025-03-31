package com.lms.attendance.model;

import lombok.*;

@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class University {
    private Integer universityId;
    private String universityName;
}