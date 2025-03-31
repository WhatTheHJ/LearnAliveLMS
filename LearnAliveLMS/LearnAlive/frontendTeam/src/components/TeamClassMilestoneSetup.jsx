// import React, { useState, useEffect } from "react";
// import { getClassMilestones, createClassMilestones, updateClassMilestone, deleteClassMilestone } from "../api/milestoneApi";
// import "../styles/ProjectMilestones.css";

// const TeamClassMilestoneSetup = ({ classId, onBack, onSetupComplete }) => {
//   // 마일스톤 배열 (초기값은 빈 배열)
//   const [milestones, setMilestones] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   useEffect(() => {
//     if (!classId) return;
//     loadExistingMilestones();
//   }, [classId]);

//   const loadExistingMilestones = async () => {
//     setLoading(true);
//     try {
//       const data = await getClassMilestones(classId);
//       const converted = data.map(m => ({
//         milestoneId: m.milestoneId,
//         title: m.title,
//         dueDate: m.dueDate ? m.dueDate.replace(" ", "T") : "",
//         status: "pending"
//       }));
//       setMilestones(converted);
//     } catch (error) {
//       console.error("기존 마일스톤 불러오기 오류:", error);
//       setErrorMessage("기존 마일스톤을 불러오는 중 오류가 발생했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const total = milestones.length;
//   const completed = milestones.filter((m) => m.status === "completed").length;
//   const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

//   const handleMilestoneChange = (index, field, value) => {
//     const newList = [...milestones];
//     newList[index][field] = value;
//     setMilestones(newList);
//   };

//   const addMilestone = () => {
//     setMilestones([...milestones, { title: "", dueDate: "", status: "pending" }]);
//   };

//   // 삭제 함수: 새 항목은 그냥 로컬 삭제, 기존 항목은 API 호출 후 상태 업데이트
//   const handleRemoveMilestone = async (index) => {
//     const milestone = milestones[index];
//     if (milestone.milestoneId) {
//       try {
//         setLoading(true);
//         await deleteClassMilestone(milestone.milestoneId);
//         // 삭제 후 다시 로드하거나, 로컬 상태 업데이트
//         setMilestones(milestones.filter((_, i) => i !== index));
//       } catch (error) {
//         console.error("마일스톤 삭제 오류:", error);
//         setErrorMessage("마일스톤 삭제 중 오류가 발생했습니다.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       // 아직 DB에 저장되지 않은 새 항목은 로컬에서만 제거
//       setMilestones(milestones.filter((_, i) => i !== index));
//     }
//   };

//   const handleUpdateMilestone = async (index) => {
//     const milestone = milestones[index];
//     if (!milestone.milestoneId) {
//       alert("새로 추가된 항목은 '설정 저장' 버튼으로 처리해주세요.");
//       return;
//     }
//     try {
//       setLoading(true);
//       await updateClassMilestone(milestone.milestoneId, {
//         title: milestone.title,
//         dueDate: milestone.dueDate
//       });
//       alert("수정되었습니다.");
//     } catch (error) {
//       console.error("마일스톤 수정 오류:", error);
//       setErrorMessage("마일스톤 수정 중 오류가 발생했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     if (!classId) {
//       setErrorMessage("Class ID가 유효하지 않습니다.");
//       return;
//     }
//     setLoading(true);
//     try {
//       const newMilestones = milestones.filter(m => !m.milestoneId);
//       if (newMilestones.length > 0) {
//         await createClassMilestones(classId, newMilestones);
//       }
//       onSetupComplete();
//     } catch (error) {
//       console.error("공통 마일스톤 설정 오류:", error);
//       setErrorMessage("설정 중 오류가 발생했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="milestones-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
//       <h2>팀 프로젝트 마일스톤 설정</h2>

//       <div className="progress-bar" style={{ marginBottom: "1rem" }}>
//         <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
//       </div>
//       <p>
//         {completed} / {total} 마일스톤 완료 ({progressPercent}%)
//       </p>

//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

