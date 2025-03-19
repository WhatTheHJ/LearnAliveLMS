// // src/pages/ClassroomDetail.jsx
// import { useState, useEffect } from "react";
// import { useParams, Link, useNavigate } from "react-router-dom";
// import { fetchClassDetail } from "../api/classroomApi";
// import { fetchBoardsByClassId, createBoard, deleteBoardByBoardId } from "../api/boardsApi";
// import { fetchSurveyBoards } from "../api/surveyApi";
// import { useAuth } from "../context/AuthContext";
// import AttendancePage from "../pages/AttendancePage";
// import ManageAttendance from "../pages/ManageAttendancePage";
// import Post from "../components/PostList";
// import SurveyList from "../pages/SurveyList";
// import DeleteBoardModal from "../components/DeleteBoardModal";
// import AddBoardModal from "../components/AddBoardModal";
// import "../styles/ClassroomDetail.css";
// import "../styles/post.css";

// const ClassroomDetail = () => {
//   const { classId } = useParams();
//   const { user } = useAuth();
//   const navigate = useNavigate(); // useNavigate 추가

//   const [classDetail, setClassDetail] = useState(null);
//   const [activeComponent, setActiveComponent] = useState(null);
//   const [selectedMenu, setSelectedMenu] = useState(null); // "post", "survey", "attendance" 등
//   const [boards, setBoards] = useState([]); // 일반 게시판 목록
//   const [boardId, setBoardId] = useState(null);
//   const [posts, setPosts] = useState([]);
//   const [selectedPost, setSelectedPost] = useState(null);

//   const [surveyBoards, setSurveyBoards] = useState([]);
//   const [showBoardModal, setShowBoardModal] = useState(false);
//   const [showDeleteModal, setShowDeleteModal] = useState(false);
  
//   const handleBoardClick = (id) => {
//     setBoardId(id);
//     setSelectedMenu("post");
//   };

//   useEffect(() => {
//     fetchClassDetail(classId)
//       .then((data) => setClassDetail(data))
//       .catch((error) => console.error("❌ 강의실 정보 불러오기 오류:", error));
    
//     fetchBoardsByClassId(classId)
//       .then((data) => setBoards(data))
//       .catch((error) => console.error("❌ 일반 게시판 불러오기 오류:", error));
    
//     fetchSurveyBoards(classId)
//       .then((data) => setSurveyBoards(data))
//       .catch((error) => console.error("❌ 설문조사 게시판 불러오기 오류:", error));
//   }, [classId]);

//   useEffect(() => {
//     if (!selectedMenu) return;
//     switch (selectedMenu) {
//       case "post":
//         setActiveComponent(boardId ? <Post boardId={boardId} /> : <p>게시판을 선택해주세요.</p>);
//         break;
//       case "survey":
//         setActiveComponent(<SurveyList classId={classId} boards={surveyBoards} />);
//         break;
//       case "attendance":
//         setActiveComponent(user.role === "student" ? <AttendancePage classId={classId} /> : <ManageAttendance classId={classId} />);
//         break;
//       default:
//         setActiveComponent(null);
//     }
//   }, [selectedMenu, classId, boardId, surveyBoards, user]);

//   if (!classDetail) return <p>클래스 정보를 불러오는 중...</p>;
//   return (
//     <div className="classroom-detail-wrapper" style={{ position: "relative" }}>
//       <div className="classroom-detail-container">
//         <h2>{classDetail.className}</h2>
//         <p><strong>교수자:</strong> {classDetail.professorName}</p>
//         <p><strong>이메일:</strong> {classDetail.professorEmail}</p>
//       </div>
//       <div className="classroom-layout">
//         {/* 좌측 메뉴 영역 */}
//         <div className="classroom-menu">
//           {user.role === "student" && (
//             <button className="menu-button" onClick={() => setSelectedMenu("attendance")}>
//               출석하기
//             </button>
//           )}

//           {user.role === "professor" && (
//             <button className="menu-button" onClick={() => setSelectedMenu("attendance")}>
//               출석 관리
//             </button>
//           )}
          
//           {boards.map((board) => (
//             <button key={board.boardId} className="menu-button" onClick={() => handleBoardClick(board.boardId)}>
//               {board.boardName}
//             </button>
//           ))}
          
