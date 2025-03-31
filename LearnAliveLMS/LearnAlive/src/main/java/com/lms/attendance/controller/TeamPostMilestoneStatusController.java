// PostMilestoneStatusController.java
package com.lms.attendance.controller;

import com.lms.attendance.service.TeamPostMilestoneStatusService;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/post-milestone-status")
public class TeamPostMilestoneStatusController {

    private final TeamPostMilestoneStatusService postMilestoneStatusService;

    public TeamPostMilestoneStatusController(TeamPostMilestoneStatusService postMilestoneStatusService) {
        this.postMilestoneStatusService = postMilestoneStatusService;
    }

    // 특정 게시글(postId)과 마일스톤(milestoneId)의 상태 업데이트 (예: 'completed')
    @PutMapping("/{postId}/{milestoneId}")
    public ResponseEntity<Void> updateStatus(@PathVariable int postId,
                                             @PathVariable int milestoneId,
                                             @RequestParam String status) {
        postMilestoneStatusService.updateStatus(postId, milestoneId, status);
        return ResponseEntity.ok().build();
    }
}