//       {loading ? (
//         <p>불러오는 중...</p>
//       ) : (
//         <form onSubmit={handleSubmit}>
//           {milestones.map((ms, index) => (
//             <div
//               key={index}
//               style={{
//                 border: "1px solid #ccc",
//                 padding: "0.75rem",
//                 marginBottom: "0.75rem",
//                 borderRadius: "5px"
//               }}
//             >
//               <label style={{ display: "block", marginBottom: "0.5rem" }}>
//                 마일스톤 제목:
//                 <input
//                   type="text"
//                   placeholder="예: 1. 팀원모집 / 2. 기획"
//                   value={ms.title}
//                   onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
//                   required
//                   style={{ marginLeft: "0.5rem" }}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: "0.5rem" }}>
//                 Due Date:
//                 <input
//                   type="datetime-local"
//                   value={ms.dueDate}
//                   onChange={(e) => handleMilestoneChange(index, "dueDate", e.target.value)}
//                   required
//                   style={{ marginLeft: "0.5rem" }}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: "0.5rem" }}>
//                 상태:
//                 <select
//                   value={ms.status}
//                   onChange={(e) => handleMilestoneChange(index, "status", e.target.value)}
//                   style={{ marginLeft: "0.5rem" }}
//                 >
//                   <option value="pending">pending</option>
//                   <option value="in-progress">in-progress</option>
//                   <option value="completed">completed</option>
//                 </select>
//               </label>

//               <button
//                 type="button"
//                 onClick={() => handleRemoveMilestone(index)}
//                 style={{
//                   marginLeft: "0.5rem",
//                   backgroundColor: "red",
//                   color: "white",
//                   padding: "0.4rem 0.8rem",
//                   border: "none",
//                   cursor: "pointer"
//                 }}
//               >
//                 삭제
//               </button>

//               {ms.milestoneId && (
//                 <button
//                   type="button"
//                   onClick={() => handleUpdateMilestone(index)}
//                   style={{
//                     marginLeft: "0.5rem",
//                     backgroundColor: "blue",
//                     color: "#fff",
//                     padding: "0.4rem 0.8rem",
//                     border: "none",
//                     cursor: "pointer"
//                   }}
//                 >
//                   수정
//                 </button>
//               )}
//             </div>
//           ))}

//           <button
//             type="button"
//             onClick={addMilestone}
//             style={{
//               marginTop: "1rem",
//               backgroundColor: "#007bff",
//               color: "#fff",
//               padding: "0.5rem 1rem",
//               border: "none",
//               cursor: "pointer",
//               marginRight: "1rem"
//             }}
//           >
//             마일스톤 추가
//           </button>

//           <button
//             type="submit"
//             disabled={loading}
//             style={{
//               backgroundColor: "green",
//               color: "#fff",
//               padding: "0.5rem 1rem",
//               border: "none",
//               cursor: "pointer"
//             }}
//           >
//             {loading ? "저장 중..." : "설정 저장"}
//           </button>
//         </form>
//       )}

//       <button
//         onClick={onBack}
//         style={{
//           marginTop: "1rem",
//           backgroundColor: "#aaa",
//           color: "#fff",
//           padding: "0.5rem 1rem",
//           border: "none",
//           cursor: "pointer"
//         }}
//       >
//         뒤로가기
//       </button>
//     </div>
//   );
// };

// export default TeamClassMilestoneSetup;











// import React, { useState, useEffect } from "react";
// import { 
//   getClassMilestones, 
//   createClassMilestones, 
//   updateClassMilestone,
//   deleteClassMilestone
// } from "../api/milestoneApi";
// import "../styles/ProjectMilestones.css";

// const TeamClassMilestoneSetup = ({ classId, onBack, onSetupComplete }) => {
//   // 마일스톤 배열 (초기값은 빈 배열)
//   const [milestones, setMilestones] = useState([]);
//   const [loading, setLoading] = useState(false);
//   const [errorMessage, setErrorMessage] = useState("");

//   // 컴포넌트 마운트 시, 기존 마일스톤 불러오기
//   useEffect(() => {
//     if (!classId) return;
//     loadExistingMilestones();
//   }, [classId]);

//   // 기존 마일스톤 불러오기
//   const loadExistingMilestones = async () => {
//     setLoading(true);
//     try {
//       const data = await getClassMilestones(classId);
//       // dueDate가 'YYYY-MM-DD HH:mm:ss' 형태라면 datetime-local에 맞게 "T"로 교체
//       const converted = data.map(m => ({
//         milestoneId: m.milestoneId,
//         title: m.title,
//         dueDate: m.dueDate ? m.dueDate.replace(" ", "T") : "",
//         status: "pending" // DB에 상태 컬럼이 없으면 기본값 "pending"
//       }));
//       setMilestones(converted);
//     } catch (error) {
//       console.error("기존 마일스톤 불러오기 오류:", error);
//       setErrorMessage("기존 마일스톤을 불러오는 중 오류가 발생했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   const total = milestones.length;
//   const completed = milestones.filter(m => m.status === "completed").length;
//   const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

//   const handleMilestoneChange = (index, field, value) => {
//     const newList = [...milestones];
//     newList[index][field] = value;
//     setMilestones(newList);
//   };

