import { useState } from "react";
import "../styles/ClassroomList.css";


const AddBoardModal = ({ onClose, onAddBoardModal }) => {
    const [boardName, setboardName] = useState("");
    const handleSubmit = () => {
      if (!boardName.trim()) return alert("게시판 이름을 입력하세요.");

      onAddBoardModal({ boardName }); // 
      setboardName(""); // 입력값 초기화
    };
  
    return (
      <div className="modal-overlay">
        <div className="modal-content">
          <h3>게시판 추가</h3>
          <input
            type="text"
            placeholder="게시판 이름"
            value={boardName}
            onChange={(e) => setboardName(e.target.value)}
          />
          <div>
          {/* <label htmlFor="boardType">게시판 타입</label> */}
          {/* <select
            id="boardType"
            value={boardType}
            onChange={(e) => setBoardType(e.target.value)}
          >
            <option value="free">자유게시판</option>
            <option value="homework">과제</option>
          </select> */}
        </div>
          <div className="modal-buttons">
            <button onClick={handleSubmit}>추가</button>
            <button className="button-cancel" onClick={onClose}>취소</button>
          </div>
        </div>
      </div>
    );
  };

  export default AddBoardModal;
  