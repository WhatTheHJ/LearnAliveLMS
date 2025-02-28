import { useState, useEffect } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import { fetchAllClassrooms } from "../api/classroomApi";
import { fetchBoardsByClassId } from "../api/boardsApi";
import { useAuth } from "../context/AuthContext";

function BoardPage() {
  const { classId } = useParams();
  const [className, setClassName] = useState(""); // 강의실 이름
  const [boards, setBoards] = useState([]); // 게시판 목록
  const [loading, setLoading] = useState(true);
  const { user, userId } = useAuth();
  const navigate = useNavigate();

  // 강의실 이름 불러오기
  useEffect(() => {
    const loadClassroom = async () => {
      try {
        const classrooms = await fetchAllClassrooms(); // 모든 강의실 가져오기
        console.log("📌 불러온 강의실 목록:", classrooms); // 데이터 확인용 로그

        // 강의실 목록에서 classId와 일치하는 강의실 찾기
        const classroom = classrooms.find(cls => String(cls.classId) === String(classId));

        if (classroom) {
          setClassName(classroom.className); // 강의실 이름 설정
        } else {
          console.warn(`⚠️ classId(${classId})에 해당하는 강의실을 찾을 수 없습니다.`);
        }
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
        const boards = await fetchBoardsByClassId(classId); // classId에 맞는 게시판 가져오기
        console.log("📌 불러온 게시판 목록:", boards);
        setBoards(boards);
        setLoading(false);
      } catch (error) {
        setLoading(false);
        console.error("❌ 게시판을 불러오는 데 실패했습니다:", error);
      }
    };

    fetchBoards();
  }, [classId]);

  if (loading) {
    return <div>로딩 중...</div>;
  }
  const handleBoardClick = (boardId) => {
    navigate(`/classroom/${classId}/board/${boardId}`);
  };



  return (
    <div>
      <h2>{className ? `${className} 강의실입니다` : "로딩 중..."}</h2>

      {boards.length > 0 ? (
  <div>

    
    {boards.map((board) => (
      <button 
        key={board.boardId} 
        style={{ margin: "10px", padding: "10px", fontSize: "16px" }}
        onClick={() => handleBoardClick(board.boardId)}
      >
        {board.boardName}
      </button>
    ))}
  </div>
) : (
  <p>게시판이 없습니다.</p>
)}


      <Link to="/AttendancePage">
        <button style={{ marginTop: "20px" }}>마이페이지(미완)</button>
      </Link>

      <Link to={`/classroom/${classId}/board/attendance`}>
        <button style={{ marginTop: "20px" }}>출석하기</button>
      </Link>

      <Link to="/board/AttendancePage">
        <button style={{ marginTop: "20px" }}>과제(미완)</button>
      </Link>
      {/* --------------------미구현*/}

      <Link to="/">
        <button style={{ marginTop: "20px" }}>메인으로 돌아가기</button>
      </Link>
    </div>
  );
}

export default BoardPage;
