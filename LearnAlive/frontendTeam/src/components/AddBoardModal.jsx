import { useState } from "react";
import "../styles/ClassroomList.css";

const AddBoardModal = ({ onClose, onAddBoardModal }) => {
  const [boardName, setBoardName] = useState("");
  const [selectedOption, setSelectedOption] = useState("post"); // 기본값: 일반 게시판

  const handleSubmit = () => {
    if (selectedOption === "post" && !boardName.trim()) {
      return alert("게시판 이름을 입력하세요.");
    }
  
    // boardName은 survey/quiz에서도 같이 전달하지만, 의미 없으니 받아서 무시해도 됨
    onAddBoardModal({ boardName, selectedOption });
    setBoardName("");
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>게시판 추가</h3>
        <div>
          {/* 게시판 유형 선택 */}
          <select
            value={selectedOption}
            onChange={(e) => setSelectedOption(e.target.value)}
          >
            <option value="post">일반 게시판</option>
            <option value="survey">설문조사 게시판</option>
            <option value="quiz">퀴즈 게시판</option>
          </select>
        </div>

        {/* 일반 게시판일 때만 이름 입력 */}
        {selectedOption === "post" && (
          <input
            type="text"
            placeholder="게시판 이름"
            value={boardName}
            onChange={(e) => setBoardName(e.target.value)}
            required
          />
        )}

        <div className="modal-buttons">
          <button onClick={handleSubmit}>추가</button>
          <button className="button-cancel" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default AddBoardModal;
