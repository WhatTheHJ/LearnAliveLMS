package com.lms.attendance.repository;

import org.apache.ibatis.annotations.Select;
import org.apache.ibatis.annotations.Update;
import java.util.List;
import java.util.Map;

public interface DatabaseMapper {
    
    @Select("SHOW PROCESSLIST;")
    List<Map<String, Object>> getProcessList();

    @Update("KILL #{id}")
    void killConnection(int id);
}