import { useEffect, useState } from "react";
import axios from "axios";

const AddClassroomModal = ({ onClose, onAddClassroom }) => {
  const [className, setClassName] = useState("");
  const [professors, setProfessors] = useState([]);
  const [selectedProf, setSelectedProf] = useState("");
  const [credit, setCredit] = useState(3);  // 학점 추가 예시
  const [capacity, setCapacity] = useState(30);  // 수용 인원 추가 예시
  const [courseType, setCourseType] = useState("전공");
  const [required, setRequired] = useState(false);
  const [startTime, setStartTime] = useState("09:00");
  const [endTime, setEndTime] = useState("11:00");
  const [presentStart, setPresentStart] = useState("08:45");
  const [presentEnd, setPresentEnd] = useState("09:15");
  const [lateEnd, setLateEnd] = useState("11:00");
  const [recommendedGrade, setRecommendedGrade] = useState([]);
  const [daysOfWeek, setDaysOfWeek] = useState([]);
  const [errors, setErrors] = useState({});  // ✅ 에러 상태 추가




  useEffect(() => {
    axios.get("http://localhost:8080/api/professors", {
      headers: { Authorization: `Bearer ${localStorage.getItem("token")}` }  // Bearer 추가
    })
    .then((res) => setProfessors(res.data))
    .catch((err) => console.error(err));
  }, []);  

  const handleSubmit = () => {
    const newErrors = {};
  
    if (!className.trim()) newErrors.className = "강의실 이름을 입력하세요.";
    if (!selectedProf) newErrors.profId = "담당 교수를 선택하세요.";
    if (credit === "" || credit < 1) newErrors.credit = "학점을 입력하세요.";
    if (capacity === "" || capacity < 1) newErrors.capacity = "수용 인원을 입력하세요.";
    if (daysOfWeek.length === 0) newErrors.daysOfWeek = "수업 요일을 선택하세요.";
    if (recommendedGrade.length === 0) newErrors.recommendedGrade = "권장 학년을 선택하세요.";
  
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      alert("필수 항목을 모두 작성해주세요.");
      return;
    }
  
    const payload = {
      className,
      profId: selectedProf,
      credit,
      capacity,
      courseType,
      required,
      startTime,
      endTime,
      presentStart,
      presentEnd,
      lateEnd,
      recommendedGrade,
      daysOfWeek
    };
  
    console.log("보내는 데이터", payload);
    onAddClassroom(payload);
  
    setClassName("");
    setErrors({});
  };

  return (
    <div className="modal-overlay">
      <div className="modal-window">
      <div className="modal-content">
  <h3 className="mordal-title">강의실 추가</h3>
<div className="modal-inner-bg">
  <div className="input-group">
    <label className="classroom-label">강의실 이름</label>
    <input
      type="text"
      className="modal-input"
      placeholder="강의실 이름을 입력하세요"
      value={className}
      onChange={(e) => setClassName(e.target.value)}
    />
    {errors.className && <p className="error-message">{errors.className}</p>}
  </div>

  <div className="input-group">
  <label className="classroom-label">담당 교수</label>
  <select
    value={selectedProf}
    onChange={(e) => setSelectedProf(e.target.value)}
    className="select-input"
    required
  >
    <option value="">교수 선택</option>
    {professors.map((prof) => (
      <option
        key={prof.prof_id}
        value={prof.prof_id}  // ✅ 반드시 prof_id만 value로 넘긴다
      >
        {prof.name} ({prof.prof_id})
      </option>
    ))}
  </select>
  {errors.profId && <p className="error-message">{errors.profId}</p>}
</div>


  <div className="input-group">
    <label className="classroom-label">학점</label>
    <input
    className="modal-input"
    type="number"
    placeholder="학점을 입력하세요"
    value={credit}
    min={1}
    max={3}
    step={1}
    onChange={(e) => {
      const value = Math.max(1, Math.min(3, Number(e.target.value)));
      setCredit(value);
    }}
    onWheel={(e) => e.target.blur()}  // ✅ 휠 막기
/>
{errors.credit && <p className="error-message">{errors.credit}</p>}
  </div>

  <div className="input-group">
    <label className="classroom-label">수용 인원</label>
    <input
    className="modal-input"
    type="number"
    placeholder="수용 인원을 입력하세요"
    value={capacity}
    min={1}
    onChange={(e) => {
      const value = Math.max(1, Number(e.target.value));
      setCapacity(value);
    }}
    onWheel={(e) => e.target.blur()}  // ✅ 휠 막기
/>
{errors.capacity && <p className="error-message">{errors.capacity}</p>}
  </div>

  <div className="input-group">
    <label className="classroom-label">과목 유형</label>
    <select value={courseType} onChange={(e) => setCourseType(e.target.value)} className="select-input">
      <option value="전공">전공</option>
      <option value="교양">교양</option>
    </select>
  </div>

  <div className="input-group">
  <label className="classroom-label">수업 요일 (복수 선택)</label>
  <div className="checkbox-group">
    {['월', '화', '수', '목', '금', '토', '일'].map((day) => (
      <label key={day}>
        <input
          type="checkbox"
          value={day}
          checked={daysOfWeek.includes(day)}
          onChange={(e) => {
            const value = e.target.value;
            setDaysOfWeek((prev) =>
              prev.includes(value) ? prev.filter((item) => item !== value) : [...prev, value]
            );
          }}
        />
        {day}
      </label>
    ))}
  </div>
  {errors.daysOfWeek && <p className="error-message">{errors.daysOfWeek}</p>}
</div>

  <div className="input-group">
  <label className="classroom-label">시작 시간</label>
  <input type="time" className="modal-input" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
</div>

<div className="input-group">
  <label className="classroom-label">종료 시간</label>
  <input type="time" className="modal-input" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
</div>

<div className="input-group">
  <label className="classroom-label">출석 시작 시간</label>
  <input type="time" className="modal-input" value={presentStart} onChange={(e) => setPresentStart(e.target.value)} />
</div>

<div className="input-group">
  <label className="classroom-label">출석 종료 시간</label>
  <input type="time" className="modal-input" value={presentEnd} onChange={(e) => setPresentEnd(e.target.value)} />
</div>

<div className="input-group">
  <label className="classroom-label">지각 인정 종료 시간</label>
  <input type="time" className="modal-input" value={lateEnd} onChange={(e) => setLateEnd(e.target.value)} />
</div>

<div className="input-group">
  <label className="classroom-label">권장 학년 (복수 선택 가능)</label>
  <div className="checkbox-group">
    {[1, 2, 3, 4].map((year) => (
      <label key={year}>
        <input
          type="checkbox"
          value={year}
          checked={recommendedGrade.includes(String(year))}
          onChange={(e) => {
            const value = e.target.value;
            setRecommendedGrade((prev) =>
              prev.includes(value)
                ? prev.filter((item) => item !== value)
                : [...prev, value]
            );
          }}
        />
        {year}학년
      </label>
    ))}
  </div>
  {errors.recommendedGrade && <p className="error-message">{errors.recommendedGrade}</p>}
</div>

  <div className="input-group">
    <label className="classroom-label">
      <input
        type="checkbox"
        checked={required}
        onChange={(e) => setRequired(e.target.checked)}
      />
      필수 과목 여부
    </label>
  </div>
  <br></br>
  <br></br>
  </div>
    <button onClick={handleSubmit} style={{background: "#00C1AF"}} >추가</button>
    <button onClick={onClose} style={{background: "#363A43"}}>취소</button>
  </div>
  <div>
  </div>
</div>
</div>
  );
};

export default AddClassroomModal;
