import { useState } from "react";
import { useParams, Link } from "react-router-dom";
import { studentCheckIn } from "../api/attendanceApi";
import { useAuth } from "../context/AuthContext";

const AttendancePage = () => {
  const { classId } = useParams();
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [message, setMessage] = useState("");

  const handleCheckIn = async () => {
    if (!user || user.role !== "student") {
      setMessage("학생만 출석할 수 있습니다.");
      return;
    }

    if (!classId || isNaN(Number(classId))) {
      setMessage("올바른 강의실 정보가 없습니다.");
      return;
    }

    const date = new Date().toISOString().split("T")[0]; // 오늘 날짜
    const studentId = user.userId; // 로그인된 학생 ID

    try {
      const response = await studentCheckIn(studentId, Number(classId), date); // ✅ 객체가 아니라 개별 인자로 전달
      setMessage(response.data || "출석 완료!");
    } catch (error) {
      console.error("출석 요청 실패:", error);

      if (error.response) {
        // ✅ 서버에서 반환된 JSON 데이터를 문자열로 변환하여 표시
        const errorMsg =
          typeof error.response.data === "string"
            ? error.response.data
            : JSON.stringify(error.response.data, null, 2);
        setMessage(errorMsg);
      } else {
        setMessage("서버와 통신 중 오류가 발생했습니다.");
      }
    }
  };

  return (
    <div>
      <h2>출석하기</h2>
      <button onClick={handleCheckIn}>출석하기</button>
      {message && <p>{message}</p>}

      <Link to="/">
        <button style={{ marginTop: "20px" }}>메인으로 돌아가기</button>
      </Link>
    </div>
  );
};

export default AttendancePage;