//   const addMilestone = () => {
//     setMilestones([...milestones, { title: "", dueDate: "", status: "pending" }]);
//   };

//   // 신규 항목 등록
//   const handleRegisterMilestone = async (index) => {
//     const milestone = milestones[index];
//     try {
//       setLoading(true);
//       // 신규 항목은 create API로 등록 (단일 항목을 배열로 보내기)
//       const created = await createClassMilestones(classId, [milestone]);
//       alert("등록되었습니다.");
//       // 다시 전체 목록 불러오기
//       loadExistingMilestones();
//     } catch (error) {
//       console.error("마일스톤 등록 오류:", error);
//       setErrorMessage("마일스톤 등록 중 오류가 발생했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 기존 항목 수정
//   const handleUpdateMilestone = async (index) => {
//     const milestone = milestones[index];
//     if (!milestone.milestoneId) {
//       alert("등록되지 않은 항목은 '등록' 버튼으로 처리해주세요.");
//       return;
//     }
//     try {
//       setLoading(true);
//       await updateClassMilestone(milestone.milestoneId, {
//         title: milestone.title,
//         dueDate: milestone.dueDate
//       });
//       alert("수정되었습니다.");
//       // 필요시 목록을 다시 불러올 수 있습니다.
//       loadExistingMilestones();
//     } catch (error) {
//       console.error("마일스톤 수정 오류:", error);
//       setErrorMessage("마일스톤 수정 중 오류가 발생했습니다.");
//     } finally {
//       setLoading(false);
//     }
//   };

//   // 삭제 함수: DB에 저장된 항목은 API 호출, 신규 항목은 로컬 삭제
//   const handleRemoveMilestone = async (index) => {
//     const milestone = milestones[index];
//     if (milestone.milestoneId) {
//       try {
//         setLoading(true);
//         await deleteClassMilestone(milestone.milestoneId);
//         setMilestones(milestones.filter((_, i) => i !== index));
//       } catch (error) {
//         console.error("마일스톤 삭제 오류:", error);
//         setErrorMessage("마일스톤 삭제 중 오류가 발생했습니다.");
//       } finally {
//         setLoading(false);
//       }
//     } else {
//       setMilestones(milestones.filter((_, i) => i !== index));
//     }
//   };

//   return (
//     <div className="milestones-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
//       <h2>팀 프로젝트 마일스톤 설정</h2>

//       {/* 진행률 바 */}
//       <div className="progress-bar" style={{ marginBottom: "1rem" }}>
//         <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
//       </div>
//       <p>
//         {completed} / {total} 마일스톤 완료 ({progressPercent}%)
//       </p>

//       {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

//       {loading ? (
//         <p>불러오는 중...</p>
//       ) : (
//         <form onSubmit={(e) => e.preventDefault()}>
//           {milestones.map((ms, index) => (
//             <div
//               key={index}
//               style={{
//                 border: "1px solid #ccc",
//                 padding: "0.75rem",
//                 marginBottom: "0.75rem",
//                 borderRadius: "5px"
//               }}
//             >
//               <label style={{ display: "block", marginBottom: "0.5rem" }}>
//                 마일스톤 제목:
//                 <input
//                   type="text"
//                   placeholder="예: 1. 팀원모집 / 2. 기획"
//                   value={ms.title}
//                   onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
//                   required
//                   style={{ marginLeft: "0.5rem" }}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: "0.5rem" }}>
//                 Due Date:
//                 <input
//                   type="datetime-local"
//                   value={ms.dueDate}
//                   onChange={(e) => handleMilestoneChange(index, "dueDate", e.target.value)}
//                   required
//                   style={{ marginLeft: "0.5rem" }}
//                 />
//               </label>

//               <label style={{ display: "block", marginBottom: "0.5rem" }}>
//                 상태:
//                 <select
//                   value={ms.status}
//                   onChange={(e) => handleMilestoneChange(index, "status", e.target.value)}
//                   style={{ marginLeft: "0.5rem" }}
//                 >
//                   <option value="pending">pending</option>
//                   <option value="in-progress">in-progress</option>
//                   <option value="completed">completed</option>
//                 </select>
//               </label>

