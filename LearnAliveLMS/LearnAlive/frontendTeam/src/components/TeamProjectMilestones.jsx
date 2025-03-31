// src/components/TeamProjectMilestones.jsx
import React from "react";
import "../styles/ProjectMilestones.css";

const TeamProjectMilestones = ({ milestones }) => {
  // 완료된 마일스톤 수 계산
  const total = milestones.length;
  const completed = milestones.filter(m => m.status === "completed").length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  return (
    <div className="milestones-container">
      <h2>프로젝트 진행률</h2>
      <div className="progress-bar">
        <div
          className="progress-bar-fill"
          style={{ width: `${progressPercent}%` }}
        ></div>
      </div>
      <p>
        {completed} / {total} 팀 과제 달성률 ({progressPercent}%)
      </p>
      {/* ❌ 목록은 여기서 렌더링하지 않음 → 중복 방지 */}
    </div>
  );
};

export default TeamProjectMilestones;
