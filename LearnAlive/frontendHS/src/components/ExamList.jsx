import { useState, useEffect } from 'react';
import { fetchExams } from '../api/examApi';
import { useAuth } from '../context/AuthContext';
import Exam from './Exam';
import { Link } from 'react-router-dom';

const ExamList = ({ classId }) => {
  const { user } = useAuth(); // 현재 로그인한 사용자 정보 가져오기
  const [exams, setExams] = useState([]); // 시험 목록 상태
  const [isCreatingExam, setIsCreatingExam] = useState(false); // 시험 생성 화면 표시 여부
  const [isLoading, setIsLoading] = useState(true); // 로딩 상태

  const currentPath = window.location.pathname;

  useEffect(() => {
    fetchExams(classId) // 시험 목록 불러오기
      .then((data) => {
        setExams(data);
        setIsLoading(false); // 로딩 완료
      })
      .catch((error) => {
        console.error('❌ 시험 목록을 불러오는 데 실패했습니다:', error);
        setIsLoading(false); // 로딩 완료, 오류 처리
      });
  }, [classId]);

  const handleCreateExamClick = () => {
    setIsCreatingExam(true); // 시험 생성 화면으로 전환
  };

  const handleExamCreated = () => {
    setIsCreatingExam(false); // 목록 화면으로 전환
    setIsLoading(true); // 로딩 시작
    fetchExams(classId)
      .then((data) => {
        setExams(data);
        setIsLoading(false); // 로딩 완료
      })
      .catch((error) => {
        console.error('❌ 시험 목록을 불러오는 데 실패했습니다:', error);
        setIsLoading(false);
      });
  };

  if (!user) {
    return <p>로그인 해주세요.</p>; // 로그인되지 않은 경우
  }

  return (
    <div>
      <h2>📋 시험 목록</h2>

      {isCreatingExam ? (
        <Exam classId={classId} onExamCreated={handleExamCreated} />
      ) : (
        <>
          {user.role === 'professor' ? (
            <>
              {/* <button onClick={handleCreateExamClick}>💁‍♀️ 시험 추가</button> */}
              <Link to={`${currentPath}/add`}>
                <button>💁‍♀️ 시험 추가</button>
              </Link>

              {isLoading ? (
                <p>로딩 중...</p> // 로딩 중 메시지
              ) : exams.length > 0 ? (
                <ul>
                  {exams.map((exam) => (
                    <li key={exam.id}>{exam.title}</li>
                  ))}
                </ul>
              ) : (
                <p> 📌 아직 시험이 없습니다. 새로 추가해 보세요.</p>
              )}
            </>
          ) : (
            <p>학생 전용 시험 응시 페이지</p>
          )}
        </>
      )}
    </div>
  );
};

export default ExamList;
