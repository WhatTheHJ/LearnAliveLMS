import { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../styles/RegisterStudent.css";

const collegeData = {
  "공과대학": ["건축공학과", "기계공학과", "컴퓨터공학과", "화학공학과"],
  "외국어대학": ["러시아어과", "스페인어과", "영어영문학과", "중국어과", "일본어과"],
  "인문대학": ["국어국문학과", "독어독문학과", "사학과", "철학과"],
  // 필요에 따라 더 추가
};

const RegisterStudent = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    studentId: "",
    name: "",
    password: "",
    email: "",
    phone: "",
    university: "",  // 단과대학
    department: "",  // 학과
  });
  // 학번 중복 체크 관련 상태
  const [idCheckMessage, setIdCheckMessage] = useState("");
  const [isIdAvailable, setIsIdAvailable] = useState(null); // null: 체크 전, true/false: 결과

  // 일반적인 입력 핸들러
  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
    // 학번이 변경되면 중복 체크 상태 초기화
    if (e.target.name === "studentId") {
      setIdCheckMessage("");
      setIsIdAvailable(null);
    }
  };

  // 단과대학 선택 시, 학과를 초기화
  const handleUniversityChange = (e) => {
    setFormData(prev => ({
      ...prev,
      university: e.target.value,
      department: "" // 단과대학 바뀌면 학과 초기화
    }));
  };

  // 학과 선택 핸들러 (선택된 값만 저장)
  const handleDepartmentChange = (e) => {
    setFormData(prev => ({ ...prev, department: e.target.value }));
  };

  // 학번 중복 체크 함수
  const checkStudentId = async () => {
    if (!formData.studentId) {
      alert("학번을 먼저 입력하세요.");
      return;
    }
    try {
      // 학번 중복 확인 API 호출 (API 엔드포인트는 예시입니다.)
      const response = await axios.post(
        "http://localhost:8080/api/auth/checkStudentId",
        { studentId: formData.studentId }
      );
      if (response.data.available) {
        setIdCheckMessage("사용 가능한 학번입니다.");
        setIsIdAvailable(true);
      } else {
        setIdCheckMessage("중복된 학번입니다.");
        setIsIdAvailable(false);
      }
    } catch (error) {
      console.error("학번 중복 확인 실패:", error.response?.data || error.message);
      setIdCheckMessage("중복 확인에 실패했습니다.");
      setIsIdAvailable(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    // 학번 중복 체크가 되어 있지 않거나 중복된 경우 제출하지 않음
    if (isIdAvailable === false || isIdAvailable === null) {
      alert("학번 중복 확인을 해주세요.");
      return;
    }
    try {
      const response = await axios.post(
        "http://localhost:8080/api/auth/register/student",
        formData
      );
      alert(response.data.message);
      // 회원가입 성공 후 홈 화면으로 이동
      navigate("/");
    } catch (error) {
      console.error("회원가입 실패:", error.response?.data || error.message);
      alert("학생 회원가입 실패!");
    }
  };

  // 단과대학 목록을 가나다 순으로 정렬
  const sortedColleges = Object.keys(collegeData).sort();
  // 현재 선택된 단과대학에 해당하는 학과 목록 (가나다 순)
  const currentDepartments = formData.university
    ? collegeData[formData.university].sort()
    : [];

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>학생 회원가입</h2>

        {/* 학번 */}
        <div className="form-group">
          <label htmlFor="studentId">학번 </label>
          <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
            <input 
              type="text" 
              id="studentId" 
              name="studentId" 
              placeholder="st + 숫자 세자리를 입력하세요     (예시 -> st001)" 
              onChange={handleChange} 
              required 
            />
            <button type="button" onClick={checkStudentId} className="check-button">
              중복 확인
            </button>
          </div>
          {idCheckMessage && (
            <span className={`id-check-message ${isIdAvailable ? "success" : "error"}`}>
              {idCheckMessage}
            </span>
          )}
        </div>

        {/* 이름 */}
        <div className="form-group">
          <label htmlFor="name">이름</label>
          <input 
            type="text" 
            id="name" 
            name="name" 
            placeholder="이름" 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* 비밀번호 */}
        <div className="form-group">
          <label htmlFor="password">비밀번호</label>
          <input 
            type="password" 
            id="password" 
            name="password" 
            placeholder="영문 + 숫자 + 특수기호 조합을 권장합니다." 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* 이메일 */}
        <div className="form-group">
          <label htmlFor="email">이메일</label>
          <input 
            type="email" 
            id="email" 
            name="email" 
            placeholder="이메일" 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* 핸드폰번호 */}
        <div className="form-group">
          <label htmlFor="phone">핸드폰번호</label>
          <input 
            type="text" 
            id="phone" 
            name="phone" 
            placeholder="핸드폰번호" 
            onChange={handleChange} 
            required 
          />
        </div>

        {/* 단과대학 (select) */}
        <div className="form-group">
          <label htmlFor="university">단과대학</label>
          <select
            id="university"
            name="university"
            value={formData.university}
            onChange={handleUniversityChange}
            required
          >
            <option value="">-- 단과대학 선택 --</option>
            {sortedColleges.map(college => (
              <option key={college} value={college}>
                {college}
              </option>
            ))}
          </select>
        </div>

        {/* 학과 (select) */}
        <div className="form-group">
          <label htmlFor="department">학과</label>
          <select
            id="department"
            name="department"
            value={formData.department}
            onChange={handleDepartmentChange}
            required
            disabled={!formData.university} 
          >
            <option value="">-- 학과 선택 --</option>
            {currentDepartments.map(dept => (
              <option key={dept} value={dept}>
                {dept}
              </option>
            ))}
          </select>
        </div>

        

        <button type="submit" className="submit-button">회원가입</button>
      </form>
    </div>
  );
};

export default RegisterStudent;