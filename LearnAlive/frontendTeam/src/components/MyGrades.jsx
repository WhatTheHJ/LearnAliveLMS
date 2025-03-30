// import { useEffect, useState } from "react";
// import { useAuth } from "../context/AuthContext";
// import { fetchClassrooms, fetchExamScores } from "../api/classroomApi";

// const MyGrades = () => {
//   const { user } = useAuth();
//   const studentId = user?.userId; // 로그인한 학생의 아이디
//   const [grades, setGrades] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);

//   useEffect(() => {
//     if (!studentId) return;

//     // 학생이 등록된 강의 목록 불러오기
//     fetchClassrooms(studentId)
//       .then((classrooms) => {
//         // 각 강의별로 시험 점수 조회 후, 학생의 성적 정보 추출
//         return Promise.all(
//           classrooms.map(async (classroom) => {
//             try {
//               const scores = await fetchExamScores(classroom.classId);
//               // 해당 강의의 시험 성적 중 로그인한 학생의 정보 찾기
//               const record = scores.find(
//                 (score) => score.studentId.toString() === studentId.toString()
//               );
//               return {
//                 className: classroom.className,
//                 score: record ? record.score : "N/A",
//                 grade: record ? record.grade : "N/A",
//               };
//             } catch (err) {
//               return {
//                 className: classroom.className,
//                 score: "N/A",
//                 grade: "N/A",
//               };
//             }
//           })
//         );
//       })
//       .then((results) => {
//         setGrades(results);
//         setLoading(false);
//       })
//       .catch((err) => {
//         console.error(err);
//         setError("성적 정보를 불러오는데 실패했습니다.");
//         setLoading(false);
//       });
//   }, [studentId]);

//   if (loading) return <p>로딩 중...</p>;
//   if (error) return <p>{error}</p>;

//   return (
//     <div style={{ padding: "20px" }}>
//       <h2>내 성적</h2>
//       <table border="1" cellPadding="8" cellSpacing="0" style={{ width: "100%", textAlign: "center" }}>
//         <thead>
//           <tr>
//             <th>강의명</th>
//             <th>학점</th>
//             <th>등급</th>
//           </tr>
//         </thead>
//         <tbody>
//           {grades.map((item, index) => (
//             <tr key={index}>
//               <td>{item.className}</td>
//               <td>{item.score}</td>
//               <td>{item.grade}</td>
//             </tr>
//           ))}
//         </tbody>
//       </table>
//     </div>
//   );
// };

// export default MyGrades;








import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchClassrooms } from "../api/classroomApi";
import { fetchExams } from "../api/examApi";
import { fetchPastAttendance } from "../api/attendanceApi"; // 추가

const MyGrades = () => {
  const { user } = useAuth();
  const studentId = user?.userId; // 로그인한 학생의 아이디
  const [grades, setGrades] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // 점수에 따른 등급을 계산하는 함수 (총점 기준)
  const computeGrade = (score) => {
    if (score < 64) return "F";
    if (score < 67) return "D-";
    if (score < 70) return "D";
    if (score < 73) return "D+";
    if (score < 76) return "C-";
    if (score < 79) return "C";
    if (score < 82) return "C+";
    if (score < 85) return "B-";
    if (score < 88) return "B";
    if (score < 91) return "B+";
    if (score < 94) return "A-";
    if (score < 97) return "A";
    return "A+";
  };

  useEffect(() => {
    if (!studentId) return;

    // 이번 달인 3월을 조회하도록 설정 (예시: "2025-03")
    const targetMonth = "2025-03";
    // 이번 달의 시작일과 다음 달의 시작일을 정의합니다.
    const startOfMonth = `${targetMonth}-01`;
    const startOfNextMonth = "2025-04-01";

    // (1) 학생이 등록된 강의 목록과 3월 출석 기록(3월 기록은 date < "2025-04-01")을 동시에 불러옵니다.
    Promise.all([
      fetchClassrooms(studentId),
      fetchPastAttendance(studentId, startOfNextMonth)
    ])
      .then(([classrooms, attendanceRecords]) => {
        console.log("전체 출석 기록:", attendanceRecords);
        // attendanceRecords에는 4월 1일 이전의 모든 기록이 있으므로,
        // 이번 달(3월)만 필터링합니다.
        const filteredAttendanceRecords = attendanceRecords.filter(
          (record) => record.date.startsWith(targetMonth)
        );
        console.log("필터링된 3월 출석 기록:", filteredAttendanceRecords);

        // (2) 각 강의별로 시험 점수와 출결 점수를 계산합니다.
        return Promise.all(
          classrooms.map(async (classroom) => {
            try {
              // 시험 점수 가져오기 (예시로 첫 번째 시험 사용)
              const exams = await fetchExams(classroom.classId, studentId);
              const firstExam = exams.length > 0 ? exams[0] : null;
              // 시험 점수를 숫자로 변환 (없으면 "N/A")
              const examScore = firstExam ? Number(firstExam.score) : "N/A";

              // 출석 기록 중 해당 강의의 데이터만 필터링 (타입을 숫자로 변환하여 비교)
              const classAttendanceRecords = filteredAttendanceRecords.filter(
                (record) => Number(record.classId) === Number(classroom.classId)
              );
              console.log("강의 정보:", classroom.classId, classroom.className);
              console.log("매칭된 출결 기록:", classAttendanceRecords);

              // 결석 횟수 계산
              const absenceCount = classAttendanceRecords.filter(
                (record) => record.state === "absent"
              ).length;
              // 지각 횟수 계산
              const lateCount = classAttendanceRecords.filter(
                (record) => record.state === "late"
              ).length;
              // 차감 계산: 결석은 1점씩, 지각은 2번당 1점 차감
              const deduction = absenceCount + Math.floor(lateCount / 2);
              const attendanceScore = Math.max(10 - deduction, 0);

              // 총점 = 시험 점수 + 출결 점수 (시험 점수가 숫자인 경우)
              const totalScore =
                examScore !== "N/A" ? examScore + attendanceScore : "N/A";

              return {
                className: classroom.className,
                score: examScore,
                attendanceScore, // 추가된 출결 점수
                totalScore,       // 총점(시험 점수 + 출결 점수)
                grade: totalScore !== "N/A" ? computeGrade(totalScore) : "N/A",
              };
            } catch (err) {
              return {
                className: classroom.className,
                score: "N/A",
                attendanceScore: "N/A",
                totalScore: "N/A",
                grade: "N/A",
              };
            }
          })
        );
      })
      .then((results) => {
        // (3) 결과를 state에 저장
        setGrades(results);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setError("성적 정보를 불러오는데 실패했습니다.");
        setLoading(false);
      });
  }, [studentId]);

  // 로딩/에러 처리
  if (loading) return <p>로딩 중...</p>;
  if (error) return <p>{error}</p>;

  // 성적 테이블 렌더링 (총점과 등급 계산)
  return (
    <div style={{ padding: "20px" }}>
      <h2>내 성적</h2>
      <table
        border="1"
        cellPadding="8"
        cellSpacing="0"
        style={{ width: "100%", textAlign: "center" }}
      >
        <thead>
          <tr>
            <th>강의명</th>
            <th>시험 점수</th>
            <th>출결 점수</th>
            <th>총점</th>
            <th>등급</th>
          </tr>
        </thead>
        <tbody>
          {grades.map((item, index) => (
            <tr key={index}>
              <td>{item.className}</td>
              <td>{item.score}</td>
              <td>{item.attendanceScore}</td>
              <td>{item.totalScore}</td>
              <td>{item.grade}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
};

export default MyGrades;
