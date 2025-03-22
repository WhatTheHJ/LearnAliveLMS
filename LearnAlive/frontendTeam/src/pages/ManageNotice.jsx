import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ManageNotice = () => {
  const [notices, setNotices] = useState([]);
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [selectedNoticeId, setSelectedNoticeId] = useState(null); // 수정할 공지사항 ID
  const navigate = useNavigate();

  // 공지사항 목록 가져오기
  useEffect(() => {
    axios
      .get("http://localhost:8080/api/notice") // GET 요청
      .then((response) => {
        setNotices(response.data); // 응답 데이터 저장
      })
      .catch((error) => {
        console.error("Error fetching notices:", error);
      });
  }, []);

  // 공지사항 추가
  const handleAdd = () => {
    axios
      .post("http://localhost:8080/api/notice", { title, content }) // POST 요청
      .then(() => {
        setTitle("");
        setContent("");
        window.location.reload(); // 새로고침
      })
      .catch((error) => {
        console.error("Error adding notice:", error);
      });
  };

  // 공지사항 수정
  const handleEdit = () => {
    if (selectedNoticeId) {
      axios
        .put(`http://localhost:8080/api/notice/${selectedNoticeId}`, { title, content }) // PUT 요청
        .then(() => {
          setTitle("");
          setContent("");
          setSelectedNoticeId(null); // 초기화
          window.location.reload();
        })
        .catch((error) => {
          console.error("Error updating notice:", error);
        });
    }
  };

  // 공지사항 삭제
  const handleDelete = (notice_id) => {
    axios
      .delete(`http://localhost:8080/api/notice/${notice_id}`) // DELETE 요청
      .then(() => {
        window.location.reload();
      })
      .catch((error) => {
        console.error("Error deleting notice:", error);
      });
  };

  // 수정할 공지사항 선택
  const handleSelectNotice = (notice) => {
    setSelectedNoticeId(notice.notice_id);
    setTitle(notice.title);
    setContent(notice.content);
  };

  return (
    <div style={styles.container}>
      <h2 style={styles.heading}>📢 공지사항 관리</h2>
      <button style={styles.backButton} onClick={() => navigate("/")}>뒤로가기</button>

      <div style={styles.form}>
        <label style={styles.label}>공지사항 제목</label>
        <input
          type="text"
          placeholder="제목을 입력하세요"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          style={styles.input}
        />

        <label style={styles.label}>공지사항 내용</label>
        <textarea
          placeholder="내용을 입력하세요"
          value={content}
          onChange={(e) => setContent(e.target.value)}
          style={styles.textarea}
        />

        <div style={styles.buttonContainer}>
          {selectedNoticeId ? (
            <button style={styles.editButton} onClick={handleEdit}>수정</button>
          ) : (
            <button style={styles.addButton} onClick={handleAdd}>추가</button>
          )}
        </div>
      </div>

      <ul style={styles.noticeList}>
        {notices.map((notice) => (
          <li key={notice.notice_id} style={styles.noticeItem}>
            <h3>{notice.title}</h3>
            <p>{notice.content}</p>
            <div style={styles.noticeButtons}>
              <button style={styles.selectButton} onClick={() => handleSelectNotice(notice)}>수정</button>
              <button style={styles.deleteButton} onClick={() => handleDelete(notice.notice_id)}>삭제</button>
            </div>
          </li>
        ))}
      </ul>
    </div>
  );
};

// 스타일 객체
const styles = {
    container: {
      maxWidth: "600px",
      margin: "auto",
      padding: "20px",
      fontFamily: "Arial, sans-serif",
    },
    heading: {
      textAlign: "center",
      color: "#333",
    },
    backButton: {
      marginBottom: "10px",
      padding: "8px 12px",
      backgroundColor: "#B0BEC5", // 연한 회색
      color: "#333",
      border: "none",
      cursor: "pointer",
      borderRadius: "5px",
    },
    form: {
      display: "flex",
      flexDirection: "column",
      gap: "10px",
      marginBottom: "20px",
    },
    label: {
      fontWeight: "bold",
    },
    input: {
      padding: "10px",
      fontSize: "16px",
      border: "1px solid #ccc",
      borderRadius: "5px",
    },
    textarea: {
      padding: "10px",
      fontSize: "16px",
      height: "100px",
      border: "1px solid #ccc",
      borderRadius: "5px",
      resize: "none",
    },
    buttonContainer: {
      display: "flex",
      justifyContent: "center",
      gap: "10px",
    },
    addButton: {
      padding: "10px 20px",
      backgroundColor: "#4CAF50", // 부드러운 녹색
      color: "#333",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    editButton: {
      padding: "10px 20px",
      backgroundColor: "#008CBA", // 차분한 파란색
      color: "#fff",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    noticeList: {
      listStyle: "none",
      padding: "0",
    },
    noticeItem: {
      padding: "15px",
      marginBottom: "10px",
      backgroundColor: "#f9f9f9",
      borderRadius: "5px",
      boxShadow: "0px 2px 4px rgba(0, 0, 0, 0.1)",
    },
    noticeButtons: {
      display: "flex",
      justifyContent: "flex-end",
      gap: "5px",
      marginTop: "10px",
    },
    selectButton: {
      padding: "5px 10px",
      backgroundColor: "#4CAF50",
      color: "#333",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
    deleteButton: {
      padding: "5px 10px",
      backgroundColor: "#4CAF50",
      color: "#333",
      border: "none",
      borderRadius: "5px",
      cursor: "pointer",
    },
  };
  
  export default ManageNotice;
  