package com.lms.attendance.repository;

import java.util.List;
import org.apache.ibatis.annotations.*;
import com.lms.attendance.model.TeamActivityComment;

@Mapper
public interface TeamActivityCommentMapper {

    @Insert("""
            INSERT INTO team_activity_comment (post_id, commenter_id, content)
            VALUES (#{postId}, #{commenterId}, #{content})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "commentId")
    void addComment(TeamActivityComment comment);

    @Select("SELECT * FROM team_activity_comment WHERE post_id = #{postId} ORDER BY created_at ASC")
    @Results(id = "TeamActivityCommentResult", value = {
      @Result(column = "comment_id", property = "commentId"),
      @Result(column = "post_id", property = "postId"),
      @Result(column = "commenter_id", property = "commenterId"),
      @Result(column = "content", property = "content"),
      @Result(column = "created_at", property = "createdAt")
    })
    List<TeamActivityComment> getCommentsByPostId(int postId);
}