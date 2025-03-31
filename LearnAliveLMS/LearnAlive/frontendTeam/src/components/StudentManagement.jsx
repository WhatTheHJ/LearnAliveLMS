import { useState, useEffect } from "react";
import { fetchAllClassrooms } from "../api/classroomApi";
import { fetchStudentsByClass, registerStudent, updateStudent, deleteStudent } from "../api/studentApi";

const StudentManagement = ({ onClose }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState([]);
  const [editingData, setEditingData] = useState({});
  const [studentInfo, setStudentInfo] = useState({
    studentId: "",
    university: "",
    department: "",
    name: "",
    email: "",
    remarks: "", // ✅ 비고 필드 추가
  });

  useEffect(() => {
    fetchAllClassrooms()
      .then((data) => setClassrooms(data))
      .catch((error) => console.error("강의실 목록 불러오기 실패:", error));
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      const loadStudents = async () => {
        try {
          const data = await fetchStudentsByClass(selectedClassId);
          setStudents(data);
          setEditingData(
            data.reduce((acc, student) => {
              acc[student.studentId] = { ...student };
              return acc;
            }, {})
          );
        } catch (error) {
          console.error("수강생 목록 불러오기 실패:", error);
        }
      };
      loadStudents();
    }
  }, [selectedClassId]);

  // ✅ 입력값 변경 (로컬에서만 변경)
  const handleEditChange = (studentId, field, value) => {
    setEditingData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

// ✅ 수정 버튼 클릭 시 실행 (서버 요청 후 메시지 표시)
const handleSaveUpdate = async (studentId) => {
  try {
    await updateStudent(studentId, editingData[studentId]);

    // ✅ 서버에서 최신 데이터 가져오기
    const updatedStudents = await fetchStudentsByClass(selectedClassId);
    setStudents(updatedStudents);

    setEditingData(
      updatedStudents.reduce((acc, student) => {
        acc[student.studentId] = { ...student };
        return acc;
      }, {})
    );

    // ✅ 수정 성공 후 alert 표시
    setTimeout(() => {
      alert("수정이 완료되었습니다.");
    }, 100); // ✅ 타이밍 문제 방지
  } catch (error) {
    console.error("수강생 정보 수정 실패:", error);
  }
};

  // ✅ 수강생 삭제
  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await deleteStudent(studentId);
      setStudents((prev) => prev.filter((student) => student.studentId !== studentId));
    } catch (error) {
      console.error("수강생 삭제 실패:", error);
    }
  };

 // ✅ 수강생 등록 (추가한 학생이 즉시 반영되도록 수정)
const handleRegisterStudent = async () => {
  if (!selectedClassId || !studentInfo.studentId.trim()) {
    return alert("강의실과 학생 정보를 입력하세요.");
  }
  try {
    await registerStudent({ ...studentInfo, classId: selectedClassId });

    // ✅ 서버에서 최신 데이터 다시 불러오기 (학생 추가 후 반영)
    const updatedStudents = await fetchStudentsByClass(selectedClassId);
    setStudents(updatedStudents);

    // ✅ 새로 등록한 학생의 정보를 input에 유지 (즉시 반영)
    setEditingData((prev) => ({
      ...prev,
      [studentInfo.studentId]: { ...studentInfo },
    }));

    // ✅ 입력 필드 초기화
    setStudentInfo({
      studentId: "",
      university: "",
      department: "",
      name: "",
      email: "",
      remarks: "",
    });

    // ✅ 등록 완료 후 alert 표시
    setTimeout(() => {
      alert("학생 등록이 완료되었습니다.");
    }, 100);
  } catch (error) {
    console.error("수강생 등록 실패:", error);
  }
};

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <button className="close-button" onClick={onClose}>X</button>
        <h3>수강생 관리</h3>
  
        <select onChange={(e) => setSelectedClassId(e.target.value)} value={selectedClassId}>
          <option value="">강의실 선택</option>
          {classrooms.map((classroom) => (
            <option key={classroom.classId} value={classroom.classId}>
              {classroom.className}
            </option>
          ))}
        </select>
  
        <div className="table-container">
          {selectedClassId && students.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>학번</th>
                  <th>이름</th>
                  <th>대학</th>
                  <th>학과</th>
                  <th>이메일</th>
                  <th>비고</th>
                  <th>수정</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId}>
                    <td>{student.studentId}</td>
                    <td>
                      <input
                        type="text"
                        value={editingData[student.studentId]?.name || ""}
                        onChange={(e) => handleEditChange(student.studentId, "name", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editingData[student.studentId]?.university || ""}
                        onChange={(e) => handleEditChange(student.studentId, "university", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editingData[student.studentId]?.department || ""}
                        onChange={(e) => handleEditChange(student.studentId, "department", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="email"
                        value={editingData[student.studentId]?.email || ""}
                        onChange={(e) => handleEditChange(student.studentId, "email", e.target.value)}
                      />
                    </td>
                    <td>
                      <input
                        type="text"
                        value={editingData[student.studentId]?.remarks || ""}
                        onChange={(e) => handleEditChange(student.studentId, "remarks", e.target.value)}
                      />
                    </td>
                    <td>
                      <button onClick={() => handleSaveUpdate(student.studentId)}>수정</button>
                    </td>
                    <td>
                      <button onClick={() => handleDeleteStudent(student.studentId)}>삭제</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>해당 강의실에 등록된 학생이 없습니다.</p>
          )}
        </div>
  
        <h4>새로운 수강생 등록</h4>
        <div className="form-container">
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
        </div>
      </div>
    </div>
  );
  

};

export default StudentManagement;
