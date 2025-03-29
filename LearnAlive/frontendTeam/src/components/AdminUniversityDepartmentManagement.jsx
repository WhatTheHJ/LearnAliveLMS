import { useState, useEffect } from 'react';
import axios from 'axios';

const AdminUniversityDepartmentManagement = () => {
  // 대학 관련 상태
  const [newUniversity, setNewUniversity] = useState('');
  const [universityMessage, setUniversityMessage] = useState('');
  const [universities, setUniversities] = useState([]);
  const [editingUniversity, setEditingUniversity] = useState(null);
  const [editUniversityName, setEditUniversityName] = useState('');

  // 학과 관련 상태
  const [departmentName, setDepartmentName] = useState('');
  const [selectedUniversityId, setSelectedUniversityId] = useState('');
  const [departmentMessage, setDepartmentMessage] = useState('');
  const [departments, setDepartments] = useState([]);
  const [editingDepartment, setEditingDepartment] = useState(null);
  const [editDepartmentName, setEditDepartmentName] = useState('');

  // 대학, 학과 목록 조회 함수
  const fetchUniversities = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/universities');
      setUniversities(response.data);
    } catch (error) {
      console.error("대학 목록 조회 실패", error.response?.data || error.message);
    }
  };

  const fetchDepartments = async () => {
    try {
      const response = await axios.get('http://localhost:8080/api/admin/departments');
      console.log("departments from server:", response.data);
      setDepartments(response.data);
    } catch (error) {
      console.error("학과 목록 조회 실패", error.response?.data || error.message);
    }
  };

  useEffect(() => {
    fetchUniversities();
    fetchDepartments();
  }, []);

  // 대학 추가
  const handleAddUniversity = async (e) => {
    e.preventDefault();
    const trimmedName = newUniversity.trim();
    if (!trimmedName) {
      setUniversityMessage("유효한 대학명을 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/admin/university', { universityName: trimmedName });
      setUniversityMessage(response.data.message);
      setNewUniversity('');
      fetchUniversities();
    } catch (error) {
      console.error("대학 추가 실패:", error.response?.data || error.message);
      setUniversityMessage("대학 추가 실패: " + (error.response?.data?.message || ""));
    }
  };

  // 대학 수정
  const handleUpdateUniversity = async (univ) => {
    if (!editUniversityName.trim()) {
      setUniversityMessage("유효한 대학명을 입력해주세요.");
      return;
    }
    try {
      const response = await axios.put('http://localhost:8080/api/admin/university', { universityId: univ.universityId, universityName: editUniversityName.trim() });
      setUniversityMessage(response.data.message);
      setEditingUniversity(null);
      setEditUniversityName('');
      fetchUniversities();
    } catch (error) {
      console.error("대학 수정 실패:", error.response?.data || error.message);
      setUniversityMessage("대학 수정 실패: " + (error.response?.data?.message || ""));
    }
  };

  // 대학 삭제
  const handleDeleteUniversity = async (universityId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/admin/university/${universityId}`);
      setUniversityMessage(response.data.message);
      fetchUniversities();
    } catch (error) {
      console.error("대학 삭제 실패:", error.response?.data || error.message);
      setUniversityMessage("대학 삭제 실패: " + (error.response?.data?.message || ""));
    }
  };

  // 학과 추가
  const handleAddDepartment = async (e) => {
    e.preventDefault();
    if (!selectedUniversityId) {
      setDepartmentMessage("대학을 선택해주세요.");
      return;
    }
    const trimmedDeptName = departmentName.trim();
    if (!trimmedDeptName) {
      setDepartmentMessage("유효한 학과명을 입력해주세요.");
      return;
    }
    try {
      const response = await axios.post('http://localhost:8080/api/admin/department', { departmentName: trimmedDeptName, universityId: selectedUniversityId });
      setDepartmentMessage(response.data.message);
      setDepartmentName('');
      fetchDepartments();
    } catch (error) {
      console.error("학과 추가 실패:", error.response?.data || error.message);
      setDepartmentMessage("학과 추가 실패: " + (error.response?.data?.message || ""));
    }
  };

  // 학과 수정
  const handleUpdateDepartment = async (dept) => {
    if (!editDepartmentName.trim()) {
      setDepartmentMessage("유효한 학과명을 입력해주세요.");
      return;
    }
    try {
      const response = await axios.put('http://localhost:8080/api/admin/department', { departmentId: dept.departmentId, departmentName: editDepartmentName.trim(), universityId: dept.universityId });
      setDepartmentMessage(response.data.message);
      setEditingDepartment(null);
      setEditDepartmentName('');
      fetchDepartments();
    } catch (error) {
      console.error("학과 수정 실패:", error.response?.data || error.message);
      setDepartmentMessage("학과 수정 실패: " + (error.response?.data?.message || ""));
    }
  };

  // 학과 삭제
  const handleDeleteDepartment = async (departmentId) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/admin/department/${departmentId}`);
      setDepartmentMessage(response.data.message);
      fetchDepartments();
    } catch (error) {
      console.error("학과 삭제 실패:", error.response?.data || error.message);
      setDepartmentMessage("학과 삭제 실패: " + (error.response?.data?.message || ""));
    }
  };

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      {/* 메인 타이틀 스타일 */}
      <h1
        style={{
          fontSize: '2.5rem',
          color: '#4a4a4a',
          textAlign: 'center',
          marginBottom: '20px',
          borderBottom: '2px solid #ddd',
          paddingBottom: '10px'
        }}
      >
        대학 · 학과 관리
      </h1>

      <div>
        {/* 대학 관리 섹션 */}
        <div style={{ marginBottom: '40px' }}>
          <div>
            <h5 style={{ fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>대학 관리</h5>
          </div>
          <div>
            <form onSubmit={handleAddUniversity}>
              <div style={{ marginBottom: '10px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1rem',
                    color: '#555',
                    marginBottom: '5px'
                  }}
                >
                  새 단과대학 입력
                </label>
                <input
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  placeholder="새 단과대학 이름 입력"
                  value={newUniversity}
                  onChange={e => setNewUniversity(e.target.value)}
                />
              </div>
              <div>
                <button
                  style={{
                    padding: '8px 16px',
                    fontSize: '1rem',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#007BFF',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                  type="submit"
                >
                  추가
                </button>
              </div>
            </form>
            {universityMessage && <small style={{ color: 'red' }}>{universityMessage}</small>}

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>대학명</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {universities.filter(u => u).map(univ => (
                  <tr key={univ.universityId}>
                    <td style={{ padding: '10px 0' }}>
                      {editingUniversity?.universityId === univ.universityId ? (
                        <input value={editUniversityName} onChange={e => setEditUniversityName(e.target.value)} />
                      ) : (
                        univ.universityName
                      )}
                    </td>
                    <td style={{ padding: '10px 0' }}>
                      {editingUniversity?.universityId === univ.universityId ? (
                        <>
                          <button onClick={() => handleUpdateUniversity(univ)}>저장</button>
                          <button onClick={() => setEditingUniversity(null)}>취소</button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingUniversity(univ);
                              setEditUniversityName(univ.universityName);
                            }}
                          >
                            수정
                          </button>
                          <button onClick={() => handleDeleteUniversity(univ.universityId)}>삭제</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {universities.length === 0 && (
                  <tr>
                    <td colSpan="2">등록된 대학이 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* 학과 관리 섹션 */}
        <div>
          <div>
            <h5 style={{ fontWeight: 'bold', color: '#333', marginBottom: '15px' }}>학과 관리</h5>
          </div>
          <div>
            <form onSubmit={handleAddDepartment}>
              <div style={{ marginBottom: '10px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1rem',
                    color: '#555',
                    marginBottom: '5px'
                  }}
                >
                  학과 소속 단과대학 선택
                </label>
                <select
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  value={selectedUniversityId}
                  onChange={e => setSelectedUniversityId(e.target.value)}
                  required
                >
                  <option value="">단과대학 선택</option>
                  {universities.map(u => (
                    <option key={u.universityId} value={u.universityId}>
                      {u.universityName}
                    </option>
                  ))}
                </select>
              </div>
              <div style={{ marginBottom: '10px' }}>
                <label
                  style={{
                    display: 'block',
                    fontSize: '1rem',
                    color: '#555',
                    marginBottom: '5px'
                  }}
                >
                  새 학과명 입력
                </label>
                <input
                  style={{
                    width: '100%',
                    padding: '8px',
                    fontSize: '1rem',
                    border: '1px solid #ccc',
                    borderRadius: '4px'
                  }}
                  placeholder="새 학과명 입력"
                  value={departmentName}
                  onChange={e => setDepartmentName(e.target.value)}
                />
              </div>
              <div>
                <button
                  style={{
                    padding: '8px 16px',
                    fontSize: '1rem',
                    border: 'none',
                    borderRadius: '4px',
                    backgroundColor: '#28a745',
                    color: '#fff',
                    cursor: 'pointer'
                  }}
                  type="submit"
                >
                  추가
                </button>
              </div>
            </form>
            {departmentMessage && <small style={{ color: 'red' }}>{departmentMessage}</small>}

            <table style={{ width: '100%', borderCollapse: 'collapse', marginTop: '20px' }}>
              <thead>
                <tr>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>학과명</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>대학 ID</th>
                  <th style={{ borderBottom: '1px solid #ddd', padding: '10px 0' }}>액션</th>
                </tr>
              </thead>
              <tbody>
                {departments.filter(d => d).map(dept => (
                  <tr key={dept.departmentId}>
                    <td style={{ padding: '10px 0' }}>
                      {editingDepartment?.departmentId === dept.departmentId ? (
                        <input value={editDepartmentName} onChange={e => setEditDepartmentName(e.target.value)} />
                      ) : (
                        dept.departmentName
                      )}
                    </td>
                    <td style={{ padding: '10px 0' }}>{dept.universityId}</td>
                    <td style={{ padding: '10px 0' }}>
                      {editingDepartment?.departmentId === dept.departmentId ? (
                        <>
                          <button onClick={() => handleUpdateDepartment(dept)}>저장</button>
                          <button onClick={() => setEditingDepartment(null)}>취소</button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => {
                              setEditingDepartment(dept);
                              setEditDepartmentName(dept.departmentName);
                            }}
                          >
                            수정
                          </button>
                          <button onClick={() => handleDeleteDepartment(dept.departmentId)}>삭제</button>
                        </>
                      )}
                    </td>
                  </tr>
                ))}
                {departments.length === 0 && (
                  <tr>
                    <td colSpan="3">등록된 학과가 없습니다.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminUniversityDepartmentManagement;