import { useState, useEffect } from 'react';
import { fetchExams } from '../api/examApi';
import { useAuth } from '../context/AuthContext';
import ExamCreate from './ExamCreate';

const ExamList = ({ classId, setSelectedMenu, setSelectedExamId }) => {
  const { user } = useAuth();
  const [exams, setExams] = useState([]);
  const [isCreatingExam, setIsCreatingExam] = useState(false);

  useEffect(() => {
    if (!classId) return;

    fetchExams(classId)
      .then((data) => {
        console.log(data);
        setExams(data);
      })
      .catch((error) => {
        console.error('❌ 시험 목록을 불러오는 데 실패했습니다:', error);
      });
  }, [classId]);

  const handleExamCreated = () => {
    setIsCreatingExam(false);
    fetchExams(classId)
      .then((data) => {
        setExams(data);
      })
      .catch((error) => {
        console.error('❌ 시험 목록을 불러오는 데 실패했습니다:', error);
      });
  };

  if (!user) return <p>로그인 해주세요.</p>;

  return (
    <div className='container'>
      <h2 className='title-bar'>📝 시험 목록</h2>

      {isCreatingExam ? (
        <ExamCreate classId={classId} onExamCreated={handleExamCreated} />
      ) : (
        <>
        <br></br>
          {user.role === 'professor' && (
            <div style={{ textAlign: 'center' }}>
            <button onClick={() => setSelectedMenu('examCreate')} className='normal-button'>
              💁‍♀️ 시험 추가
            </button>
            </div>
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
                    <td
                      style={{ cursor: 'pointer', color: 'blue' }}
                      onClick={() => {
                        setSelectedExamId(exam.examId);
                        if (user.role === 'professor') {
                          setSelectedMenu('examDetail');
                        } else {
                          setSelectedMenu('examTake');
                        }
                      }}
                    >
                      {exam.title}
                    </td>
                    <td>{exam.profName || '-'}</td>
                    <td>{exam.questionCount || '-'}</td>
                    <td>{exam.startTime ? exam.startTime.toString() : '-'}</td>
                    <td>{exam.endTime ? exam.endTime.toString() : '-'}</td>
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
