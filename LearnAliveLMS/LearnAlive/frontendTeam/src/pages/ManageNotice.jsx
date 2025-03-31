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
            <button style={styles.editButton} onClick={handleEdit}>저장</button>
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
// 스타일 객체
const styles = {
  container: {
    maxWidth: "800px",
    margin: "40px auto",
    padding: "30px",
    backgroundColor: "#ffffff",
    borderRadius: "12px",
    boxShadow: "0 0 10px rgba(0, 0, 0, 0.1)",
    fontFamily: "Arial, sans-serif",
  },
  heading: {
    textAlign: "center",
    color: "#333",
    marginBottom: "20px",
    fontSize: "1.8rem",
  },
  backButton: {
    marginBottom: "20px",
    padding: "10px 15px",
    backgroundColor: "#d3d3d3", 
    color: "#333",
    border: "none",
    cursor: "pointer",
    borderRadius: "6px",
    transition: "background-color 0.3s",
  },
  form: {
    display: "flex",
    flexDirection: "column",
    gap: "15px",
    marginBottom: "30px",
  },
  label: {
    fontWeight: "bold",
    marginBottom: "5px",
    fontSize: "1rem",
  },
  input: {
    padding: "12px",
    fontSize: "1rem",
    border: "1px solid #ccc",
    borderRadius: "6px",
    transition: "border-color 0.2s",
  },
  textarea: {
    padding: "12px",
    fontSize: "1rem",
    height: "120px",
    border: "1px solid #ccc",
    borderRadius: "6px",
    resize: "none",
    transition: "border-color 0.2s",
  },
  buttonContainer: {
    display: "flex",
    justifyContent: "center",
    gap: "15px",
  },
  addButton: {
    padding: "10px 25px",
    backgroundColor: "#4CAF50",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
  },
  editButton: {
    padding: "10px 25px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s, transform 0.2s",
  },
  addButtonHover: {
    backgroundColor: "#388E3C",
  },
  editButtonHover: {
    backgroundColor: "#0069d9",
  },
  noticeList: {
    listStyle: "none",
    padding: "0",
    marginTop: "30px",
  },
  noticeItem: {
    padding: "15px",
    marginBottom: "10px",
    backgroundColor: "#f4f4f4",
    borderRadius: "8px",
    boxShadow: "0px 2px 5px rgba(0, 0, 0, 0.1)",
    transition: "transform 0.2s, box-shadow 0.2s",
  },
  noticeItemHover: {
    transform: "translateY(-2px)",
    boxShadow: "0px 4px 8px rgba(0, 0, 0, 0.15)",
  },
  noticeButtons: {
    display: "flex",
    justifyContent: "flex-end",
    gap: "10px",
    marginTop: "10px",
  },
  selectButton: {
    padding: "6px 12px",
    backgroundColor: "#007bff",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
  deleteButton: {
    padding: "6px 12px",
    backgroundColor: "#dc3545",
    color: "white",
    border: "none",
    borderRadius: "6px",
    cursor: "pointer",
    transition: "background-color 0.3s",
  },
};

  export default ManageNotice;
  