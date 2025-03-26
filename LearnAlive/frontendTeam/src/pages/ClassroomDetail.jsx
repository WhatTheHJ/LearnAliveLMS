// import { useState, useEffect } from "react";
// import { useParams, Link } from "react-router-dom";
// import { fetchClassDetail } from "../api/classroomApi";
// import { fetchBoardsByClassId, createBoard, deleteBoardByBoardId } from "../api/boardsApi";
// import { fetchSurveyBoards, createSurveyBoard } from "../api/surveyApi";
// import { fetchExamBoards, createQuizBoard, deleteExamBoard } from "../api/examApi";
// import { useAuth } from "../context/AuthContext";
// import AttendancePage from "../pages/AttendancePage";
// import ManageAttendance from "../pages/ManageAttendancePage";
// import Post from "../components/PostList";
// import SurveyList from "../pages/SurveyList";
// import DeleteBoardModal from "../components/DeleteBoardModal";
// import AddBoardModal from "../components/AddBoardModal";
// import ExamList from "./ExamList";
// import ExamCreate from "./ExamCreate";
// import ExamDetail from "./ExamDetail";
// import "../styles/ClassroomDetail.css";
// import "../styles/post.css";

// const ClassroomDetail = () => {
//   const { classId } = useParams();
//   const { user } = useAuth();

//   const [classDetail, setClassDetail] = useState(null);
//   const [boards, setBoards] = useState([]);
//   const [surveyBoards, setSurveyBoards] = useState([]);
//   const [selectedMenu, setSelectedMenu] = useState(null);
//   const [boardId, setBoardId] = useState(null);
//   const [selectedSurveyBoardId, setSelectedSurveyBoardId] = useState(null);
//   const [selectedExamId, setSelectedExamId] = useState(null);
//   const [activeComponent, setActiveComponent] = useState(null);
//   const [examBoards, setExamBoards] = useState([]);
//   const [showBoardModal, setShowBoardModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);

//   useEffect(() => {
//     fetchClassDetail(classId)
//       .then((data) => setClassDetail(data))
//       .catch((error) => console.error("❌ 강의실 정보 불러오기 오류:", error));

//     fetchBoardsByClassId(classId)
//       .then(setBoards)
//       .catch((error) => console.error("❌ 일반 게시판 불러오기 오류:", error));

//     fetchSurveyBoards(classId)
//       .then(setSurveyBoards)
//       .catch((error) => console.error("❌ 설문조사 게시판 불러오기 오류:", error));

//     fetchExamBoards(classId)
//       .then(setExamBoards)
//       .catch((error) => console.error("❌ 퀴즈 게시판 불러오기 오류:", error));
//   }, [classId]);

//   const handleBoardClick = (id) => {
//     setBoardId(id);
//     setSelectedMenu("post");
//   };

//   const handleSelectSurveyBoard = (id) => {
//     setSelectedSurveyBoardId(id);
//     setSelectedMenu("survey");
//   };

//   useEffect(() => {
//     if (!selectedMenu) return;
//     switch (selectedMenu) {
//       case "post":
//         setActiveComponent(
//           boardId ? <Post boardId={boardId} /> : <p>게시판을 선택해주세요.</p>
//         );
//         break;
//       case "exam":
//         setActiveComponent(
//           <ExamList
//             classId={classId}
//             setSelectedMenu={setSelectedMenu}
//             setSelectedExamId={setSelectedExamId}
//           />
//         );
//         break;
//       case "examCreate":
//         setActiveComponent(
//           <ExamCreate classId={classId} onBack={() => setSelectedMenu("exam")} />
//         );
//         break;
//       case "examDetail":
//         if (selectedExamId) {
//           setActiveComponent(
//             <ExamDetail
//               examId={selectedExamId}
//               onUpdated={() => fetchExamBoards(classId).then(setExamBoards)}
//               onBack={() => setSelectedMenu("exam")}
//             />
//           );
//         } else {
//           console.log("❌ selectedExamId가 아직 null이다.");
//         }
//         break;
//       case "survey":
//         setActiveComponent(
//           selectedSurveyBoardId ? (
//             <SurveyList
//               boardId={selectedSurveyBoardId}
//               classId={classId}
//               surveyId={null}
//               onBack={() => {
//                 setSelectedSurveyBoardId(null);
//                 setSelectedMenu(null);
//               }}
//             />
//           ) : (
//             <p>설문조사 게시판을 선택해주세요.</p>
//           )
//         );
//         break;
//       case "attendance":
//         setActiveComponent(
//           user.role === "student" ? (
//             <AttendancePage classId={classId} />
//           ) : (
//             <ManageAttendance classId={classId} />
//           )
//         );
//         break;
//       default:
//         setActiveComponent(null);
//     }
//   }, [selectedMenu, classId, boardId, selectedSurveyBoardId, user, selectedExamId]);

