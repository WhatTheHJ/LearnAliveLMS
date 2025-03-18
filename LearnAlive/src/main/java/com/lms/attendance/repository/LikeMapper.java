package com.lms.attendance.repository;

import org.apache.ibatis.annotations.Delete;
import org.apache.ibatis.annotations.Insert;
import org.apache.ibatis.annotations.Param;
import org.apache.ibatis.annotations.Select;

public interface LikeMapper {
	
	  // 특정 게시글에 특정 유저가 좋아요를 눌렀는지 확인
    @Select("SELECT COUNT(*) > 0 FROM likes WHERE post_id = #{postId} AND user_id = #{userId}")
    boolean isLiked(@Param("postId") int postId, @Param("userId") String userId);
    
    @Select("SELECT post_id, SUM(likes) AS total_likes " +
            "FROM post " +
            "WHERE post_id = #{postId} " +
            "GROUP BY post_id")
    void totallikes(@Param("postId") int postId);


    // 좋아요 추가
    @Insert("INSERT INTO likes (post_id, user_id) VALUES (#{postId}, #{userId})")
    void addLike(@Param("postId") int postId, @Param("userId") String userId);

    // 좋아요 제거
    @Delete("DELETE FROM likes WHERE post_id = #{postId} AND user_id = #{userId}")
    void removeLike(@Param("postId") int postId, @Param("userId") String userId);

}
