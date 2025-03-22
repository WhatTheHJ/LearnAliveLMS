import React, { useEffect, useState } from "react";
import axios from "axios";
import { useAuth } from "../context/AuthContext";
import CreateProfessor from "../components/CreateProfessor";
import { useNavigate } from "react-router-dom";

const ProfessorStatus = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [professors, setProfessors] = useState([]);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [username, setUsername] = useState("");
  const [role, setRole] = useState("");
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [editingProfessor, setEditingProfessor] = useState(null);

  useEffect(() => {
    if (!user) {
      navigate("/");
    } else if (user.role === "ADMIN") {
      fetchProfessors();
      setIsLoggedIn(true);
      setUsername(user.username);
      setRole(user.role);
    }
  }, [user, navigate]);

  const fetchProfessors = async () => {
    try {
      const response = await axios.get("http://localhost:8080/api/professors", {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });
      setProfessors(response.data);
    } catch (error) {
      console.error("교수 목록을 불러오는 데 실패했습니다.", error);
    }
  };

  const handleCreateProfessorClick = () => {
    setEditingProfessor(null);
    setShowCreateModal(true);
  };

  const handleCloseModal = () => {
    setShowCreateModal(false);
    setEditingProfessor(null);
  };

  const handleEditProfessor = (professor) => {
    setEditingProfessor(professor);
    setShowCreateModal(true);
  };

  const handleDeleteProfessor = async (prof_id) => {
    try {
      const response = await axios.delete(`http://localhost:8080/api/professors/${prof_id}`, {
        headers: {
          Authorization: `Bearer ${user.token}`,
        },
      });

      if (response.data.success) {
        alert(response.data.message);
        setProfessors(professors.filter((professor) => professor.prof_id !== prof_id));
      } else {
        alert(response.data.message);
      }
    } catch (error) {
      console.error("교수 삭제 실패", error);
      alert("교수 삭제에 실패했습니다.");
    }
  };

  const handleProfessorAdded = (newProfessor) => {
    setProfessors((prevProfessors) => [...prevProfessors, newProfessor]);
  };

  const handleProfessorUpdated = (updatedProfessor) => {
    setProfessors((prevProfessors) =>
      prevProfessors.map((professor) =>
        professor.prof_id === updatedProfessor.prof_id ? updatedProfessor : professor
      )
    );
  };

  useEffect(() => {
    if (user && user.role === "ADMIN") {
      fetchProfessors();
    }
  }, [user]);

  if (!user || user.role !== "ADMIN") {
    return <p>관리자 권한이 필요합니다. <a href="/login">로그인 페이지로 가기</a></p>;
  }

  return (
    <div className="container mt-5">
      <h2>교수자 현황</h2>
      {isLoggedIn ? (
        <>
          <p>안녕하세요, {username}님! ({role})</p>
          <button className="btn btn-primary" onClick={handleCreateProfessorClick}>
            교수자 생성
          </button>
          <table className="table mt-3">
            <thead>
              <tr>
                <th>교수자 ID</th>
                <th>이름</th>
                <th>학과</th>
                <th>이메일</th>
                <th>전화번호</th> {/* ✅ 전화번호 추가 */}
                <th>소속 대학</th> {/* ✅ 소속 대학 추가 */}
                <th>수정</th>
                <th>삭제</th>
              </tr>
            </thead>
            <tbody>
              {professors.map((professor) => (
                <tr key={professor.prof_id}>
                  <td>{professor.prof_id}</td>
                  <td>{professor.name}</td>
                  <td>{professor.department}</td>
                  <td>{professor.email}</td>
                  <td>{professor.phone}</td> {/* ✅ 전화번호 출력 */}
                  <td>{professor.university}</td> {/* ✅ 소속 대학 출력 */}
                  <td>
                    <button
                      className="btn btn-warning"
                      onClick={() => handleEditProfessor(professor)}
                    >
                      수정
                    </button>
                  </td>
                  <td>
                    <button
                      className="btn btn-danger"
                      onClick={() => handleDeleteProfessor(professor.prof_id)}
                    >
                      삭제
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {showCreateModal && (
            <div className="modal fade show" style={{ display: "block" }} tabIndex="-1" aria-hidden="true">
              <div className="modal-dialog">
                <div className="modal-content">
                  <div className="modal-header">
                    <h5 className="modal-title">
                      {editingProfessor ? "교수자 수정" : "교수자 계정 생성"}
                    </h5>
                    <button type="button" className="btn-close" onClick={handleCloseModal}></button>
                  </div>
                  <div className="modal-body">
                    <CreateProfessor
                      professor={editingProfessor}
                      onClose={handleCloseModal}
                      onProfessorAdded={handleProfessorAdded}
                      onProfessorUpdated={handleProfessorUpdated}
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <p>로그인 후 교수자 현황을 확인할 수 있습니다.</p>
      )}
    </div>
  );
};

export default ProfessorStatus;