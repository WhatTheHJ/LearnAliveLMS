import { useState, useEffect } from 'react';
import { fetchExams, ExamResultsByExamId } from '../api/examApi';
import { useAuth } from '../context/AuthContext';
import ExamCreate from './ExamCreate';
import { Link, useNavigate, useParams } from 'react-router-dom';
import ExamResults from '../components/ExamResults';

const ExamList = () => {
  const { classId } = useParams(); // URL에서 classId를 가져오기
  const { user } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
  const [exams, setExams] = useState([]); // 시험 목록 상태
  const [isCreatingExam, setIsCreatingExam] = useState(false); // 시험 생성 화면 표시 여부
  const [ResultsOpen, setResultsOpen] = useState(false); // 모든 학생 시험결과
  const [selectedExamId, setSelectedExamId] = useState(null); // 선택된 시험 ID
  const [examResults, setExamResults] = useState([]); // 응시자 시험 결과 리스트
  const navigate = useNavigate(); // 페이지 이동을 위한 훅

  const currentPath = window.location.pathname;

  useEffect(() => {
    if (!classId || !user) return; // user가 null이면 데이터 가져오지 않음

    fetchExams(classId, user.userId)
      .then((data) => {
        console.log(data);
        console.log('user.userId:' + user.userId);
        setExams(data);
      })
      .catch((error) => {
        console.error('❌ 시험 목록을 불러오는 데 실패했습니다:', error);
      });
  }, [classId, user]);

  const handleExamCreated = () => {
    setIsCreatingExam(false); // 목록 화면으로 전환
    fetchExams(classId, user.userId)
      .then((data) => {
        setExams(data); // 시험 목록 갱신
      })
      .catch((error) => {
        console.error('❌ 시험 목록을 불러오는 데 실패했습니다:', error);
      });
  };

  const openExamResults = (examId) => {
    setSelectedExamId(examId);
    ExamResultsByExamId(examId) // 시험 결과를 가져오기
      .then((data) => {
        setExamResults(data);
        console.log(data); // data가 제대로 전달되는지 확인
        setResultsOpen(true); // 시험 결과 열기
      })
      .catch((error) => {
        console.error('❌ 시험 결과를 불러오는 데 실패했습니다:', error);
      });
  };

  const handleExamClick = (exam) => {
    if (exam.score) {
      // 이미 응시한 시험이면 결과 페이지로 이동
      navigate(`/exam_result/${exam.classId}/${exam.examId}`);
    } else {
      // 미응시한 시험이면 응시 페이지로 이동
      navigate(`/exam_take/${exam.classId}/${exam.examId}`);
    }
  };

  if (!user) {
    return <p>로그인 해주세요.</p>; // 로그인되지 않은 경우
  }

  console.log(selectedExamId);

  return (
    <div>
      <h2>📝 시험 목록</h2>

      {isCreatingExam ? (
        <ExamCreate classId={classId} onExamCreated={handleExamCreated} />
      ) : (
        <>
          {user.role === 'professor' && (
            <>
              <Link to={`${currentPath}/examadd`}>
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
                  <th>시험 점수</th>
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
                        <button
                          onClick={() => handleExamClick(exam)}
                          style={{
                            backgroundColor: 'transparent',
                            color: 'inherit',
                            fontSize: '15px',
                            padding: '0',
                          }}
                        >
                          {exam.title}
                        </button>
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
                    <td>
                      {user.role === 'STUDENT' ? (
                        exam.score || '미응시'
                      ) : (
                        <button onClick={() => openExamResults(exam.examId)}>
                          점수 조회
                        </button>
                      )}
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
      {/* 교수자가 점수 조회 버튼을 클릭했을 때 시험결과 띄우기 */}
      {ResultsOpen && (
        <ExamResults
          isOpen={ResultsOpen} // 제대로 전달되는지 확인
          onClose={() => setResultsOpen(false)}
          examResults={examResults}
        />
      )}
    </div>
  );
};
export default ExamList;
