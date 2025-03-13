import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import { fetchClassDetail } from "../api/classroomApi";
import { fetchBoardsByClassId, createBoard, deleteBoardByBoardId } from "../api/boardsApi";
import { fetchSurveyBoards } from "../api/surveyApi"; // 설문조사 게시판 관련 API
import { useAuth } from "../context/AuthContext";
import AttendancePage from "../pages/AttendancePage";
import ManageAttendance from "../pages/ManageAttendancePage";
import Post from "../components/PostList"; // 일반 게시물 목록 컴포넌트
import SurveyList from "../pages/SurveyList"; // 설문조사 게시판 목록 컴포넌트
import DeleteBoardModal from "../components/DeleteBoardModal";
import AddBoardModal from "../components/AddBoardModal";
import "../styles/ClassroomDetail.css";
import "../styles/post.css";

const ClassroomDetail = () => {
  const { classId } = useParams();
  // const [selectedBoardId, setSelectedBoardId] = useState(null);
  const { user } = useAuth();
  const [classDetail, setClassDetail] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [selectedMenu, setSelectedMenu] = useState(null); // "post" 또는 "survey"
  const [boards, setBoards] = useState([]); // 일반 게시판 (board) 목록
  const [boardId, setBoardId] = useState(null);
  // const [posts, setPosts] = useState([]); // 게시글 목록 상태
  // const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 상태

  const [surveyBoards, setSurveyBoards] = useState([]); // 설문조사 게시판 (survey_board) 목록
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  
  const handleBoardClick = (id) => {
    setBoardId(id);
    setSelectedMenu("post");
  };
  // 강의실 정보 불러오기
  useEffect(() => {
    fetchClassDetail(classId)
      .then((data) => setClassDetail(data))
      .catch((error) => console.error("❌ 강의실 정보 불러오기 오류:", error));
    
    // // 일반 게시판 불러오기 (board)
    fetchBoardsByClassId(classId)
      .then((data) => setBoards(data))
      .catch((error) => console.error("❌ 일반 게시판 불러오기 오류:", error));
    
    // 설문조사 게시판 불러오기 (survey_board)
    fetchSurveyBoards(classId)
      .then((data) => setSurveyBoards(data))
      .catch((error) => console.error("❌ 설문조사 게시판 불러오기 오류:", error));
  }, [classId]);

  // console.log("useParams() 결과:", { classId, boardId });

  // 좌측 메뉴에서 선택한 항목에 따라 activeComponent 업데이트
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
        setActiveComponent(user.role === "student" ? <AttendancePage classId={classId} /> : <ManageAttendance classId={classId} />);
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
        {/* 좌측 메뉴 */}
        <div className="classroom-menu">
          {/* 메뉴 버튼: 출석/출석 관리 */}
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
          {/* 메뉴 버튼: 일반 게시판
          <button className="menu-button" onClick={() => setSelectedMenu("post")}>
            게시판
          </button> */}
          {/* 메뉴 버튼: 설문조사 게시판 */}
          <button className="menu-button" onClick={() => setSelectedMenu("survey")}>
            설문조사
          </button>
          {/* 추가적인 메뉴 버튼 */}
          <Link to="/"><button className="menu-button btn btn-danger">메인으로</button></Link>
         
         
         
          {/* 교수 계정: 게시판 추가/삭제 모달 버튼 */}
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



          {/* 게시판 추가 모달 */}
          {showBoardModal && (
            <AddBoardModal
              onClose={() => setShowBoardModal(false)}
              onAddBoardModal={(boardData) => {
                // boardData에 따라 일반 게시판 또는 설문조사 게시판 생성
                if (boardData.type === "survey") {
                  // survey_board 생성
                  createSurveyBoard(classId, boardData)
                    .then(() => fetchSurveyBoards(classId))
                    .then(setSurveyBoards)
                    .catch((error) => console.error("❌ 설문조사 게시판 추가 오류:", error));
                } else {
                  // 일반 board 생성
                  createBoard({ ...boardData, classId })
                    .then(() => fetchBoardsByClassId(classId))
                    .then(setBoards)
                    .catch((error) => console.error("❌ 일반 게시판 추가 오류:", error));
                }
                setShowBoardModal(false);
              }}
            />
          )}
          {/* 게시판 삭제 모달 */}
          {showDeleteModal && (
            <DeleteBoardModal
              onClose={() => setShowDeleteModal(false)}
              onDeleteBoardModal={(deletedBoardId) => {
                // 설문조사 게시판 삭제 조건: surveyBoards 배열에 해당 boardId가 있으면
                if (surveyBoards.find((board) => board.boardId === deletedBoardId)) {
                  deleteBoardByBoardId(deletedBoardId)
                    .then(() => fetchSurveyBoards(classId))
                    .then(setSurveyBoards)
                    .catch((error) => console.error("❌ 설문조사 게시판 삭제 오류:", error));
                } else {
                  // 그렇지 않으면 일반 게시판 삭제
                  deleteBoardByBoardId(deletedBoardId)
                    .then(() => fetchBoardsByClassId(classId))
                    .then(setBoards)
                    .catch((error) => console.error("❌ 일반 게시판 삭제 오류:", error));
                }
                setShowDeleteModal(false);
              }}
              boards={boards.concat(surveyBoards)} // 둘 다 포함하여 삭제 대상 목록 표시
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