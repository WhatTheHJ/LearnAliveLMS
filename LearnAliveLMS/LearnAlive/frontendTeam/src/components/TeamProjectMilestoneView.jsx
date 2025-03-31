// import React, { useState, useEffect } from "react";
// import { getCommonMilestonesForPost, updatePostMilestoneStatus } from "../api/milestoneApi";
// import TeamProjectMilestones from "./TeamProjectMilestones";
// import { useAuth } from "../context/AuthContext";

// const TeamProjectMilestoneView = ({ classId, postId, post, onBack }) => {
//   const [milestones, setMilestones] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { user } = useAuth();

//   // 마일스톤 목록 불러오기
//   const fetchMilestones = async () => {
//     try {
//       const data = await getCommonMilestonesForPost(classId, postId);
//       setMilestones(data);
//     } catch (err) {
//       console.error("마일스톤 조회 오류:", err);
//       setError("마일스톤 데이터를 불러오는 중 오류 발생");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMilestones();
//   }, [classId, postId]);

//   // 마일스톤 상태를 completed로 변경
//   const handleCompleteMilestone = async (milestoneId) => {
//     try {
//       await updatePostMilestoneStatus(postId, milestoneId, "completed");
//       fetchMilestones();
//     } catch (err) {
//       console.error("마일스톤 완료 업데이트 오류:", err);
//       setError("마일스톤 상태 업데이트 중 오류 발생");
//     }
//   };

//   // 마일스톤 상태를 pending으로 되돌리기 (완료 취소)
//   const handleRevertMilestone = async (milestoneId) => {
//     try {
//       await updatePostMilestoneStatus(postId, milestoneId, "pending");
//       fetchMilestones();
//     } catch (err) {
//       console.error("마일스톤 되돌리기 오류:", err);
//       setError("마일스톤 상태 되돌리는 중 오류 발생");
//     }
//   };

//   if (loading) return <p>마일스톤 데이터를 불러오는 중...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div>
//       <h3>팀 프로젝트 마일스톤</h3>
      
//       {/* 게이지 바 표시 */}
//       <TeamProjectMilestones milestones={milestones} />

//       {/* 마일스톤 목록 + 상태 변경 버튼 */}
//       <ul>
//         {milestones.map((m) => {
//           const milestoneId = m.milestoneId || m.milestone_id;
//           const isCompleted = m.status === "completed";
//           const isAuthor = user?.userId === post.authorId; // 조장 여부

//           return (
//             <li key={milestoneId}>
//               <strong>{m.title}</strong> - {m.status}
//               {m.dueDate || m.due_date ? ` (Due: ${m.dueDate || m.due_date})` : ""}

//               {/* 조장이면서 미완료 상태인 경우 → 완료 버튼 */}
//               {isAuthor && !isCompleted && (
//                 <button
//                   style={{ marginLeft: "0.5rem" }}
//                   onClick={() => handleCompleteMilestone(milestoneId)}
//                 >
//                   완료
//                 </button>
//               )}

//               {/* 조장이면서 이미 완료된 경우 → 완료 취소(되돌리기) 버튼 */}
//               {isAuthor && isCompleted && (
//                 <button
//                   style={{ marginLeft: "0.5rem" }}
//                   onClick={() => handleRevertMilestone(milestoneId)}
//                 >
//                   취소
//                 </button>
//               )}
//             </li>
//           );
//         })}
//       </ul>

//       <button onClick={onBack} style={{ marginTop: "1rem" }}>
//         뒤로가기
//       </button>
//     </div>
//   );
// };

// export default TeamProjectMilestoneView;











// import React, { useState, useEffect } from "react";
// import { getCommonMilestonesForPost, updatePostMilestoneStatus } from "../api/milestoneApi";
// import TeamProjectMilestones from "./TeamProjectMilestones";
// import { useAuth } from "../context/AuthContext";

// // ✅ 아래 임포트 추가: CSS 파일
// import "../styles/ProjectMilestones.css";

// const TeamProjectMilestoneView = ({ classId, postId, post, onBack }) => {
//   const [milestones, setMilestones] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState("");
//   const { user } = useAuth();

//   // 마일스톤 목록 불러오기
//   const fetchMilestones = async () => {
//     try {
//       const data = await getCommonMilestonesForPost(classId, postId);
//       setMilestones(data);
//     } catch (err) {
//       console.error("마일스톤 조회 오류:", err);
//       setError("마일스톤 데이터를 불러오는 중 오류 발생");
//     } finally {
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     fetchMilestones();
//     // eslint-disable-next-line
//   }, [classId, postId]);

//   // 마일스톤 상태를 completed로 변경
//   const handleCompleteMilestone = async (milestoneId) => {
//     try {
//       await updatePostMilestoneStatus(postId, milestoneId, "completed");
//       fetchMilestones();
//     } catch (err) {
//       console.error("마일스톤 완료 업데이트 오류:", err);
//       setError("마일스톤 상태 업데이트 중 오류 발생");
//     }
//   };

//   // 마일스톤 상태를 pending으로 되돌리기 (완료 취소)
//   const handleRevertMilestone = async (milestoneId) => {
//     try {
//       await updatePostMilestoneStatus(postId, milestoneId, "pending");
//       fetchMilestones();
//     } catch (err) {
//       console.error("마일스톤 되돌리기 오류:", err);
//       setError("마일스톤 상태 되돌리는 중 오류 발생");
//     }
//   };

//   if (loading) return <p>마일스톤 데이터를 불러오는 중...</p>;
//   if (error) return <p style={{ color: "red" }}>{error}</p>;

