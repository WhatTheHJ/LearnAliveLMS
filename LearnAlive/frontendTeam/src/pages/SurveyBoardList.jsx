import { useEffect, useState } from "react";
import { fetchSurveyBoards } from "../api/surveyApi";
import { useParams } from "react-router-dom";

const SurveyBoardList = ({ onSelectBoard }) => {
  const { classId } = useParams();
  const [boards, setBoards] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    setLoading(true);
    fetchSurveyBoards(classId)
      .then((data) => {
        console.log("📌 받은 boards 데이터:", data); // ✅ 프론트에서 데이터 확인

        if (data && Array.isArray(data)) {
          setBoards(data.filter(board => board && board.boardId)); // ✅ boardId가 유효한 데이터만 저장
        } else {
          console.warn("⚠️ boards 데이터가 유효하지 않음. 빈 배열 사용");
          setBoards([]);
        }
      })
      .catch((error) => {
        console.error("❌ 설문조사 게시판을 불러오는 중 오류 발생:", error);
        setError("⚠️ 게시판 데이터를 불러오는 중 오류가 발생했습니다.");
      })
      .finally(() => setLoading(false));
  }, [classId]);

  if (loading) return <p>📌 설문조사 게시판을 불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (!boards.length) return <p>⚠️ 게시판이 없습니다. 새로 추가해보세요.</p>;

  return (
    <div className="survey-board-list">
      <h3>📝 설문조사 게시판</h3>
      <ul>
        {boards.map((board) =>
          board && board.boardId ? (
            <li key={board.boardId}>
              <button className="menu-button" onClick={() => onSelectBoard(board.boardId)}>
                📂 게시판 {board.boardId}
              </button>
            </li>
          ) : (
            <li key={`error-${Math.random()}`} className="error-item">⚠️ 데이터 오류</li>
          )
        )}
      </ul>
    </div>
  );
};

export default SurveyBoardList;
