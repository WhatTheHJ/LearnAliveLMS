//package com.lms.attendance.repository;
//
//import com.lms.attendance.model.TeamPostMilestoneStatus;
//import org.apache.ibatis.annotations.*;
//
//@Mapper
//public interface TeamPostMilestoneStatusMapper {
//
//    @Select("SELECT * FROM post_milestone_status WHERE post_id = #{postId} AND milestone_id = #{milestoneId}")
//   TeamPostMilestoneStatus selectStatus(@Param("postId") int postId, @Param("milestoneId") int milestoneId);
//
//    @Insert("INSERT INTO post_milestone_status (post_id, milestone_id, status) VALUES (#{postId}, #{milestoneId}, #{status})")
//    @Options(useGeneratedKeys = true, keyProperty = "statusId")
//    void insertStatus(TeamPostMilestoneStatus status);
//
//    @Update("UPDATE post_milestone_status SET status = #{status}, updated_at = CURRENT_TIMESTAMP WHERE post_id = #{postId} AND milestone_id = #{milestoneId}")
//    void updateStatus(TeamPostMilestoneStatus status);
//}


package com.lms.attendance.repository;

import com.lms.attendance.model.TeamPostMilestoneStatus;
import org.apache.ibatis.annotations.*;

@Mapper
public interface TeamPostMilestoneStatusMapper {

    @Select("SELECT * FROM post_milestone_status WHERE post_id = #{postId} AND milestone_id = #{milestoneId}")
    TeamPostMilestoneStatus selectStatus(@Param("postId") int postId, @Param("milestoneId") int milestoneId);

    @Insert("INSERT INTO post_milestone_status (post_id, milestone_id, status) VALUES (#{postId}, #{milestoneId}, #{status})")
    @Options(useGeneratedKeys = true, keyProperty = "statusId")
    void insertStatus(TeamPostMilestoneStatus status);

//    @Update("UPDATE post_milestone_status SET status = #{status}, updated_at = CURRENT_TIMESTAMP WHERE post_id = #{postId} AND milestone_id = #{milestoneId}")
//    void updateStatus(TeamPostMilestoneStatus status);
//}
    @Update("UPDATE post_milestone_status SET status = #{status}, updated_at = CURRENT_TIMESTAMP WHERE post_id = #{postId} AND milestone_id = #{milestoneId}")
    void updateStatus(@Param("postId") int postId, @Param("milestoneId") int milestoneId, @Param("status") String status);
}