//               {ms.milestoneId ? (
//                 <>
//                   <button
//                     type="button"
//                     onClick={() => handleUpdateMilestone(index)}
//                     style={{
//                       backgroundColor: "blue",
//                       color: "#fff",
//                       padding: "0.4rem 0.8rem",
//                       border: "none",
//                       cursor: "pointer",
//                       marginRight: "0.5rem"
//                     }}
//                   >
//                     수정
//                   </button>
//                   <button
//                     type="button"
//                     onClick={() => handleRemoveMilestone(index)}
//                     style={{
//                       backgroundColor: "red",
//                       color: "#fff",
//                       padding: "0.4rem 0.8rem",
//                       border: "none",
//                       cursor: "pointer"
//                     }}
//                   >
//                     삭제
//                   </button>
//                 </>
//               ) : (
//                 <button
//                   type="button"
//                   onClick={() => handleRegisterMilestone(index)}
//                   style={{
//                     backgroundColor: "#4caf50",
//                     color: "#fff",
//                     padding: "0.4rem 0.8rem",
//                     border: "none",
//                     cursor: "pointer"
//                   }}
//                 >
//                   등록
//                 </button>
//               )}
//             </div>
//           ))}

//           {/* 마일스톤 추가 버튼 */}
//           <button
//             type="button"
//             onClick={addMilestone}
//             style={{
//               marginTop: "1rem",
//               backgroundColor: "#007bff",
//               color: "#fff",
//               padding: "0.5rem 1rem",
//               border: "none",
//               cursor: "pointer",
//               marginRight: "1rem"
//             }}
//           >
//             마일스톤 추가
//           </button>
//         </form>
//       )}

//       {/* 뒤로가기 버튼 */}
//       <button
//         onClick={onBack}
//         style={{
//           marginTop: "1rem",
//           backgroundColor: "#aaa",
//           color: "#fff",
//           padding: "0.5rem 1rem",
//           border: "none",
//           cursor: "pointer"
//         }}
//       >
//         뒤로가기
//       </button>
//     </div>
//   );
// };

// export default TeamClassMilestoneSetup;
//구현 완성된 코드였음






import React, { useState, useEffect } from "react";
import { getClassMilestones, createClassMilestones, updateClassMilestone, deleteClassMilestone } from "../api/milestoneApi";
import "../styles/ProjectMilestones.css";