//   if (!classDetail) return <p>클래스 정보를 불러오는 중...</p>;

//   return (
//     <div className="classroom-detail-wrapper" style={{ position: "relative" }}>
//       <div className="classroom-detail-container">
//         <h2>{classDetail.className}</h2>
//         <p>
//           <strong>교수자:</strong> {classDetail.professorName}
//         </p>
//         <p>
//           <strong>이메일:</strong> {classDetail.professorEmail}
//         </p>
//       </div>
//       <div className="classroom-layout">
//         {/* 좌측 메뉴 */}
//         <div className="classroom-menu">
//           {user.role === "student" ? (
//             <button
//               className="menu-button"
//               onClick={() => setSelectedMenu("attendance")}
//             >
//               출석하기
//             </button>
//           ) : (
//             <button
//               className="menu-button"
//               onClick={() => setSelectedMenu("attendance")}
//             >
//               출석 관리
//             </button>
//           )}

//           {/* 일반 게시판 목록 */}
//           {boards.map((board) => (
//             <button
//               key={board.boardId}
//               className="menu-button"
//               onClick={() => handleBoardClick(board.boardId)}
//             >
//               {board.boardName}
//             </button>
//           ))}

//           {/* 설문조사 게시판 */}
//           {surveyBoards.length > 0 && (
//             <button
//               className="menu-button"
//               onClick={() => handleSelectSurveyBoard(surveyBoards[0].boardId)}
//             >
//               설문조사
//             </button>
//           )}

//           {/* 퀴즈 게시판 */}
//           {examBoards.length > 0 && (
//             <button
//               className="menu-button"
//               onClick={() => setSelectedMenu("exam")}
//             >
//               퀴즈
//             </button>
//           )}

//           {/* 교수 계정: 게시판 추가/삭제 모달 버튼 */}
//           {user.role === "professor" && (
//             <div className="button-group">
//               <button
//                 className="menu-button"
//                 onClick={() => setShowBoardModal(true)}
//               >
//                 + 게시판 추가
//               </button>
//               <button
//                 className="menu-button"
//                 onClick={() => setShowDeleteModal(true)}
//               >
//                 게시판 삭제
//               </button>
//             </div>
//           )}

//           {/* 게시판 추가 모달 */}
//           {showBoardModal && (
//             <AddBoardModal
//               onClose={() => setShowBoardModal(false)}
//               onAddBoardModal={async (boardData) => {
//                 if (boardData.selectedOption === "survey") {
//                   if (surveyBoards.length > 0) {
//                     alert("설문조사 게시판은 이미 존재합니다.");
//                     setShowBoardModal(false);
//                     return;
//                   }
//                   await createSurveyBoard(classId);
//                   fetchSurveyBoards(classId)
//                     .then(setSurveyBoards)
//                     .catch((error) =>
//                       console.error("❌ 설문조사 게시판 추가 오류:", error)
//                     );
//                 } else if (boardData.selectedOption === "quiz") {
//                   if (examBoards.length > 0) {
//                     alert("퀴즈 게시판은 이미 존재합니다.");
//                     setShowBoardModal(false);
//                     return;
//                   }
//                   await createQuizBoard(classId);
//                   fetchExamBoards(classId)
//                     .then(setExamBoards)
//                     .catch((error) =>
//                       console.error("❌ 퀴즈 게시판 추가 오류:", error)
//                     );
//                 } else {
//                   createBoard({ ...boardData, classId })
//                     .then(() => fetchBoardsByClassId(classId))
//                     .then(setBoards)
//                     .catch((error) =>
//                       console.error("❌ 일반 게시판 추가 오류:", error)
//                     );
//                 }
//                 setShowBoardModal(false);
//               }}
//             />
//           )}

//           {/* 게시판 삭제 모달 */}
//           {showDeleteModal && (
//             <DeleteBoardModal
//               onClose={() => setShowDeleteModal(false)}
//               onDeleteBoardModal={(deletedBoardId) => {
//                 if (
//                   surveyBoards.find(
//                     (board) => board.boardId === deletedBoardId
//                   )
//                 ) {
//                   deleteBoardByBoardId(deletedBoardId)
//                     .then(() => fetchSurveyBoards(classId))
//                     .then(setSurveyBoards)
//                     .catch((error) =>
//                       console.error("❌ 설문조사 게시판 삭제 오류:", error)
//                     );
//                 } else {
//                   deleteBoardByBoardId(deletedBoardId)
//                     .then(() => fetchBoardsByClassId(classId))
//                     .then(setBoards)
//                     .catch((error) =>
//                       console.error("❌ 일반 게시판 삭제 오류:", error)
//                     );
//                 }
//                 setShowDeleteModal(false);
//               }}
//               boards={boards.concat(
//                 surveyBoards.map((survey) => ({
//                   ...survey,
//                   boardName: "설문조사"
//                 }))
//               )}
//             />
//           )}
//         </div>

