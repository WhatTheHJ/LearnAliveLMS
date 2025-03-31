//package com.lms.attendance.service;
//
//import com.lms.attendance.model.TeamPostMilestoneStatus;
//import com.lms.attendance.repository.TeamPostMilestoneStatusMapper;
//import org.springframework.stereotype.Service;
//import org.springframework.transaction.annotation.Transactional;
//
//@Service
//public class TeamPostMilestoneStatusService {
//
//    private final TeamPostMilestoneStatusMapper mapper;
//
//    public TeamPostMilestoneStatusService(TeamPostMilestoneStatusMapper mapper) {
//        this.mapper = mapper;
//    }
//
//    @Transactional
//    public void updateStatus(int postId, int milestoneId, String status) {
//        TeamPostMilestoneStatus existing = mapper.selectStatus(postId, milestoneId);
//        if(existing == null) {
//           TeamPostMilestoneStatus newStatus = new TeamPostMilestoneStatus();
//            newStatus.setPostId(postId);
//            newStatus.setMilestoneId(milestoneId);
//            newStatus.setStatus(status);
//            mapper.insertStatus(newStatus);
//        } else {
//            existing.setStatus(status);
//            mapper.updateStatus(existing);
//        }
//    }
//}






package com.lms.attendance.service;

import com.lms.attendance.model.TeamPostMilestoneStatus;
import com.lms.attendance.repository.TeamPostMilestoneStatusMapper;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

@Service
public class TeamPostMilestoneStatusService {

    private final TeamPostMilestoneStatusMapper mapper;

    public TeamPostMilestoneStatusService(TeamPostMilestoneStatusMapper mapper) {
        this.mapper = mapper;
    }

//    @Transactional
//    public void updateStatus(int postId, int milestoneId, String status) {
//        TeamPostMilestoneStatus existing = mapper.selectStatus(postId, milestoneId);
//        if(existing == null) {
//            TeamPostMilestoneStatus newStatus = new TeamPostMilestoneStatus();
//            newStatus.setPostId(postId);
//            newStatus.setMilestoneId(milestoneId);
//            newStatus.setStatus(status);
//            mapper.insertStatus(newStatus);
//        } else {
//            existing.setStatus(status);
//            mapper.updateStatus(existing);
//        }
//    }
    
    @Transactional
    public void updateStatus(int postId, int milestoneId, String status) {
        TeamPostMilestoneStatus existing = mapper.selectStatus(postId, milestoneId);
        if(existing == null) {
            TeamPostMilestoneStatus newStatus = new TeamPostMilestoneStatus();
            newStatus.setPostId(postId);
            newStatus.setMilestoneId(milestoneId);
            newStatus.setStatus(status);
            mapper.insertStatus(newStatus);
        } else {
            // 직접 매퍼의 updateStatus 메서드 호출
            mapper.updateStatus(postId, milestoneId, status);
        }
    }
    
    
}


