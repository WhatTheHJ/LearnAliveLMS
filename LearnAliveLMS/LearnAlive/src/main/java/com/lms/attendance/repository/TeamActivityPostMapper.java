package com.lms.attendance.repository;

import org.apache.ibatis.annotations.*;
import com.lms.attendance.model.TeamActivityPost;
import java.util.List;

@Mapper
public interface TeamActivityPostMapper {

    @Insert("""
            INSERT INTO team_activity_post 
            (class_id, title, content, author_id, author_name, department, email, contact, likes, team_members)
            VALUES (#{classId}, #{title}, #{content}, #{authorId}, #{authorName}, #{department}, #{email}, #{contact}, #{likes}, #{teamMembers, typeHandler=com.lms.attendance.typehandler.ListToJsonTypeHandler})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "postId")
    void createPost(TeamActivityPost post);

    @Select("SELECT * FROM team_activity_post ORDER BY created_at DESC")
    @Results(id = "TeamActivityPostResult", value = {
      @Result(column = "post_id", property = "postId"),
      @Result(column = "class_id", property = "classId"),
      @Result(column = "title", property = "title"),
      @Result(column = "content", property = "content"),
      @Result(column = "author_id", property = "authorId"),
      @Result(column = "author_name", property = "authorName"),
      @Result(column = "department", property = "department"),
      @Result(column = "email", property = "email"),
      @Result(column = "contact", property = "contact"),
      @Result(column = "likes", property = "likes"),
      @Result(column = "team_members", property = "teamMembers", typeHandler = com.lms.attendance.typehandler.ListToJsonTypeHandler.class),
      @Result(column = "created_at", property = "createdAt"),
      @Result(column = "updated_at", property = "updatedAt")
    })
    List<TeamActivityPost> getAllPosts();

    @Select("SELECT * FROM team_activity_post WHERE post_id = #{postId}")
    @ResultMap("TeamActivityPostResult")
    TeamActivityPost getPostById(int postId);
    
    @Select("SELECT * FROM team_activity_post WHERE class_id = #{classId} ORDER BY created_at DESC")
    @ResultMap("TeamActivityPostResult")
    List<TeamActivityPost> getPostsByClassId(int classId);

    @Delete("DELETE FROM team_activity_post WHERE post_id = #{postId}")
    void deletePost(int postId);
    
    @Update("UPDATE team_activity_post SET team_members = #{teamMembers, typeHandler=com.lms.attendance.typehandler.ListToJsonTypeHandler} WHERE post_id = #{postId}")
    void updateTeamMembers(@Param("postId") int postId, @Param("teamMembers") List<String> teamMembers);
    
    @Update("UPDATE team_activity_post SET likes = GREATEST(likes + #{increment}, 0) WHERE post_id = #{postId}")
    void updateLikeCount(@Param("postId") int postId, @Param("increment") int increment);
}