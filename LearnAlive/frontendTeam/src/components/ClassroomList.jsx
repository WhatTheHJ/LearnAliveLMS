import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { fetchClassrooms, addClassroom, deleteClassroom } from "../api/classroomApi";
import AddClassroomModal from "../components/AddClassroomModal";
import StudentManagementModal from "../components/StudentManagementModal";
import "../styles/ClassroomList.css"; // CSS 파일 추가

const ClassroomList = () => {
  const { user } = useAuth();
  const [classrooms, setClassrooms] = useState([]);
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);

  useEffect(() => {
    if (user?.userId) {
      fetchClassrooms(user.userId).then(setClassrooms);
    }
  }, [user?.userId]);

  if (!user) {
    return (
      <div className="classroom-container">
        <div className="classroom-title">내 강의실</div>
        <div className="login-container">
        <p className="login-message">
        먼저 로그인이 필요합니다.<br /><br />
        <span style={{ color: "gray", fontSize: "0.9rem" }}>로그인 아이디는 학번입니다.</span>
      </p>
      </div>
      </div>
    );
  }

  // ✅ 강의실 추가 핸들러
  const handleAddClassroom = async (className) => {
    try {
      await addClassroom({ className, profId: user.userId });
      const updatedClassrooms = await fetchClassrooms(user.userId);
      setClassrooms(updatedClassrooms);
      setShowClassroomModal(false); // 모달 닫기
    } catch (error) {
      console.error("강의실 추가 실패:", error);
    }
  };

  // ✅ 강의실 삭제 핸들러
  const handleDeleteClassroom = async (classId) => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return;

    try {
      await deleteClassroom(classId);
      setClassrooms((prevClassrooms) =>
        prevClassrooms.filter((classroom) => classroom.classId !== classId)
      );
    } catch (error) {
      console.error("강의실 삭제 실패:", error);
    }
  };

  return (
    <div className="classroom-container">
      {/* ✅ "내 강의실"을 배경이 있는 박스로 감싸기 */}
      <div className="classroom-title">내 강의실</div>

      {user.role === "professor" && (
        <div>
          <button onClick={() => setShowClassroomModal(true)} className="normal-button">강의실 추가</button>
          <button onClick={() => setShowStudentModal(true)} className="normal-button">수강생 관리</button>
        </div>
      )}
      <ul className="classroom-list">
        {classrooms.length > 0 ? (
          classrooms.map((classroom) => (
            <li key={classroom.classId} className="classroom-item">

              {/* 모든 강의실 클릭 시 ClassroomDetail로 이동 */}
              <Link to={`/classroom/${classroom.classId}/boards`} className="classroom-link">
                {classroom.className}
              </Link>

              {user.role === "professor" && (
                <div className="classroom-buttons">
                  <Link to={`/classroom/${classroom.classId}/settings`}>
                    <button className="normal-button">⚙️시간 설정</button>
                  </Link>
                  <button
                    className="delete-button"
                    onClick={() => handleDeleteClassroom(classroom.classId)}
                  >
                    삭제
                  </button>
                </div>
              )}
            </li>
          ))
        ) : (
          <div className="login-container">
        <p className="login-message">
          강의실 정보가 없습니다.</p>
          </div>
        )}
      </ul>

      {/* ✅ 강의실 추가 모달 */}
      {showClassroomModal && (
        <AddClassroomModal
          onClose={() => setShowClassroomModal(false)}
          onAddClassroom={handleAddClassroom}
        />
      )}

      {/* ✅ 수강생 관리 모달 */}
      {showStudentModal && (
        <StudentManagementModal onClose={() => setShowStudentModal(false)} />
      )}
    </div>
  );
};

export default ClassroomList;
