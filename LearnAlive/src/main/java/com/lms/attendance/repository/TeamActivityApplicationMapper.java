package com.lms.attendance.repository;

import org.apache.ibatis.annotations.*;
import com.lms.attendance.model.TeamActivityApplication;
import java.util.List;

@Mapper
public interface TeamActivityApplicationMapper {

    @Insert("""
            INSERT INTO team_activity_application (post_id, applicant_student_id, status)
            VALUES (#{postId}, #{applicantStudentId}, #{status})
            """)
    @Options(useGeneratedKeys = true, keyProperty = "applicationId")
    void applyForTeamActivity(TeamActivityApplication application);

    @Update("""
            UPDATE team_activity_application
            SET status = #{status}
            WHERE application_id = #{applicationId}
            """)
    void updateApplicationStatus(@Param("applicationId") int applicationId, @Param("status") String status);

    @Select("SELECT * FROM team_activity_application WHERE post_id = #{postId}")
    @Results(id = "TeamActivityApplicationResult", value = {
      @Result(column = "application_id", property = "applicationId"),
      @Result(column = "post_id", property = "postId"),
      @Result(column = "applicant_student_id", property = "applicantStudentId"),
      @Result(column = "status", property = "status"),
      @Result(column = "applied_at", property = "appliedAt")
    })
    List<TeamActivityApplication> getApplicationsByPostId(int postId);

    @Select("SELECT * FROM team_activity_application WHERE application_id = #{applicationId}")
    @ResultMap("TeamActivityApplicationResult")
    TeamActivityApplication getApplicationById(int applicationId);
}