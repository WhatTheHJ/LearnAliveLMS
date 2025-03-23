import { useState } from "react";

const AddClassroomModal = ({ onClose, onAddClassroom }) => {
  const [className, setClassName] = useState("");

  const handleSubmit = () => {
    if (!className.trim()) return alert("강의실 이름을 입력하세요.");
    onAddClassroom(className);
    setClassName(""); // 입력값 초기화
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <h3>강의실 추가</h3>
        <input
          type="text"
          placeholder="강의실 이름"
          value={className}
          onChange={(e) => setClassName(e.target.value)}
        />
        <div>
          <button onClick={handleSubmit} className="normal-button">추가</button>
          <button className="delete-button" onClick={onClose}>취소</button>
        </div>
      </div>
    </div>
  );
};

export default AddClassroomModal;