const TeamClassMilestoneSetup = ({ classId, onBack, onSetupComplete }) => {
  const [milestones, setMilestones] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  // 컴포넌트 마운트 시, 기존 마일스톤 불러오기
  useEffect(() => {
    if (!classId) return;
    loadExistingMilestones();
  }, [classId]);

  const loadExistingMilestones = async () => {
    setLoading(true);
    try {
      const data = await getClassMilestones(classId);
      const converted = data.map(m => ({
        milestoneId: m.milestoneId,
        title: m.title,
        dueDate: m.dueDate ? m.dueDate.replace(" ", "T") : "",
        status: "pending"  // DB에 상태 컬럼이 없으면 기본값 "pending"
      }));
      setMilestones(converted);
    } catch (error) {
      console.error("기존 마일스톤 불러오기 오류:", error);
      setErrorMessage("기존 마일스톤을 불러오는 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  const total = milestones.length;
  const completed = milestones.filter(m => m.status === "completed").length;
  const progressPercent = total > 0 ? Math.round((completed / total) * 100) : 0;

  const handleMilestoneChange = (index, field, value) => {
    const newList = [...milestones];
    newList[index][field] = value;
    setMilestones(newList);
  };

  const addMilestone = () => {
    setMilestones([...milestones, { title: "", dueDate: "", status: "pending" }]);
  };

  // 신규 항목 등록 (등록 후 중복 등록 방지를 위해 신규 항목만 필터링)
  const handleRegisterMilestone = async (index) => {
    const milestone = milestones[index];
    try {
      setLoading(true);
      await createClassMilestones(classId, [milestone]);
      alert("등록되었습니다.");
      loadExistingMilestones();
    } catch (error) {
      console.error("마일스톤 등록 오류:", error);
      setErrorMessage("마일스톤 등록 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 기존 항목 수정
  const handleUpdateMilestone = async (index) => {
    const milestone = milestones[index];
    if (!milestone.milestoneId) {
      alert("신규 항목은 '등록' 버튼으로 처리해주세요.");
      return;
    }
    try {
      setLoading(true);
      await updateClassMilestone(milestone.milestoneId, {
        title: milestone.title,
        dueDate: milestone.dueDate
      });
      alert("수정되었습니다.");
      loadExistingMilestones();
    } catch (error) {
      console.error("마일스톤 수정 오류:", error);
      setErrorMessage("마일스톤 수정 중 오류가 발생했습니다.");
    } finally {
      setLoading(false);
    }
  };

  // 삭제 함수
  const handleRemoveMilestone = async (index) => {
    const milestone = milestones[index];
    if (milestone.milestoneId) {
      try {
        setLoading(true);
        await deleteClassMilestone(milestone.milestoneId);
        setMilestones(milestones.filter((_, i) => i !== index));
      } catch (error) {
        console.error("마일스톤 삭제 오류:", error);
        setErrorMessage("마일스톤 삭제 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    } else {
      setMilestones(milestones.filter((_, i) => i !== index));
    }
  };

  // "설정 저장" 버튼은 제거하고, 각각의 수정/삭제 버튼만 사용 (원하는 경우 수정, 삭제 후 전체 재불러오기)
  // 만약 전체 저장 기능도 필요하다면 handleSubmit를 별도로 추가할 수 있습니다.

  return (
    <div className="milestones-container" style={{ maxWidth: "600px", margin: "0 auto" }}>
      <h2>팀 프로젝트 마일스톤 설정</h2>

      {/* 진행률 바 */}
      <div className="progress-bar" style={{ marginBottom: "1rem" }}>
        <div className="progress-bar-fill" style={{ width: `${progressPercent}%` }}></div>
      </div>
      <p>
        {completed} / {total} 마일스톤 완료 ({progressPercent}%)
      </p>

      {errorMessage && <p style={{ color: "red" }}>{errorMessage}</p>}

      {loading ? (
        <p>불러오는 중...</p>
      ) : (
        <form onSubmit={(e) => e.preventDefault()}>
          {milestones.map((ms, index) => (
            <div
              key={index}
              style={{
                border: "1px solid #ccc",
                padding: "0.75rem",
                marginBottom: "0.75rem",
                borderRadius: "5px"
              }}
            >
              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                마일스톤 제목:
                <input
                  type="text"
                  placeholder="예: 1. 팀원모집 / 2. 기획"
                  value={ms.title}
                  onChange={(e) => handleMilestoneChange(index, "title", e.target.value)}
                  required
                  style={{ marginLeft: "0.5rem" }}
                />
              </label>

              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                Due Date:
                <input
                  type="datetime-local"
                  value={ms.dueDate}
                  onChange={(e) => handleMilestoneChange(index, "dueDate", e.target.value)}
                  required
                  style={{ marginLeft: "0.5rem" }}
                />
              </label>

              <label style={{ display: "block", marginBottom: "0.5rem" }}>
                상태:
                <select
                  value={ms.status}
                  onChange={(e) => handleMilestoneChange(index, "status", e.target.value)}
                  style={{ marginLeft: "0.5rem" }}
                >
                  <option value="pending">미완료</option>
                  <option value="in-progress">진행 중</option>
                  <option value="completed">완료</option>
                </select>
              </label>

              <div style={{ display: "flex", gap: "0.5rem", marginTop: "0.5rem" }}>
                {/* 만약 이미 등록된 항목이면 수정과 삭제 버튼 표시, 그렇지 않으면 등록 버튼 표시 */}
                {ms.milestoneId ? (
                  <>
                    <button
                      type="button"
                      onClick={() => handleUpdateMilestone(index)}
                      style={{
                        backgroundColor: "blue",
                        color: "#fff",
                        padding: "0.4rem 0.8rem",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      수정
                    </button>
                    <button
                      type="button"
                      onClick={() => handleRemoveMilestone(index)}
                      style={{
                        backgroundColor: "red",
                        color: "#fff",
                        padding: "0.4rem 0.8rem",
                        border: "none",
                        cursor: "pointer"
                      }}
                    >
                      삭제
                    </button>
                  </>
                ) : (
                  <button
                    type="button"
                    onClick={() => handleRegisterMilestone(index)}
                    style={{
                      backgroundColor: "#4caf50",
                      color: "#fff",
                      padding: "0.4rem 0.8rem",
                      border: "none",
                      cursor: "pointer"
                    }}
                  >
                    등록
                  </button>
                )}
              </div>
            </div>
          ))}

          {/* 마일스톤 추가 버튼 */}
          <button
            type="button"
            onClick={addMilestone}
            style={{
              marginTop: "1rem",
              backgroundColor: "#007bff",
              color: "#fff",
              padding: "0.5rem 1rem",
              border: "none",
              cursor: "pointer",
              marginRight: "1rem"
            }}
          >
            마일스톤 추가
          </button>
        </form>
      )}

      {/* 뒤로가기 버튼 */}
      <button
        onClick={onBack}
        style={{
          marginTop: "1rem",
          backgroundColor: "#aaa",
          color: "#fff",
          padding: "0.5rem 1rem",
          border: "none",
          cursor: "pointer"
        }}
      >
        뒤로가기
      </button>
    </div>
  );
};

export default TeamClassMilestoneSetup;
