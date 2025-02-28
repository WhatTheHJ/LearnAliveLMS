import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Header = () => {
  const { user, login, logout } = useAuth();
  const [userId, setUserId] = useState("");
  const navigate = useNavigate(); // ✅ 네비게이션 훅 추가

  const handleLogin = () => {
    if (userId) {
      login(userId);
    } else {
      alert("아이디를 입력하세요.");
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/"); // ✅ 로그아웃 시 강의실 목록으로 이동
  };

  return (
    <header>
      {user ? (
        <div>
          <span>환영합니다, {user.userId}님! ({user.role})</span>
          <button onClick={handleLogout}>로그아웃</button>
        </div>
      ) : (
        <div>
          <input
            type="text"
            placeholder="아이디"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
          />
          <button onClick={handleLogin}>로그인</button>
        </div>
      )}
    </header>
  );
};

export default Header;
