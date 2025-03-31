import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import FindAccountModal from "./FindAccountModal";
import "../styles/Header.css";
import NotificationListener from "./NotificationListener";
import { useNotifications } from "../context/NotificationContext";
import { Bell } from "lucide-react"; // 아이콘 라이브러리 사용
import "../styles/notification.css"
import { fetchAlarmList } from "../api/scheduleApi";


const Header = () => {
  const { user, login, logout } = useAuth();
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const [isModalOpen, setIsModalOpen] = useState(false);
  const navigate = useNavigate();
  const { notifications } = useNotifications();
  const [alarmList, setAlarmList] = useState([]);
  const [open, setOpen] = useState(false);
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    console.log("현재 로그인한 사용자:", user);
  }, [user]);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000); // 매초 갱신
  
    return () => clearInterval(interval); // 언마운트 시 제거
  }, []);

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

  const handleToggle = async () => {
    setOpen(!open);
    if (!open && user) {
      try {
        const data = await fetchAlarmList(user.userId);
        console.log("📥 받아온 알림 목록:", data);
        setAlarmList(data);
      } catch (error) {
        console.error("🔻 알림 목록 불러오기 실패", error);
      }
    }
  };

  return (
    <header>
      {user ? (
        // 로그인 후 화면
        <div className="user-info"> {/* ✅ 기존 CSS 유지 */}
      {/* 공통 버튼 */}
      <button className="home-button" onClick={() => navigate("/")}>🏠 홈</button>
      <span className="user-message">
        환영합니다, {user.username || user.userId} 님! ({user.role})
      </span>
      <button className="logout-btn" onClick={handleLogout}>로그아웃</button>
      <button className="mypage-btn" onClick={() => navigate("/mypage")}>마이페이지</button>
      <button onClick={() => window.location.href = "/calendar"}>📅</button>

      <div className="divider"></div>

      {/* 관리자 전용 버튼 */}
      {user.role.toLowerCase() === "admin" && (
        <>
          <button
            className="admin-btn"
            onClick={() => navigate("/admin/professors")}
          >
            교수자 관리
          </button>
          <button
            className="admin-btn"
            onClick={() => navigate("/admin/university")}
          >
            대학/학과 관리
          </button>
        </>
      )}

      {/* 알림 영역 */}
      {user?.userId && <NotificationListener userId={user.userId} />}
      <div className="notification-area">
        <button onClick={handleToggle} className="bell-button">
          <Bell />
          {notifications.length > 0 && <span className="badge" />}
        </button>
        {open && (
          <div className="notification-panel">
          <h4>📥 최근 알림</h4>
          {alarmList.length === 0 && <p>알림이 없습니다.</p>}
          {alarmList.map((n, i) => (
            <div key={i} className="notification-item">
              <strong>[{n.type}]</strong> {n.title}
              <div className="time">
                {new Date(n.createdAt).toLocaleString()}
              </div>
            </div>
          ))}
      </div>
       )}
      </div>
    </div>
      ) : (
        // 로그인 전 화면
        <div className="login-container">  {/* ✅ 기존 CSS 유지 */}
          <form onSubmit={handleLogin} className="login-form">  {/* ✅ 기존 CSS 유지 */}
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
          <div className="login-form">  {/* 여기는 새로 생긴 부분, 필요하면 CSS 추가 */}
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

      <div style={{
          backgroundColor: "white",
          padding: "10px",
          borderRadius: "14px",
          fontWeight: "bold",
          fontSize: "15px",
          marginRight: "5px",
          border: "4px solid #1929A4"
        }}>
          ⏰ {currentTime.toLocaleTimeString('ko-KR')}
        </div>

      {/* 모달 */}
      {isModalOpen && <FindAccountModal onClose={() => setIsModalOpen(false)} />}
    </header>
  );
};

export default Header;