//           <button className="menu-button" onClick={() => setSelectedMenu("survey")}>
//             설문조사
//           </button>
          
//           {/* 교수 전용: 채점 게시판 메뉴 버튼 추가 */}
//           {user.role === "professor" && (
//             <button className="menu-button" onClick={() => navigate(`/exam/${classId}`)}>
//               채점 게시판
//             </button>
//           )}
          
//           <Link to="/"><button className="menu-button btn btn-danger">메인으로</button></Link>
         
//           {user.role === "professor" && (
//             <div className="button-group">
//               <button className="menu-button" onClick={() => setShowBoardModal(true)}>
//                 + 게시판 추가
//               </button>
//               <button className="menu-button" onClick={() => setShowDeleteModal(true)}>
//                 게시판 삭제
//               </button>
//             </div>
//           )}
          
//           {showBoardModal && (
//             <AddBoardModal
//               onClose={() => setShowBoardModal(false)}
//               onAddBoardModal={(boardData) => {
//                 if (boardData.type === "survey") {
//                   createSurveyBoard(classId, boardData)
//                     .then(() => fetchSurveyBoards(classId))
//                     .then(setSurveyBoards)
//                     .catch((error) => console.error("❌ 설문조사 게시판 추가 오류:", error));
//                 } else {
//                   createBoard({ ...boardData, classId })
//                     .then(() => fetchBoardsByClassId(classId))
//                     .then(setBoards)
//                     .catch((error) => console.error("❌ 일반 게시판 추가 오류:", error));
//                 }
//                 setShowBoardModal(false);
//               }}
//             />
//           )}
          
//           {showDeleteModal && (
//             <DeleteBoardModal
//               onClose={() => setShowDeleteModal(false)}
//               onDeleteBoardModal={(deletedBoardId) => {
//                 if (surveyBoards.find((board) => board.boardId === deletedBoardId)) {
//                   deleteBoardByBoardId(deletedBoardId)
//                     .then(() => fetchSurveyBoards(classId))
//                     .then(setSurveyBoards)
//                     .catch((error) => console.error("❌ 설문조사 게시판 삭제 오류:", error));
//                 } else {
//                   deleteBoardByBoardId(deletedBoardId)
//                     .then(() => fetchBoardsByClassId(classId))
//                     .then(setBoards)
//                     .catch((error) => console.error("❌ 일반 게시판 삭제 오류:", error));
//                 }
//                 setShowDeleteModal(false);
//               }}
//               boards={boards.concat(surveyBoards)}
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







// src/pages/ClassroomDetail.jsx
import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchClassDetail } from "../api/classroomApi";
import { fetchBoardsByClassId, createBoard, deleteBoardByBoardId } from "../api/boardsApi";
import { fetchSurveyBoards } from "../api/surveyApi";
import { useAuth } from "../context/AuthContext";
import AttendancePage from "../pages/AttendancePage";
import ManageAttendance from "../pages/ManageAttendancePage";
import Post from "../components/PostList";
import SurveyList from "../pages/SurveyList";
import Exam from "../components/Exam";  // 채점 게시판 컴포넌트 임포트
import DeleteBoardModal from "../components/DeleteBoardModal";
import AddBoardModal from "../components/AddBoardModal";
import "../styles/ClassroomDetail.css";
import "../styles/post.css";

