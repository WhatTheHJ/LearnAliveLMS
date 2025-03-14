import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import axios from "axios"; // axios 임포트

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
    <div className="notice-container">
      <div className="notice-header">
        <h2 className="notice-title">공지사항</h2>
        {user?.role?.toLowerCase() === "admin" && (
          <button
            className="manage-button"
            onClick={() => navigate("/notice/manage")}
          >
            공지사항 관리
          </button>
        )}
      </div>
      <ul className="notice-list">
        {notices.length > 0 ? (
          notices.map((notice) => (
            <li key={notice.notice_id} className="notice-item">
              {/* 🔹 공지사항 제목만 표시 */}
              <div
                className="notice-title"
                onClick={() => handleNoticeClick(notice.notice_id)}
              >
                {notice.title}
              </div>
            </li>
          ))
        ) : (
          <p>등록된 공지사항이 없습니다.</p> // 공지사항이 없을 때 메시지
        )}
      </ul>
    </div>
  );
};

export default Notice;
