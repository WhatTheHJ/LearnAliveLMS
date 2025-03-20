import { useState, useEffect } from 'react';
import { fetchExams } from '../api/examApi';
import { useAuth } from '../context/AuthContext';
import ExamCreate from './ExamCreate';
import { Link, useParams } from 'react-router-dom';
import '../styles/ExamCreate.css';

const ExamList = () => {
  const { classId } = useParams(); // URL에서 classId를 가져오기
  const { user } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
  const [exams, setExams] = useState([]); // 시험 목록 상태
  const [isCreatingExam, setIsCreatingExam] = useState(false); // 시험 생성 화면 표시 여부

  const currentPath = window.location.pathname;

  useEffect(() => {
    if (!classId) return; // classId가 없으면 요청 안 함

    fetchExams(classId)
      .then((data) => {
        console.log(data); // 데이터를 로그로 출력해 확인
        setExams(data);
      })
      .catch((error) => {
        console.error('❌ 시험 목록을 불러오는 데 실패했습니다:', error);
      });
  }, [classId]); // classId가 변경될 때만 실행

  const handleExamCreated = () => {
    setIsCreatingExam(false); // 목록 화면으로 전환
    fetchExams(classId)
      .then((data) => {
        setExams(data); // 시험 목록 갱신
      })
      .catch((error) => {
        console.error('❌ 시험 목록을 불러오는 데 실패했습니다:', error);
      });
  };

  if (!user) {
    return <p>로그인 해주세요.</p>; // 로그인되지 않은 경우
  }

  // if (user.role !== 'professor') {
  //   return <p>시험 목록을 볼 수 있는 권한이 없습니다.</p>; // 교수자 외에는 접근할 수 없게 처리
  // }

  return (
    <div>
      <h2>📝 시험 목록</h2>

      {isCreatingExam ? (
        <ExamCreate classId={classId} onExamCreated={handleExamCreated} />
      ) : (
        <>
          {user.role === 'professor' && (
            <>
              <Link to={`${currentPath}/add`}>
                <button>💁‍♀️ 시험 추가</button>
              </Link>
            </>
          )}

          {exams.length > 0 ? (
            <table>
              <thead>
                <tr>
                  <th>시험명</th>
                  <th>담당 교수</th>
                  <th>문항수</th>
                  <th>시험 시작</th>
                  <th>시험 종료</th>
                </tr>
              </thead>
              <tbody>
                {exams.map((exam) => (
                  <tr key={exam.examId}>
                    <td>
                      {user.role === 'professor' ? (
                        <Link
                          to={`/exam/${exam.examId}`}
                          className="exam-title-link"
                        >
                          {exam.title}
                        </Link>
                      ) : (
                        <Link
                          to={`/exam_take/${exam.classId}/${exam.examId}`}
                          className="exam-title-link"
                        >
                          {exam.title}
                        </Link>
                      )}
                    </td>
                    <td>{exam.profName ? exam.profName.toString() : '-'}</td>
                    <td>{exam.questionCount ? exam.questionCount : '-'}</td>
                    <td>
                      {exam.startTime ? exam.startTime.replace('T', ' ') : '-'}
                    </td>
                    <td>
                      {exam.endTime ? exam.endTime.replace('T', ' ') : '-'}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          ) : (
            <p>📌 아직 시험이 개설되지 않았습니다.</p>
          )}
        </>
      )}
    </div>
  );
};
export default ExamList;
