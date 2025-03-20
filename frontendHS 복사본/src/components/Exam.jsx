// src/components/Exam.jsx
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { fetchExamScores, updateExamScore, insertExamScore } from "../api/examApi";

const Exam = () => {
  const { classId } = useParams();
  const [examScores, setExamScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  
  // 등급 옵션
  const gradeOptions = ["A+", "A", "A-", "B+", "B", "B-", "C+", "C", "C-", "D", "F"];

  useEffect(() => {
    fetchExamScores(classId)
      .then((data) => {
        // 백엔드에서 학생 이름이 함께 제공되지 않으면 임시로 placeholder를 넣습니다.
        const scoresWithName = data.map((item) => ({
          ...item,
          studentName: item.studentName || "학생 이름"
        }));
        setExamScores(scoresWithName);
        setLoading(false);
      })
      .catch((err) => {
        setError("시험 점수 정보를 불러오지 못했습니다.");
        setLoading(false);
      });
  }, [classId]);

  // 점수 input 변경 핸들러
  const handleScoreChange = (index, newScore) => {
    const updatedScores = [...examScores];
    updatedScores[index].score = newScore;
    setExamScores(updatedScores);
  };

  // 등급 select 변경 핸들러
  const handleGradeChange = (index, newGrade) => {
    const updatedScores = [...examScores];
    updatedScores[index].grade = newGrade;
    setExamScores(updatedScores);
  };

  // 모든 행의 업데이트/삽입 요청 처리
  const handleSaveAll = () => {
    const requests = examScores.map(scoreData => {
      const { examId, studentId, score, grade } = scoreData;
      if (examId) {
        // 기존 레코드가 있으면 업데이트 호출
        return updateExamScore(classId, studentId, score, grade);
      } else {
        // 레코드가 없으면 삽입 호출
        return insertExamScore(classId, studentId, score, grade);
      }
    });
    Promise.all(requests)
      .then(() => {
        alert("모든 성적이 저장되었습니다.");
      })
      .catch(() => {
        alert("저장에 실패하였습니다.");
      });
  };

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px", position: "relative" }}>
      <h2>채점</h2>
      {/* 테이블 우측 상단에 전역 저장 버튼 */}
      <button 
        onClick={handleSaveAll} 
        style={{ position: "absolute", top: "20px", right: "20px" }}
      >
        저장
      </button>
      <table 
        border="1" 
        cellPadding="8" 
        cellSpacing="0" 
        style={{ width: "100%", textAlign: "center", marginTop: "60px" }}
      >
        <thead>
          <tr>
            <th>학번</th>
            <th>이름</th>
            <th>학점</th>
            <th>등급</th>
          </tr>
        </thead>
        <tbody>
          {examScores.map((scoreData, index) => (
            <tr key={scoreData.studentId}>
              <td>{scoreData.studentId}</td>
              <td>{scoreData.studentName}</td>
              <td>
                <input
                  type="text"
                  value={scoreData.score || ""}
                  onChange={(e) => handleScoreChange(index, e.target.value)}
                  placeholder="0 ~ 100"
                />
              </td>
              <td>
                <select
                  value={scoreData.grade || "F"}
                  onChange={(e) => handleGradeChange(index, e.target.value)}
                >
                  {gradeOptions.map((option) => (
                    <option key={option} value={option}>
                      {option}
                    </option>
                  ))}
                </select>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default Exam;
