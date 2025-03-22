import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import "../styles/PasswordModal.css"; // ✅ 모달 스타일 추가

const PasswordModal = ({ isOpen, onClose }) => {
  const { loginProfessor } = useAuth(); // ✅ loginProfessor가 존재하는지 확인
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!userId || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }

    console.log("📌 교수자 로그인 시도:", { userId, password });

    if (typeof loginProfessor !== "function") {
      console.error("❌ loginProfessor가 함수가 아닙니다!", loginProfessor);
      alert("로그인 기능에 문제가 발생했습니다. 다시 시도해주세요.");
      return;
    }

    try {
      await loginProfessor(userId, password); // ✅ 교수자 로그인 API 호출
      console.log("✅ 교수자 로그인 성공!");
      onClose(); // ✅ 로그인 성공 후 모달 닫기
    } catch (error) {
      console.error("❌ 교수자 로그인 실패:", error);
    }
  };

  if (!isOpen) return null;

  return (
  <div className="password-modal"> 
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-title">교수자 로그인</div>
        <form onSubmit={handleLogin}>
          <div className="modal-inputs">
            <input
              type="text"
              placeholder="교수자 아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value.toLowerCase().trim())} // ✅ 소문자로 변환 및 공백 제거
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value.toLowerCase().trim())}
            />
          </div>
          <div className="modal-buttons">
            <button type="submit">로그인</button>
            <button type="button" onClick={onClose}>취소</button>
          </div>
        </form>
      </div>
    </div>
  </div>
  );
};

export default PasswordModal;
