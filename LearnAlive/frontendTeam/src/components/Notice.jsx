import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 임포트
import "../styles/ClassroomList.css";

const Notice = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [notices, setNotices] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/api/notice")
      .then((response) => {
        setNotices(response.data); // 공지사항 목록 설정
      })
      .catch((error) => {
        console.error("공지사항 불러오기 실패:", error);
      });
  }, []);

  const handleNoticeClick = (notice_id) => {
    if (notice_id !== null && notice_id !== undefined) {
      navigate(`/notice/${notice_id}`); // 클릭된 공지사항 상세페이지로 이동
    } else {
      console.error("유효하지 않은 notice_id");
    }
  };

  return (
    <div className="classroom-container">
        <div className="classroom-title">공지사항</div>
        {user?.role?.toLowerCase() === "admin" && (
          <button
            className="normal-button"
            onClick={() => navigate("/notice/manage")}
          >
            공지사항 관리
          </button>
        )}
      <ul className="classroom-list">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <li key={notice.notice_id} className="classroom-item" onClick={() => handleNoticeClick(notice.notice_id)}>
              
              <span className="classroom-link">{notice.title}</span>
            </li>
            
          ))
        ) : (
          <div className="login-container">
        <p className="login-message">
          등록된 공지사항이 없습니다.</p>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Notice;