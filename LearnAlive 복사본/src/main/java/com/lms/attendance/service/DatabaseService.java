package com.lms.attendance.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;

import com.lms.attendance.repository.DatabaseMapper;

@Service
public class DatabaseService {

    private final DatabaseMapper databaseMapper;

    public DatabaseService(DatabaseMapper databaseMapper) {
        this.databaseMapper = databaseMapper;
    }

    public List<Map<String, Object>> getProcessList() {
        return databaseMapper.getProcessList();
    }

    public void killConnection(int id) {
        databaseMapper.killConnection(id);
    }
}