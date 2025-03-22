import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchClassrooms, updateClassDescription } from "../api/classroomApi";

const MyClasses = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [selectedClass, setSelectedClass] = useState(null);
  const [description, setDescription] = useState("");

  useEffect(() => {
    if (user && user.userId) {
      fetchClassrooms(user.userId)
        .then((data) => setClassrooms(data))
        .catch((error) =>
          console.error("강의 목록을 불러오는데 실패했습니다.", error)
        );
    }
  }, [user]);

  // 모달 열기: 교수와 학생 모두 모달창을 볼 수 있음
  const openModal = (classroom) => {
    setSelectedClass(classroom);
    setDescription(classroom.description || "");
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
    setSelectedClass(null);
    setDescription("");
  };

  // 교수인 경우에만 설명 저장
  const handleSaveDescription = async () => {
    try {
      await updateClassDescription(selectedClass.classId, description);
      // 저장 후 모달 닫기 및 목록 업데이트
      setClassrooms((prev) =>
        prev.map((cls) =>
          cls.classId === selectedClass.classId
            ? { ...cls, description }
            : cls
        )
      );
      closeModal();
    } catch (error) {
      console.error("설명 저장 실패:", error);
    }
  };

  const isProfessor = user?.role === "professor";

  return (
    <div>
      <h2>내 강의 조회</h2>
      <table>
        <thead>
          <tr>
            <th>강의명</th>
            <th>조회</th>
          </tr>
        </thead>
        <tbody>
          {classrooms.map((classroom) => (
            <tr key={classroom.classId}>
              <td>{classroom.className}</td>
              <td>
                <button onClick={() => openModal(classroom)}>조회</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* 모달창 */}
      {showModal && (
        <div style={modalOverlayStyle}>
          <div style={modalContentStyle}>
            <h3>{selectedClass.className} 강의 설명</h3>
            {isProfessor ? (
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="강의 설명을 입력하세요."
                style={{ width: "100%", height: "150px" }}
              />
            ) : (
              <textarea
                value={description}
                readOnly
                style={{ width: "100%", height: "150px", backgroundColor: "#f5f5f5" }}
              />
            )}
            <div style={{ marginTop: "10px", textAlign: "right" }}>
              {isProfessor && (
                <button onClick={handleSaveDescription}>저장</button>
              )}
              <button onClick={closeModal} style={{ marginLeft: "10px" }}>
                취소
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

// 모달 스타일
const modalOverlayStyle = {
  position: "fixed",
  top: 0,
  left: 0,
  right: 0,
  bottom: 0,
  backgroundColor: "rgba(0, 0, 0, 0.5)",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
  zIndex: 1000,
};

const modalContentStyle = {
  backgroundColor: "#fff",
  padding: "20px",
  borderRadius: "5px",
  width: "400px",
  maxWidth: "90%",
};

export default MyClasses;