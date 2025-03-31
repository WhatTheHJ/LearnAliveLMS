import { useState, useEffect } from "react";
import { deleteBoardByBoardId } from "../api/boardsApi";

const DeleteBoardModal = ({ onClose, onDeleteBoardModal, boards }) => {
  const [boardId, setSelectedBoardId] = useState(""); // 삭제할 게시판 ID 저장

  const handleSubmit = async () => {
    console.log("삭제할 게시판 ID:", boardId); // ✅ boardId 확인용
    if (!boardId) {
      alert("삭제할 게시판을 선택하세요.");
      return;
    }

    try {
      await deleteBoardByBoardId(boardId); // API 호출
      onDeleteBoardModal(boardId); // 부모 컴포넌트에서 상태 업데이트
      onClose(); // 모달 닫기
    } catch (error) {
      console.error("게시판 삭제 실패:", error);
      alert("게시판 삭제 중 오류가 발생했습니다.");
    }
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>게시판 삭제</h3>

        <label htmlFor="boardId">삭제할 게시판</label>
        <select
          id="boardId"
          value={boardId}
          onChange={(e) => setSelectedBoardId(e.target.value)}
        >
          <option value="">게시판 선택</option>
          {boards.map((board) => (
            <option key={board.boardId} value={board.boardId}>
              {board.boardName}
            </option>
          ))}
        </select>

        <div className="modal-buttons">
          <button onClick={handleSubmit}>삭제</button>
          <button className="button-cancel" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default DeleteBoardModal;
