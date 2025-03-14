import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { fetchClassSettings, updateClassSettings } from "../api/classroomApi";
import "../styles/ClassSettings.css"; // ✅ 스타일 추가

const ClassSettings = () => {
  const { classId } = useParams();
  const navigate = useNavigate();
  const [settings, setSettings] = useState({
    startTime: "09:00:00",
    endTime: "11:00:00",
    presentStart: "08:45:00",
    presentEnd: "09:15:00",
    lateEnd: "11:00:00",
  });
  const [message, setMessage] = useState("");

  useEffect(() => {
    fetchClassSettings(classId)
      .then((data) => setSettings(data))
      .catch(() => setMessage("❌ 출석 시간 정보를 불러오지 못했습니다."));
  }, [classId]);

  const handleChange = (e) => {
    setSettings({ ...settings, [e.target.name]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      await updateClassSettings(classId, settings);
      setMessage("✅ 출석 시간이 업데이트되었습니다.");
    } catch (error) {
      setMessage("❌ 출석 시간 업데이트 실패.");
    }
  };

  return (
    <div className="class-settings-container">
      <h2>📌 강의실 출석 시간 설정</h2>
      {message && <p className="message">{message}</p>}

      <div className="settings-box"> {/* ✅ 박스 추가 */}
        <div className="settings-group">
          <label>📌 수업 시작 시간:</label>
          <input type="time" name="startTime" value={settings.startTime} onChange={handleChange} />
        </div>

        <div className="settings-group">
          <label>⏰ 수업 종료 시간:</label>
          <input type="time" name="endTime" value={settings.endTime} onChange={handleChange} />
        </div>

        <div className="settings-group">
          <label>✅ 출석 인정 시작 시간:</label>
          <input type="time" name="presentStart" value={settings.presentStart} onChange={handleChange} />
        </div>

        <div className="settings-group">
          <label>🕒 출석 인정 종료 시간:</label>
          <input type="time" name="presentEnd" value={settings.presentEnd} onChange={handleChange} />
        </div>

        <div className="settings-group">
          <label>⚠️ 지각 인정 종료 시간:</label>
          <input type="time" name="lateEnd" value={settings.lateEnd} onChange={handleChange} />
        </div>
      </div>

      <div className="button-group">
        <button onClick={handleSubmit}>저장</button>
        <button className="cancel-button" onClick={() => navigate(-1)}>뒤로 가기</button> {/* ✅ 회색 버튼 */}
      </div>
      <br></br><br></br><br></br><br></br><br></br>
    </div>
  );
};

export default ClassSettings;
