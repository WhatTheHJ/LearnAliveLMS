package com.lms.attendance.repository;

import com.lms.attendance.model.Notice;
import org.apache.ibatis.annotations.*;

import java.util.List;

@Mapper
public interface NoticeMapper {

    @Select("SELECT * FROM notice ORDER BY created_at DESC")
    List<Notice> getAllNotices();

    @Insert("INSERT INTO notice (title, content) VALUES (#{title}, #{content})")
    @Options(useGeneratedKeys = true, keyProperty = "notice_id") // noticeId -> notice_id로 변경
    void createNotice(Notice notice);

    @Update("UPDATE notice SET title = #{title}, content = #{content} WHERE notice_id = #{notice_id}") // noticeId -> notice_id로 변경
    void updateNotice(Notice notice);

    @Delete("DELETE FROM notice WHERE notice_id = #{notice_id}") // noticeId -> notice_id로 변경
    void deleteNotice(int notice_id); // noticeId -> notice_id로 변경

    // 단일 공지사항 조회 메소드 추가
    @Select("SELECT * FROM notice WHERE notice_id = #{notice_id}")
    Notice getNoticeById(int notice_id);  // notice_id로 공지사항을 조회
}