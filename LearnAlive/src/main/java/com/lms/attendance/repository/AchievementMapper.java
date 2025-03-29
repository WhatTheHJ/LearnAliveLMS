package com.lms.attendance.repository;

import org.apache.ibatis.annotations.Mapper;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

@Mapper
public interface AchievementMapper {

    // 특정 사용자가 작성한 게시물 수 조회
    @Select("SELECT COUNT(*) FROM Post WHERE author_id = #{userId}")
    int getPostCountByUser(@Param("userId") String userId);

    // 특정 사용자가 작성한 게시물의 총 좋아요 수 조회
    @Select("SELECT IFNULL(SUM(likes), 0) FROM Post WHERE author_id = #{userId}")
    int getTotalLikesByUser(@Param("userId") String userId);
    
    // 특정 사용자가 작성한 게시물의 총 조회수 조회
    @Select("SELECT IFNULL(SUM(view), 0) FROM Post WHERE author_id = #{userId}")
    int getTotalViewsByUser(@Param("userId") String userId);
}