//   return (
//     <div>
//       <h3>팀 프로젝트 마일스톤</h3>

//       {/* 게이지 바 표시 */}
//       <TeamProjectMilestones milestones={milestones} />

//       {/* 마일스톤 목록 + 상태 변경 버튼 */}
//       {/* ✅ 여기서 className="milestones-list" 적용 */}
//       <ul className="milestones-list">
//         {milestones.map((m) => {
//           const milestoneId = m.milestoneId || m.milestone_id;
//           const isCompleted = m.status === "completed";
//           const isAuthor = user?.userId === post.authorId; // 조장 여부

//           return (
//             <li key={milestoneId}>
//               <strong>{m.title}</strong> - {m.status}
//               {m.dueDate || m.due_date ? ` (Due: ${m.dueDate || m.due_date})` : ""}

//               {/* 조장이면서 미완료 상태인 경우 → 완료 버튼 */}
//               {isAuthor && !isCompleted && (
//                 <button
//                   className="complete-btn"
//                   onClick={() => handleCompleteMilestone(milestoneId)}
//                 >
//                   완료
//                 </button>
//               )}

//               {/* 조장이면서 이미 완료된 경우 → 완료 취소(되돌리기) 버튼 */}
//               {isAuthor && isCompleted && (
//                 <button
//                   className="revert-btn"
//                   onClick={() => handleRevertMilestone(milestoneId)}
//                 >
//                   취소
//                 </button>
//               )}
//             </li>
//           );
//         })}
//       </ul>

//       <button onClick={onBack} style={{ marginTop: "1rem" }}>
//         뒤로가기
//       </button>
//     </div>
//   );
// };

// export default TeamProjectMilestoneView;









import React, { useState, useEffect } from "react";
import { getCommonMilestonesForPost, updatePostMilestoneStatus } from "../api/milestoneApi";
import TeamProjectMilestones from "./TeamProjectMilestones";
import { useAuth } from "../context/AuthContext";
import "../styles/ProjectMilestones.css"; // CSS 파일 임포트

// 날짜 포맷 함수
const formatDueDate = (dateString) => {
  if (!dateString) return "";
  const date = new Date(dateString);
  const year = date.getFullYear();
  const month = date.getMonth() + 1; // 월은 0부터 시작
  const day = date.getDate();
  const hour = date.getHours();
  const minute = date.getMinutes();
  return `${year}년 ${month}월 ${day}일 ${hour}시 ${minute}분`;
};

const TeamProjectMilestoneView = ({ classId, postId, post, onBack }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const { user } = useAuth();

  // 마일스톤 목록 불러오기
  const fetchMilestones = async () => {
    try {
      const data = await getCommonMilestonesForPost(classId, postId);
      setMilestones(data);
    } catch (err) {
      console.error("마일스톤 조회 오류:", err);
      setError("마일스톤 데이터를 불러오는 중 오류 발생");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMilestones();
    // eslint-disable-next-line
  }, [classId, postId]);

  // 마일스톤 상태를 completed로 변경
  const handleCompleteMilestone = async (milestoneId) => {
    try {
      await updatePostMilestoneStatus(postId, milestoneId, "completed");
      fetchMilestones();
    } catch (err) {
      console.error("마일스톤 완료 업데이트 오류:", err);
      setError("마일스톤 상태 업데이트 중 오류 발생");
    }
  };

  // 마일스톤 상태를 pending으로 되돌리기 (완료 취소)
  const handleRevertMilestone = async (milestoneId) => {
    try {
      await updatePostMilestoneStatus(postId, milestoneId, "pending");
      fetchMilestones();
    } catch (err) {
      console.error("마일스톤 되돌리기 오류:", err);
      setError("마일스톤 상태 되돌리는 중 오류 발생");
    }
  };

  // 상태 라벨 한글 변환 함수
  const getStatusLabel = (status) => {
    switch (status) {
      case "completed":
        return "완료";
      case "pending":
        return "미완료";
      case "in-progress":
        return "진행 중";
      default:
        return status;
    }
  };

  if (loading) return <p>마일스톤 데이터를 불러오는 중...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div>
      <h3>팀 프로젝트 마일스톤</h3>

      {/* 게이지 바 표시 */}
      <TeamProjectMilestones milestones={milestones} />

      {/* 마일스톤 목록 + 상태 변경 버튼 */}
      <ul className="milestones-list">
        {milestones.map((m) => {
          const milestoneId = m.milestoneId || m.milestone_id;
          const isAuthor = user?.userId === post.authorId; // 조장 여부
          const statusLabel = getStatusLabel(m.status);
          const dueFormatted = formatDueDate(m.dueDate || m.due_date);

          return (
            <li key={milestoneId} className="milestone-item">
              <div className="milestone-title">{m.title}</div>
              <div className="milestone-status">
                <span className={`status-badge ${m.status}`}>
                  {statusLabel}
                </span>
              </div>
              <div className="milestone-due">{dueFormatted}</div>
              <div className="milestone-actions">
                {isAuthor && m.status === "pending" && (
                  <button
                    className="complete-btn"
                    onClick={() => handleCompleteMilestone(milestoneId)}
                  >
                    완료
                  </button>
                )}
                {isAuthor && m.status === "completed" && (
                  <button
                    className="revert-btn"
                    onClick={() => handleRevertMilestone(milestoneId)}
                  >
                    취소
                  </button>
                )}
              </div>
            </li>
          );
        })}
      </ul>

      <button onClick={onBack} style={{ marginTop: "1rem" }}>
        뒤로가기
      </button>
    </div>
  );
};

export default TeamProjectMilestoneView;