const ClassroomDetail = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [classDetail, setClassDetail] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null); // "post", "survey", "attendance", "exam" 등
  const [boards, setBoards] = useState([]);
  const [boardId, setBoardId] = useState(null);
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);

  const [surveyBoards, setSurveyBoards] = useState([]);
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleBoardClick = (id) => {
    setBoardId(id);
    setSelectedMenu("post");
  };

  useEffect(() => {
    fetchClassDetail(classId)
      .then((data) => setClassDetail(data))
      .catch((error) => console.error("❌ 강의실 정보 불러오기 오류:", error));
    
    fetchBoardsByClassId(classId)
      .then((data) => setBoards(data))
      .catch((error) => console.error("❌ 일반 게시판 불러오기 오류:", error));
    
    fetchSurveyBoards(classId)
      .then((data) => setSurveyBoards(data))
      .catch((error) => console.error("❌ 설문조사 게시판 불러오기 오류:", error));
  }, [classId]);

  useEffect(() => {
    if (!selectedMenu) return;
    switch (selectedMenu) {
      case "post":
        setActiveComponent(boardId ? <Post boardId={boardId} /> : <p>게시판을 선택해주세요.</p>);
        break;
      case "survey":
        setActiveComponent(<SurveyList classId={classId} boards={surveyBoards} />);
        break;
      case "attendance":
        setActiveComponent(
          user.role === "student" ? 
            <AttendancePage classId={classId} /> : 
            <ManageAttendance classId={classId} />
        );
        break;
      case "exam":
        setActiveComponent(<Exam classId={classId} />);
        break;
      default:
        setActiveComponent(null);
    }
  }, [selectedMenu, classId, boardId, surveyBoards, user]);

  if (!classDetail) return <p>클래스 정보를 불러오는 중...</p>;
  return (
    <div className="classroom-detail-wrapper" style={{ position: "relative" }}>
      <div className="classroom-detail-container">
        <h2>{classDetail.className}</h2>
        <p><strong>교수자:</strong> {classDetail.professorName}</p>
        <p><strong>이메일:</strong> {classDetail.professorEmail}</p>
      </div>
      <div className="classroom-layout">
        {/* 좌측 메뉴 영역 */}
        <div className="classroom-menu">
          {user.role === "student" && (
            <button className="menu-button" onClick={() => setSelectedMenu("attendance")}>
              출석하기
            </button>
          )}

          {user.role === "professor" && (
            <button className="menu-button" onClick={() => setSelectedMenu("attendance")}>
              출석 관리
            </button>
          )}
          
          {boards.map((board) => (
            <button key={board.boardId} className="menu-button" onClick={() => handleBoardClick(board.boardId)}>
              {board.boardName}
            </button>
          ))}
          
          <button className="menu-button" onClick={() => setSelectedMenu("survey")}>
            설문조사
          </button>
          
          {/* 교수 전용: 채점 게시판 메뉴 버튼 (navigate 대신 내부 상태 변경) */}
          {user.role === "professor" && (
            <button className="menu-button" onClick={() => setSelectedMenu("exam")}>
              채점 게시판
            </button>
          )}
          
          <Link to="/"><button className="menu-button btn btn-danger">메인으로</button></Link>
         
          {user.role === "professor" && (
            <div className="button-group">
              <button className="menu-button" onClick={() => setShowBoardModal(true)}>
                + 게시판 추가
              </button>
              <button className="menu-button" onClick={() => setShowDeleteModal(true)}>
                게시판 삭제
              </button>
            </div>
          )}
          
          {showBoardModal && (
            <AddBoardModal
              onClose={() => setShowBoardModal(false)}
              onAddBoardModal={(boardData) => {
                // boardData에 따라 일반 게시판 또는 설문조사 게시판 생성 처리
                if (boardData.type === "survey") {
                  // 예: createSurveyBoard 호출 등 (이미 구현되어 있는 경우)
                } else {
                  createBoard({ ...boardData, classId })
                    .then(() => fetchBoardsByClassId(classId))
                    .then(setBoards)
                    .catch((error) => console.error("❌ 일반 게시판 추가 오류:", error));
                }
                setShowBoardModal(false);
              }}
            />
          )}
          
          {showDeleteModal && (
            <DeleteBoardModal
              onClose={() => setShowDeleteModal(false)}
              onDeleteBoardModal={(deletedBoardId) => {
                if (surveyBoards.find((board) => board.boardId === deletedBoardId)) {
                  deleteBoardByBoardId(deletedBoardId)
                    .then(() => fetchSurveyBoards(classId))
                    .then(setSurveyBoards)
                    .catch((error) => console.error("❌ 설문조사 게시판 삭제 오류:", error));
                } else {
                  deleteBoardByBoardId(deletedBoardId)
                    .then(() => fetchBoardsByClassId(classId))
                    .then(setBoards)
                    .catch((error) => console.error("❌ 일반 게시판 삭제 오류:", error));
                }
                setShowDeleteModal(false);
              }}
              boards={boards.concat(surveyBoards)}
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
