package com.lms.attendance.controller;

import java.util.List;

import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.lms.attendance.model.AlarmList;
import com.lms.attendance.service.AlarmListService;

import lombok.RequiredArgsConstructor;

@RestController
@RequestMapping("/api/alarms")
@RequiredArgsConstructor
public class AlarmListController {

    private final AlarmListService alarmListService;

    @GetMapping("/{userId}")
    public List<AlarmList> getUserAlarms(@PathVariable("userId") String userId) {
        return alarmListService.getUserAlarms(userId);
    }
}