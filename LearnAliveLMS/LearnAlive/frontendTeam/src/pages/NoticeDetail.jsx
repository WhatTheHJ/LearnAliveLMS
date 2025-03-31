import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import axios from "axios";

const NoticeDetail = () => {
  const { notice_id } = useParams();
  const [notice, setNotice] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (notice_id) {
      setLoading(true);
      setError(null);

      axios
        .get(`http://localhost:8080/api/notice/${notice_id}`)
        .then((response) => {
          setNotice(response.data);
          setLoading(false);
        })
        .catch(() => {
          setError("공지사항을 불러오는 중 오류가 발생했습니다.");
          setLoading(false);
        });
    }
  }, [notice_id]);

  if (loading) return <p style={styles.loading}>공지사항을 불러오는 중입니다...</p>;
  if (error) return <p style={styles.error}>{error}</p>;

  return (
    <div style={styles.noticeDetail}>
      <div style={styles.noticeHeader}>
        <h2 style={styles.noticeTitle}>{notice.title}</h2>
        <div style={styles.noticeDate}>📅 작성일: {notice.created_at?.split("T")[0]}</div>
      </div>
      <div style={styles.noticeContent}>{notice.content}</div>
    </div>
  );
};

// 💡 스타일 객체 정의 (camelCase 사용)
const styles = {
  noticeDetail: {
    maxWidth: "800px",
    margin: "20px auto",
    padding: "20px",
    background: "#fff",
    borderRadius: "8px",
    boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1)",
  },
  noticeHeader: {
    borderBottom: "2px solid #ddd",
    paddingBottom: "10px",
    marginBottom: "15px",
  },
  noticeTitle: {
    fontSize: "24px",
    fontWeight: "bold",
    color: "#333",
  },
  noticeDate: {
    fontSize: "14px",
    color: "#666",
    marginTop: "5px",
  },
  noticeContent: {
    fontSize: "18px",
    lineHeight: "1.6",
    color: "#444",
    padding: "10px",
    background: "#f9f9f9",
    borderRadius: "5px",
  },
  loading: {
    textAlign: "center",
    fontSize: "18px",
    color: "#007bff",
  },
  error: {
    textAlign: "center",
    fontSize: "18px",
    color: "red",
  },
};

export default NoticeDetail;