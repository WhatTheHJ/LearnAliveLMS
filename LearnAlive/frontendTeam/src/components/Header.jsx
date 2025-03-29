import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FindAccountModal from "./FindAccountModal";
import MessageModal from './MessageModal'; // MessageModal을 import
import "../styles/Header.css";

const Header = () => {
  const { user, login, logout } = useAuth();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isMessageModalOpen, setIsMessageModalOpen] = useState(false);  // 모달 상태 추가
  const navigate = useNavigate();

  useEffect(() => {
    console.log("현재 로그인한 사용자:", user);
  }, [user]);

  const handleLogin = (e) => {
    e.preventDefault();
    if (!userId || !password) {
      alert("아이디와 비밀번호를 입력하세요.");
      return;
    }
    login(userId, password);
  };

  const handleLogout = () => {
    logout();
    navigate("/");
    setUserId(""); // 아이디 입력 필드 초기화
    setPassword(""); // 비밀번호 입력 필드 초기화
  };

  // 쪽지 모달 열기
  const openMessageModal = () => {
    setIsMessageModalOpen(true);  // 모달 상태를 true로 설정하여 열기
  };

  return (
    <header>
      {user ? (
        <div className="user-info">
          <button className="home-button" onClick={() => navigate("/")}>🏠 홈</button>
          <span className="user-message">
            환영합니다, {user.username || user.userId} 님! ({user.role})
          </span>
          {user.role.toLowerCase() === "admin" && (
            <button className="admin-btn" onClick={() => navigate("/admin/professors")}>
              교수자 관리
            </button>
          )}
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
          <button className="mypage-btn" onClick={() => navigate("/mypage")}>마이페이지</button>

          {/* 쪽지 버튼 */}
          <button
            className="message-btn"
            onClick={openMessageModal}  // 클릭 시 모달 열기
          >
            📨
          </button>
        </div>
      ) : (
        <div className="login-container">
          <form onSubmit={handleLogin} className="login-form">
            <input
              type="text"
              placeholder="아이디"
              value={userId}
              onChange={(e) => setUserId(e.target.value)}
            />
            <input
              type="password"
              placeholder="비밀번호"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
            <button type="submit" className="login-button">로그인</button>
          </form>
          <div className="divider"></div>
          <div className="login-form">
            <button
              className="find-button"
              type="button"
              onClick={() => setIsModalOpen(true)}
            >
              회원정보 찾기
            </button>
            <button
              className="find-button"
              type="button"
              onClick={() => navigate("/register")}
            >
              회원가입
            </button>
          </div>
        </div>
      )}

      {/* 모달 */}
      {isModalOpen && <FindAccountModal onClose={() => setIsModalOpen(false)} />}
      {isMessageModalOpen && (
        <MessageModal
          isOpen={isMessageModalOpen}  // 모달 상태 전달
          onClose={() => setIsMessageModalOpen(false)}  // 모달 닫기
        />
      )}
    </header>
  );
};

export default Header;
