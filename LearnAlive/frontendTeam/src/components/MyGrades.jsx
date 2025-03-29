import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchClassrooms, fetchExamScores } from "../api/classroomApi";

const MyGrades = () => {
  const { user } = useAuth();
  const studentId = user?.userId; // 로그인한 학생의 아이디
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!studentId) return;

    // 학생이 등록된 강의 목록 불러오기
    fetchClassrooms(studentId)
      .then((classrooms) => {
        // 각 강의별로 시험 점수 조회 후, 학생의 성적 정보 추출
        return Promise.all(
          classrooms.map(async (classroom) => {
            try {
              const scores = await fetchExamScores(classroom.classId);
              // 해당 강의의 시험 성적 중 로그인한 학생의 정보 찾기
              const record = scores.find(
                (score) => score.studentId.toString() === studentId.toString()
              );
              return {
                className: classroom.className,
                score: record ? record.score : "N/A",
                grade: record ? record.grade : "N/A",
              };
            } catch (err) {
              return {
                className: classroom.className,
                score: "N/A",
                grade: "N/A",
              };
            }
          })
        );
      })
      .then((results) => {
        setGrades(results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("성적 정보를 불러오는데 실패했습니다.");
        setLoading(false);
      });
  }, [studentId]);

  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  return (
    <div style={{ padding: "20px" }}>
      <h2>내 성적</h2>
      <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", textAlign: "center" }}>
        <thead>
          <tr>
            <th>강의명</th>
            <th>학점</th>
            <th>등급</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((item, index) => (
            <tr key={index}>
              <td>{item.className}</td>
              <td>{item.score}</td>
              <td>{item.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyGrades;