import React, { useState, useEffect } from "react";
import axios from "axios";

const CreateProfessor = ({ professor, onClose, onProfessorAdded, onProfessorUpdated }) => {
  const [name, setName] = useState("");
  const [department, setDepartment] = useState("");
  const [email, setEmail] = useState("");
  const [profId, setProfId] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [phone, setPhone] = useState(""); // ✅ 전화번호 추가
  const [university, setUniversity] = useState(""); // ✅ 소속 대학 추가

  useEffect(() => {
    if (professor) {
      setProfId(professor.prof_id);
      setName(professor.name);
      setDepartment(professor.department);
      setEmail(professor.email);
      setPhone(professor.phone || ""); // ✅ 기존 정보 불러오기
      setUniversity(professor.university || ""); // ✅ 기존 정보 불러오기
      setCurrentPassword(professor.password || "");
    } else {
      setProfId("");
      setName("");
      setDepartment("");
      setEmail("");
      setPhone(""); // ✅ 초기화
      setUniversity(""); // ✅ 초기화
      setCurrentPassword("");
    }
  }, [professor]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const professorData = {
      prof_id: profId,
      name,
      department,
      email,
      password: currentPassword,
      phone, // ✅ 추가
      university, // ✅ 추가
    };

    try {
      const token = localStorage.getItem("token");
      const headers = { Authorization: `Bearer ${token}` };

      let response;
      if (professor) {
        // 교수 정보를 수정하는 경우
        response = await axios.put(
          `http://localhost:8080/api/professors/${professor.prof_id}`,
          professorData,
          { headers }
        );
        onProfessorUpdated(response.data);
      } else {
        // 새로운 교수 정보를 추가하는 경우
        response = await axios.post(
          "http://localhost:8080/api/professors/add",
          professorData,
          { headers }
        );
        onProfessorAdded(response.data);
      }

      onClose();
    } catch (error) {
      console.error("교수자 생성/수정 실패", error.response ? error.response.data : error.message);
    }
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="form-group">
        <label htmlFor="profId">교수자 ID</label>
        <input
          type="text"
          className="form-control"
          id="profId"
          value={profId}
          onChange={(e) => setProfId(e.target.value)}
          disabled={!!professor}
        />
      </div>
      <div className="form-group">
        <label htmlFor="name">이름</label>
        <input
          type="text"
          className="form-control"
          id="name"
          value={name}
          onChange={(e) => setName(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="department">학과</label>
        <input
          type="text"
          className="form-control"
          id="department"
          value={department}
          onChange={(e) => setDepartment(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="email">이메일</label>
        <input
          type="email"
          className="form-control"
          id="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="phone">전화번호</label> {/* ✅ 전화번호 입력 필드 추가 */}
        <input
          type="text"
          className="form-control"
          id="phone"
          value={phone}
          onChange={(e) => setPhone(e.target.value)}
          required
        />
      </div>
      <div className="form-group">
        <label htmlFor="university">소속 대학</label> {/* ✅ 소속 대학 입력 필드 추가 */}
        <input
          type="text"
          className="form-control"
          id="university"
          value={university}
          onChange={(e) => setUniversity(e.target.value)}
          required
        />
      </div>

      {professor && (
        <div className="form-group">
          <label htmlFor="currentPassword">현재 비밀번호</label>
          <input
            type="text"
            className="form-control"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
          />
        </div>
      )}

      {!professor && (
        <div className="form-group">
          <label htmlFor="currentPassword">비밀번호</label>
          <input
            type="password"
            className="form-control"
            id="currentPassword"
            value={currentPassword}
            onChange={(e) => setCurrentPassword(e.target.value)}
            required
          />
        </div>
      )}

      <button type="submit" className="btn btn-primary mt-3">
        {professor ? "수정하기" : "교수자 생성"}
      </button>
      <button type="button" className="btn btn-secondary mt-3" onClick={onClose}>
        취소
      </button>
    </form>
  );
};

export default CreateProfessor;
