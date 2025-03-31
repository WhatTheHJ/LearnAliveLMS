import { useState, useEffect } from "react";
import { fetchAllClassrooms } from "../api/classroomApi";
import { fetchStudentsByClass, searchStudents, registerStudentToClass, updateStudent, deleteStudent } from "../api/studentApi";

const StudentManagementModal = ({ onClose }) => {
  const [classrooms, setClassrooms] = useState([]);
  const [selectedClassId, setSelectedClassId] = useState("");
  const [students, setStudents] = useState([]);
  const [editingData, setEditingData] = useState({});
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });
  // const [studentInfo, setStudentInfo] = useState({
  //   studentId: "",
  //   university: "",
  //   department: "",
  //   name: "",
  //   email: "",
  //   remarks: "",
  // });

  const [searchKeyword, setSearchKeyword] = useState("");
const [searchResults, setSearchResults] = useState([]);
const [registerRemarks, setRegisterRemarks] = useState("");


  useEffect(() => {
    fetchAllClassrooms()
      .then((data) => setClassrooms(data))
      .catch((error) => console.error("강의실 목록 불러오기 실패:", error));
  }, []);

  useEffect(() => {
    if (selectedClassId) {
      fetchStudentsByClass(selectedClassId)
        .then((data) => {
          setStudents(data);
          setEditingData(
            data.reduce((acc, student) => {
              acc[student.studentId] = { ...student };
              return acc;
            }, {})
          );
        })
        .catch((error) => console.error("수강생 목록 불러오기 실패:", error));
    }
  }, [selectedClassId]);

  //전체 학생에서 검색 기능
  const handleSearch = async () => {
    try {
      const data = await searchStudents(searchKeyword);
      console.log("검색 결과:", data);  // 찍어서 확인 필수
      setSearchResults(Array.isArray(data) ? data : []); // 안전하게
    } catch (error) {
      console.error("검색 실패:", error);
    }
  };
  
  //학생 등록 기능
const handleRegisterToClass = async (studentId) => {
  try {
    console.log("등록할 Class ID:", selectedClassId);
    await registerStudentToClass(studentId, selectedClassId, registerRemarks);
    alert("수강생 등록 완료");
    fetchStudentsByClass(selectedClassId).then(setStudents);
    setRegisterRemarks("");  // 입력창 초기화
  } catch (error) {
    console.error("수강생 강의실 등록 실패:", error);
  }
};


  const handleSort = (key) => {
    let direction = "asc";
    if (sortConfig.key === key && sortConfig.direction === "asc") {
      direction = "desc";
    }
    setSortConfig({ key, direction });

    const sortedStudents = [...students].sort((a, b) => {
      if (a[key] < b[key]) return direction === "asc" ? -1 : 1;
      if (a[key] > b[key]) return direction === "asc" ? 1 : -1;
      return 0;
    });

    setStudents(sortedStudents);
  };

  const getSortIndicator = (key) => {
    if (sortConfig.key !== key) return "";
    return sortConfig.direction === "asc" ? "🔼" : "🔽";
  };

  const handleEditChange = (studentId, field, value) => {
    setEditingData((prev) => ({
      ...prev,
      [studentId]: { ...prev[studentId], [field]: value },
    }));
  };

  const handleSaveUpdate = async (studentId) => {
    try {
      await updateStudent(studentId, editingData[studentId]);
      const updatedStudents = await fetchStudentsByClass(selectedClassId);
      setStudents(updatedStudents);
      setEditingData(
        updatedStudents.reduce((acc, student) => {
          acc[student.studentId] = { ...student };
          return acc;
        }, {})
      );
      alert("수정이 완료되었습니다.");
    } catch (error) {
      console.error("수강생 정보 수정 실패:", error);
    }
  };

  const handleDeleteStudent = async (studentId) => {
    if (!window.confirm("정말로 삭제하시겠습니까?")) return;
    try {
      await deleteStudent(studentId);
      setStudents((prev) => prev.filter((student) => student.studentId !== studentId));
    } catch (error) {
      console.error("수강생 삭제 실패:", error);
    }
  };


  return (
    <div className="modal-overlay">
      <div className="modal-window">
        <h3 className="mordal-title">수강생 관리</h3>
  
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
            <table className="student-table">
              <thead>
                <tr>
                  <th onClick={() => handleSort("university")}>단과대학 {getSortIndicator("university")}</th>
                  <th onClick={() => handleSort("department")}>학과 {getSortIndicator("department")}</th>
                  <th onClick={() => handleSort("studentId")}>학번 {getSortIndicator("studentId")}</th>
                  <th onClick={() => handleSort("name")}>이름 {getSortIndicator("name")}</th>
                  <th onClick={() => handleSort("remarks")}>비고 {getSortIndicator("remarks")}</th>
                  <th onClick={() => handleSort("email")}>이메일 {getSortIndicator("email")}</th>
                  <th>수정</th>
                  <th>삭제</th>
                </tr>
              </thead>
              <tbody>
                {students.map((student) => (
                  <tr key={student.studentId}>
                    <td><input type="text" value={editingData[student.studentId]?.university || ""} onChange={(e) => handleEditChange(student.studentId, "university", e.target.value)} /></td>
                    <td><input type="text" value={editingData[student.studentId]?.department || ""} onChange={(e) => handleEditChange(student.studentId, "department", e.target.value)} /></td>
                    <td><input type="text" value={editingData[student.studentId]?.studentId || ""} onChange={(e) => handleEditChange(student.studentId, "studentId", e.target.value)} /></td>
                    <td><input type="text" value={editingData[student.studentId]?.name || ""} onChange={(e) => handleEditChange(student.studentId, "name", e.target.value)} /></td>
                    <td><input type="text" value={editingData[student.studentId]?.remarks || ""} onChange={(e) => handleEditChange(student.studentId, "remarks", e.target.value)} /></td>
                    <td><input type="email" value={editingData[student.studentId]?.email || ""} onChange={(e) => handleEditChange(student.studentId, "email", e.target.value)} /></td>
                    <td><button onClick={() => handleSaveUpdate(student.studentId)}>수정</button></td>
                    <td><button onClick={() => handleDeleteStudent(student.studentId)}>삭제</button></td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>해당 강의실에 등록된 학생이 없습니다.</p>
          )}
        </div>
  
        <h3>학생 검색 후 강의실 등록</h3>
        <input
          type="text"
          placeholder="학번 또는 이름으로 검색"
          value={searchKeyword}
          onChange={(e) => setSearchKeyword(e.target.value)}
        />
        <button onClick={handleSearch}>검색</button>

        <div className="table-container">
        {searchResults.length > 0 && (
          <table className="student-table">
            <thead>
              <tr>
                <th>학번</th>
                <th>이름</th>
                <th>단과대학</th>
                <th>학과</th>
                <th>특이사항 입력</th>
                <th>등록</th>
              </tr>
            </thead>
            <tbody>
              {searchResults.map((student) => (
                <tr key={student.studentId}>
                  <td>{student.studentId}</td>
                  <td>{student.name}</td>
                  <td>{student.university}</td>
                  <td>{student.department}</td>
                  <td>
                    <input 
                      type="text" 
                      placeholder="ex) 재수강, 조교" 
                      value={registerRemarks} 
                      onChange={(e) => setRegisterRemarks(e.target.value)} 
                    />
                  </td>
                  <td><button onClick={() => handleRegisterToClass(student.studentId)}>등록</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
  
        <div className="button-container">
          <button className="delete-button" onClick={onClose}>닫기</button>
        </div>
      </div>
    </div>
  );  
};

export default StudentManagementModal;
