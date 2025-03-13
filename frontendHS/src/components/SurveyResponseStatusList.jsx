import { useEffect, useState } from "react";
import { fetchSurveyResponseStatus } from "../api/surveyApi"; // ✅ API 함수 가져오기
import * as XLSX from "xlsx"; // ✅ 엑셀 다운로드용 라이브러리

const SurveyResponseStatusList = ({ surveyId, onBack }) => {
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sortOrder, setSortOrder] = useState("asc"); // ✅ 정렬 상태 ('asc' | 'desc')

  useEffect(() => {
    if (!surveyId) return;

    const fetchResponseStatus = async () => {
      setLoading(true);
      try {
        const data = await fetchSurveyResponseStatus(surveyId);
        setStudents(data);
      } catch (err) {
        setError("❌ 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResponseStatus();
  }, [surveyId]);

  /** ✅ "응답 여부" 정렬 함수 */
  const handleSort = () => {
    const sortedStudents = [...students].sort((a, b) => {
      if (sortOrder === "asc") {
        return a.responseStatus.localeCompare(b.responseStatus);
      } else {
        return b.responseStatus.localeCompare(a.responseStatus);
      }
    });

    setStudents(sortedStudents);
    setSortOrder(sortOrder === "asc" ? "desc" : "asc"); // ✅ 정렬 토글
  };

  /** ✅ 엑셀 다운로드 함수 */
  const handleDownloadExcel = () => {
    if (students.length === 0) {
      alert("❌ 다운로드할 데이터가 없습니다.");
      return;
    }

    // ✅ 엑셀에 저장할 데이터 변환
    const dataForExcel = students.map((student) => ({
      단과대학: student.university,
      학과: student.department,
      학번: student.studentId,
      이름: student.name,
      비고: student.remarks || "-",
      응답여부: student.responseStatus,
    }));

    // ✅ 워크시트 생성
    const worksheet = XLSX.utils.json_to_sheet(dataForExcel);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Survey Responses");

    // ✅ 파일 저장
    XLSX.writeFile(workbook, `설문_응답_상태_${surveyId}.xlsx`);
  };

  if (loading) return <p>📌 데이터를 불러오는 중...</p>;
  if (error) return <p className="error">{error}</p>;

  return (
    <div className="survey-response-list">
      <h2>📊 설문 응답 여부 목록</h2>

        {/* ✅ 돌아가기 버튼 추가 */}
        {onBack && (
          <button onClick={onBack} className="back-button" style={{ marginLeft: "10px" }}>
            ⬅ 돌아가기
          </button>
        )}

      {/* ✅ 엑셀 다운로드 버튼 */}
      <button onClick={handleDownloadExcel} style={{ marginBottom: "10px" }}>
        📥 엑셀 다운로드
      </button>

      {students.length === 0 ? (
        <p>📌 아직 응답 데이터가 없습니다.</p>
      ) : (
        <table>
          <thead>
            <tr>
              <th>단과대학</th>
              <th>학과</th>
              <th>학번</th>
              <th>이름</th>
              <th>비고</th>
              <th onClick={handleSort} style={{ cursor: "pointer" }}>
                응답 여부 {sortOrder === "asc" ? "🔼" : "🔽"}
              </th>
            </tr>
          </thead>
          <tbody>
            {students.map((student, index) => (
              <tr key={index}>
                <td>{student.university}</td>
                <td>{student.department}</td>
                <td>{student.studentId}</td>
                <td>{student.name}</td>
                <td>{student.remarks || "-"}</td>
                <td 
                className={student.responseStatus === "응답 완료" ? "completed" : "pending"}
                style={{ color: student.responseStatus === "미응답" ? "red" : "black" }} // ✅ 미응답이면 빨간색
                >
                {student.responseStatus}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default SurveyResponseStatusList;
