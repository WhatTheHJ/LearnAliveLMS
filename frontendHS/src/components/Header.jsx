import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import "../styles/Header.css"; // ✅ CSS 추가
import koreaLogo from "../assets/koreaLogo.png"; // ✅ 고려대학교 로고 이미지 가져오기
import PasswordModal from "../components/PasswordModal"; // ✅ 비밀번호 입력 모달 추가

const Header = () => {
  const { user, login, logout } = useAuth();
  const [userId, setUserId] = useState("");
  const [showModal, setShowModal] = useState(false);
  const navigate = useNavigate();

  const handleLogin = (e) => {
    e.preventDefault();
    if (userId) {
      login(userId);
    } else {
      alert("아이디를 입력하세요.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <header>
      {user ? (
        <div className="user-info"> {/* ✅ flex 적용된 컨테이너 */}
          <button className="home-button" onClick={() => navigate("/")}>🏠 홈</button>
          <span className="user-message">환영합니다, {user.userId}님! ({user.role})</span>
          <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <form onSubmit={handleLogin}>
          <input
            type="text"
            placeholder="학번"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button type="submit">로그인</button>
          <button type="button" className="professor-login-btn" onClick={() => setShowModal(true)}>
            교수자 로그인
          </button>
        </form>
      )}
      {/* ✅ 고려대학교 로고
      <img src={koreaLogo} alt="고려대학교 로고" className="logo" /> */}

      {/* ✅ 교수자 로그인 모달 */}
      <PasswordModal isOpen={showModal} onClose={() => setShowModal(false)} />
    </header>
  );
};

export default Header;