//         {/* 우측 콘텐츠 영역 */}
//         <div className="classroom-content">
//           {activeComponent || <p>메뉴에서 항목을 선택해주세요.</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default ClassroomDetail;










import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchClassDetail } from "../api/classroomApi";
import { fetchBoardsByClassId, createBoard, deleteBoardByBoardId } from "../api/boardsApi";
import { fetchSurveyBoards, createSurveyBoard } from "../api/surveyApi";
import { fetchExamBoards, createQuizBoard, deleteExamBoard } from "../api/examApi";
import { useAuth } from "../context/AuthContext";
import AttendancePage from "../pages/AttendancePage";
import ManageAttendance from "../pages/ManageAttendancePage";
import Post from "../components/PostList";
import SurveyList from "../pages/SurveyList";
import DeleteBoardModal from "../components/DeleteBoardModal";
import AddBoardModal from "../components/AddBoardModal";
import ExamList from "./ExamList";
import ExamCreate from "./ExamCreate";
import ExamDetail from "./ExamDetail";
import TeamActivity from "../components/TeamActivity";  // 새로 추가된 부분
import "../styles/ClassroomDetail.css";
import "../styles/post.css";

const ClassroomDetail = () => {
  const { classId } = useParams();
  const { user } = useAuth();

  // 기존 상태들...
  const [classDetail, setClassDetail] = useState(null);
  const [boards, setBoards] = useState([]);
  const [surveyBoards, setSurveyBoards] = useState([]);
  const [examBoards, setExamBoards] = useState([]);
  const [selectedMenu, setSelectedMenu] = useState(null);
  const [boardId, setBoardId] = useState(null);
  const [selectedSurveyBoardId, setSelectedSurveyBoardId] = useState(null);
  const [selectedExamId, setSelectedExamId] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  useEffect(() => {
    fetchClassDetail(classId)
      .then((data) => setClassDetail(data))
      .catch((error) => console.error("❌ 강의실 정보 불러오기 오류:", error));

    fetchBoardsByClassId(classId)
      .then(setBoards)
      .catch((error) => console.error("❌ 일반 게시판 불러오기 오류:", error));

    fetchSurveyBoards(classId)
      .then(setSurveyBoards)
      .catch((error) => console.error("❌ 설문조사 게시판 불러오기 오류:", error));

    fetchExamBoards(classId)
      .then(setExamBoards)
      .catch((error) => console.error("❌ 퀴즈 게시판 불러오기 오류:", error));
  }, [classId]);

  const handleBoardClick = (id) => {
    setBoardId(id);
    setSelectedMenu("post");
  };

  const handleSelectSurveyBoard = (id) => {
    setSelectedSurveyBoardId(id);
    setSelectedMenu("survey");
  };

  useEffect(() => {
    if (!selectedMenu) return;
    switch (selectedMenu) {
      case "post":
        setActiveComponent(
          boardId ? <Post boardId={boardId} /> : <p>게시판을 선택해주세요.</p>
        );
        break;
      case "exam":
        setActiveComponent(
          <ExamList
            classId={classId}
            setSelectedMenu={setSelectedMenu}
            setSelectedExamId={setSelectedExamId}
          />
        );
        break;
      case "examCreate":
        setActiveComponent(
          <ExamCreate classId={classId} onBack={() => setSelectedMenu("exam")} />
        );
        break;
      case "examDetail":
        if (selectedExamId) {
          setActiveComponent(
            <ExamDetail
              examId={selectedExamId}
              onUpdated={() => fetchExamBoards(classId).then(setExamBoards)}
              onBack={() => setSelectedMenu("exam")}
            />
          );
        } else {
          console.log("❌ selectedExamId가 아직 null이다.");
        }
        break;
      case "survey":
        setActiveComponent(
          selectedSurveyBoardId ? (
            <SurveyList
              boardId={selectedSurveyBoardId}
              classId={classId}
              surveyId={null}
              onBack={() => {
                setSelectedSurveyBoardId(null);
                setSelectedMenu(null);
              }}
            />
          ) : (
            <p>설문조사 게시판을 선택해주세요.</p>
          )
        );
        break;
      case "attendance":
        setActiveComponent(
          user.role === "student" ? (
            <AttendancePage classId={classId} />
          ) : (
            <ManageAttendance classId={classId} />
          )
        );
        break;
      // 새로 추가된 팀 활동 메뉴
      case "teamActivity":
        setActiveComponent(<TeamActivity classId={classId} />);
        break;
      default:
        setActiveComponent(null);
    }
  }, [selectedMenu, classId, boardId, selectedSurveyBoardId, user, selectedExamId]);

  if (!classDetail) return <p>클래스 정보를 불러오는 중...</p>;

  return (
    <div className="classroom-detail-wrapper" style={{ position: "relative" }}>
      <div className="classroom-detail-container">
        <h2>{classDetail.className}</h2>
        <p>
          <strong>교수자:</strong> {classDetail.professorName}
        </p>
        <p>
          <strong>이메일:</strong> {classDetail.professorEmail}
        </p>
      </div>
      <div className="classroom-layout">
        {/* 좌측 메뉴 */}
        <div className="classroom-menu">
          {user.role === "student" ? (
            <button
              className="menu-button"
              onClick={() => setSelectedMenu("attendance")}
            >
              출석하기
            </button>
          ) : (
            <button
              className="menu-button"
              onClick={() => setSelectedMenu("attendance")}
            >
              출석 관리
            </button>
          )}

          {/* 일반 게시판 목록 */}
          {boards.map((board) => (
            <button
              key={board.boardId}
              className="menu-button"
              onClick={() => handleBoardClick(board.boardId)}
            >
              {board.boardName}
            </button>
          ))}

          {/* 설문조사 게시판 */}
          {surveyBoards.length > 0 && (
            <button
              className="menu-button"
              onClick={() => handleSelectSurveyBoard(surveyBoards[0].boardId)}
            >
              설문조사
            </button>
          )}

          {/* 퀴즈 게시판 */}
          {examBoards.length > 0 && (
            <button
              className="menu-button"
              onClick={() => setSelectedMenu("exam")}
            >
              퀴즈
            </button>
          )}

          {/* 새로 추가된 팀 활동 게시판 버튼 */}
          <button
            className="menu-button"
            onClick={() => setSelectedMenu("teamActivity")}
          >
            팀 활동
          </button>

          {/* 교수 계정: 게시판 추가/삭제 모달 버튼 */}
          {user.role === "professor" && (
            <div className="button-group">
              <button
                className="menu-button"
                onClick={() => setShowBoardModal(true)}
              >
                + 게시판 추가
              </button>
              <button
                className="menu-button"
                onClick={() => setShowDeleteModal(true)}
              >
                게시판 삭제
              </button>
            </div>
          )}

          {/* 게시판 추가 및 삭제 모달 관련 기존 코드 유지 */}
          {showBoardModal && (
            <AddBoardModal
              onClose={() => setShowBoardModal(false)}
              onAddBoardModal={async (boardData) => {
                if (boardData.selectedOption === "survey") {
                  if (surveyBoards.length > 0) {
                    alert("설문조사 게시판은 이미 존재합니다.");
                    setShowBoardModal(false);
                    return;
                  }
                  await createSurveyBoard(classId);
                  fetchSurveyBoards(classId)
                    .then(setSurveyBoards)
                    .catch((error) =>
                      console.error("❌ 설문조사 게시판 추가 오류:", error)
                    );
                } else if (boardData.selectedOption === "quiz") {
                  if (examBoards.length > 0) {
                    alert("퀴즈 게시판은 이미 존재합니다.");
                    setShowBoardModal(false);
                    return;
                  }
                  await createQuizBoard(classId);
                  fetchExamBoards(classId)
                    .then(setExamBoards)
                    .catch((error) =>
                      console.error("❌ 퀴즈 게시판 추가 오류:", error)
                    );
                } else {
                  createBoard({ ...boardData, classId })
                    .then(() => fetchBoardsByClassId(classId))
                    .then(setBoards)
                    .catch((error) =>
                      console.error("❌ 일반 게시판 추가 오류:", error)
                    );
                }
                setShowBoardModal(false);
              }}
            />
          )}

          {showDeleteModal && (
            <DeleteBoardModal
              onClose={() => setShowDeleteModal(false)}
              onDeleteBoardModal={(deletedBoardId) => {
                if (
                  surveyBoards.find(
                    (board) => board.boardId === deletedBoardId
                  )
                ) {
                  deleteBoardByBoardId(deletedBoardId)
                    .then(() => fetchSurveyBoards(classId))
                    .then(setSurveyBoards)
                    .catch((error) =>
                      console.error("❌ 설문조사 게시판 삭제 오류:", error)
                    );
                } else {
                  deleteBoardByBoardId(deletedBoardId)
                    .then(() => fetchBoardsByClassId(classId))
                    .then(setBoards)
                    .catch((error) =>
                      console.error("❌ 일반 게시판 삭제 오류:", error)
                    );
                }
                setShowDeleteModal(false);
              }}
              boards={boards.concat(
                surveyBoards.map((survey) => ({
                  ...survey,
                  boardName: "설문조사"
                }))
              )}
            />
          )}
        </div>

        {/* 우측 콘텐츠 영역 */}
        <div className="classroom-content">
          {activeComponent || <p>메뉴에서 항목을 선택해주세요.</p>}
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetail;
