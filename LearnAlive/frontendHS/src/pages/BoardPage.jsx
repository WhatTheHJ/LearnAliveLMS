import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchAllClassrooms } from "../api/classroomApi";
import { fetchBoardsByClassId, deleteBoardByBoardId  } from "../api/boardsApi"; // ✅ 게시판 불러오는 API 추가

import { useAuth } from "../context/AuthContext";
import { getAllPosts} from "../api/postApi";
import DeleteBoardModal from "../components/DeleteBoardModal";
import AddBoardModal from "../components/AddBoardModal";
import "../styles/ClassroomList.css";
import "../styles/post.css";

import Post from "../components/Post";
import { createBoard } from "../api/boardsApi";

function BoardPage() {
  const { classId } = useParams();
  const [className, setClassName] = useState("");
  const [boards, setBoards] = useState([]);
  const [selectedBoardId, setSelectedBoardId] = useState(null); // ✅ 선택된 게시판 ID
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();
  //const navigate = useNavigate();
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 강의실 이름 불러오기
  useEffect(() => {
    const loadClassroom = async () => {
      try {
        const classrooms = await fetchAllClassrooms();
        const classroom = classrooms.find(cls => String(cls.classId) === String(classId));
        if (classroom) setClassName(classroom.className);
      } catch (error) {
        console.error("❌ 강의실 정보를 불러오는 데 실패했습니다:", error);
      }
    };

    loadClassroom();
  }, [classId]);

  // 게시판 불러오기
  useEffect(() => {
    const fetchBoards = async () => {
      try {
        setLoading(true);
        const boards = await fetchBoardsByClassId(classId);
        console.log(boards); // 게시판 데이터가 제대로 반환되는지 확인
        setBoards(boards);
      } catch (error) {
        console.error("❌ 게시판을 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchBoards();
  }, [classId]);

  if (loading) return <div>로딩 중...</div>;

   // ✅ 게시판 클릭 시 선택한 boardId 설정
   const handleBoardClick = (boardId) => {
    setSelectedBoardId(boardId);
  };



    // ✅ 게시판 추가 후 상태 업데이트
    const handleAddBoard = async ({ boardName, boardType }) => {
      try {
        // ✅ classId를 포함한 객체를 API로 전달
        const newBoard = await createBoard({ boardName, boardType, classId });
    
        setShowBoardModal(false); // 모달 닫기
    
        // ✅ 올바른 구조로 상태 업데이트
        setBoards((prevBoards) => [...prevBoards, newBoard]);
      } catch (error) {
        console.error("게시판 추가 실패:", error);
      }
    };



  // ✅ 게시판 삭제 핸들러
  const handleDeleteBoard = async (deletedBoardId) => {
    try {
      await deleteBoardByBoardId(deletedBoardId);
      const updatedBoards = await fetchBoardsByClassId(classId);
      setBoards(updatedBoards);
      setShowDeleteModal(false);
    } catch (error) {
      console.error("게시판 삭제 실패:", error);
    }
  };

  return (
<div className="board-container">
      {/* 왼쪽 사이드바 */}
    <div className="sidebar">
      <div className="button-group">
        <h3>{className ? `${className} 강의실` : "로딩 중..."}</h3>

        {/* 게시판 목록 */}
        {boards.map((board) => (
          <button 
          key={board.boardId} 
          className={`board-button ${selectedBoardId === board.boardId ? "active" : ""}`} 
          onClick={() => handleBoardClick(board.boardId)}
        >
            {board.boardName}
          </button>
        ))}

        {/* 마이페이지, 출석, 과제, 메인 이동 버튼 */}
        <Link to="/AttendancePage"><button>마이페이지(미완)</button></Link>
        <Link to={`/classroom/${classId}/attendance`}><button>출석하기</button></Link>
        <Link to="/board/AttendancePage"><button>과제(미완)</button></Link>
        <Link to="/classroom/:classId/surveys"><button>설문조사</button></Link>
        <Link to="/"><button className="btn btn-danger">메인으로</button></Link>
      
      
      {/* 교수 계정인 경우 게시판 추가/삭제 버튼 표시 */}
      {user.role === "professor" && (
        <div className="button-group">
          <button onClick={() => setShowBoardModal(true)}>게시판 추가</button>
          <button onClick={() => setShowDeleteModal(true)}>게시판 삭제</button>
        </div>
      )}
      <div>
      {/* 게시판 삭제 모달 */}
      {showDeleteModal && (
        <DeleteBoardModal
          onClose={() => setShowDeleteModal(false)}
          onDeleteBoardModal={handleDeleteBoard}
          boards={boards}
        />
      )}
      {/* 게시판 추가 모달 */}
      {showBoardModal && (
        <AddBoardModal
        onClose={()=> setShowBoardModal(false)}
        onAddBoardModal={handleAddBoard}
        />
      )}
      </div>
      </div>
    </div>

 {/* ✅ 선택된 게시판에 해당하는 게시글 표시 */}
 <div>
        {selectedBoardId ? (
          <Post boardId={selectedBoardId} />
        ) : (
          <p>게시판을 선택해주세요.</p>
        )}
      </div>

  </div>
     
  );
}

export default BoardPage;
