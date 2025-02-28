import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect } from "react";
import { fetchClassrooms, addClassroom, deleteClassroom } from "../api/classroomApi";
import { registerStudent } from "../api/studentApi";
import StudentManagement from "./StudentManagement"; 


const ClassroomList = () => {
  const { user } = useAuth();
  const [showStudentManagement, setShowStudentManagement] = useState(false);
  const [classrooms, setClassrooms] = useState([]);
  const [showClassroomModal, setShowClassroomModal] = useState(false);
  const [showStudentModal, setShowStudentModal] = useState(false);
  const [newClassName, setNewClassName] = useState("");
  const [selectedClassId, setSelectedClassId] = useState("");
  const [studentInfo, setStudentInfo] = useState({
    studentId: "",
    university: "",
    department: "",
    name: "",
    email: "",
  });

  useEffect(() => {
    if (user) {
      fetchClassrooms(user.userId).then(setClassrooms);
    }
  }, [user]);

  if (!user) {
    return <p>먼저 로그인이 필요합니다.</p>;
  }

  // ✅ 강의실 추가
  const handleAddClassroom = async () => {
    if (!newClassName.trim()) return alert("강의실 이름을 입력하세요.");
    try {
      await addClassroom({ className: newClassName, profId: user.userId });
      const updatedClassrooms = await fetchClassrooms(user.userId);
      setClassrooms(updatedClassrooms);
      setShowClassroomModal(false);
      setNewClassName("");
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

  // ✅ 수강생 등록
  const handleRegisterStudent = async () => {
    if (!selectedClassId || !studentInfo.studentId.trim()) {
      return alert("강의실과 학생 정보를 입력하세요.");
    }
    try {
      await registerStudent({ ...studentInfo, classId: selectedClassId });
      setShowStudentModal(false);
      setStudentInfo({
        studentId: "",
        university: "",
        department: "",
        name: "",
        email: "",
      });
    } catch (error) {
      console.error("수강생 등록 실패:", error);
    }
  };

  return (
    <div>
      <h2>내 강의실</h2>
      {user.role === "professor" && (
        <div>
          <button onClick={() => setShowClassroomModal(true)}>강의실 추가</button>
          <button onClick={() => setShowStudentManagement(true)}>수강생 관리</button>
          {showStudentManagement && <StudentManagement onClose={() => setShowStudentManagement(false)} />}
        </div>
      )}
      
      <ul>
        {classrooms.length > 0 ? (
          classrooms.map((classroom) => (
            <li key={classroom.classId}>
              <Link
                to={
                  user.role === "student"
                    ? `/classroom/${classroom.classId}/attendance`
                    : `/classroom/${classroom.classId}/manage-attendance`
                }
              >
                {classroom.className} ({classroom.professor})
              </Link>
              {user.role === "professor" && (
                <button onClick={() => handleDeleteClassroom(classroom.classId)}>삭제</button>
              )}
            </li>
          ))
        ) : (
          <p>강의실 정보가 없습니다.</p>
        )}
      </ul>

      {/* ✅ 강의실 추가 모달 */}
      {showClassroomModal && (
        <div className="modal">
          <h3>강의실 추가</h3>
          <input
            type="text"
            placeholder="강의실 이름"
            value={newClassName}
            onChange={(e) => setNewClassName(e.target.value)}
          />
          <button onClick={handleAddClassroom}>추가</button>
          <button onClick={() => setShowClassroomModal(false)}>취소</button>
        </div>
      )}

      

      {/* ✅ 수강생 등록 모달 */}
      {showStudentModal && (
        <div className="modal">
          <h3>수강생 등</h3>
          <select onChange={(e) => setSelectedClassId(e.target.value)} value={selectedClassId}>
            <option value="">강의실 선택</option>
            {classrooms.map((classroom) => (
              <option key={classroom.classId} value={classroom.classId}>
                {classroom.className}
              </option>
            ))}
          </select>
          <input
            type="text"
            placeholder="학번"
            value={studentInfo.studentId}
            onChange={(e) => setStudentInfo({ ...studentInfo, studentId: e.target.value })}
          />
          <input
            type="text"
            placeholder="단과 대학"
            value={studentInfo.university}
            onChange={(e) => setStudentInfo({ ...studentInfo, university: e.target.value })}
          />
          <input
            type="text"
            placeholder="학과"
            value={studentInfo.department}
            onChange={(e) => setStudentInfo({ ...studentInfo, department: e.target.value })}
          />
          <input
            type="text"
            placeholder="이름"
            value={studentInfo.name}
            onChange={(e) => setStudentInfo({ ...studentInfo, name: e.target.value })}
          />
          <input
            type="email"
            placeholder="이메일"
            value={studentInfo.email}
            onChange={(e) => setStudentInfo({ ...studentInfo, email: e.target.value })}
          />
          <button onClick={handleRegisterStudent}>등록</button>
          <button onClick={() => setShowStudentModal(false)}>취소</button>
        </div>
      )}
    </div>
  );
};

export default ClassroomList;
