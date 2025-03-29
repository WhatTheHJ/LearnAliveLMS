package com.lms.attendance.model;
 
 import lombok.*;
 
 @Data
 @NoArgsConstructor
 @AllArgsConstructor
 @Builder
 public class Department {
     private Integer departmentId;
     private String departmentName;
     private Integer universityId;
 }