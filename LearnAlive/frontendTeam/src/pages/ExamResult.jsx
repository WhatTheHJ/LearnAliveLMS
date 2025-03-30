import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { fetchExamResult } from '../api/examApi';
import { useAuth } from '../context/AuthContext';
import '../styles/ExamResult.css';

const ExamResult = () => {
  const { examId } = useParams();
  const { classId } = useParams();
  const { user } = useAuth(); // user 객체에서 studentId를 가져옵니다.
  const navigate = useNavigate();
  const [result, setResult] = useState(null);

  useEffect(() => {
    if (!user) return; // user가 존재할 때만 실행

    const loadResult = async () => {
      try {
        const data = await fetchExamResult(examId, user.userId);
        console.log('📥 시험 결과 데이터:', data);
        setResult(data);
      } catch (error) {
        console.error('시험 결과를 불러오는 데 실패했습니다.', error);
      }
    };
    loadResult();
  }, [examId, user]);
  console.log('📥 시험 result:', result);
  if (!result) {
    return <p className="loading">시험 결과를 불러오는 중...</p>;
  }

  // score가 60 이상이면 수료, 미만이면 미수료
  const passed = result.examSubmission.score >= 60;

  return (
    <div className="exam-container">
      <h2 className="exam-title">{result.exam.title} (시험 결과)</h2>
      <div className="exam-info-field">
        <span>담당 교수 : {result.exam.profName}</span>
        <span>시험 시작 시간 : {result.exam.startTime.replace('T', ' ')}</span>
        <span>시험 종료 시간 : {result.exam.endTime.replace('T', ' ')}</span>
      </div>
      {/* ✅ 점수 및 수료 여부 UI 추가 */}
      <div className="result-summary">
        <div>
          <span>점수</span>
          <strong>{result.examSubmission.score}</strong>
        </div>
        <div>
          <span>수료여부</span>
          <strong className={passed ? 'pass' : 'fail'}>
            {passed ? '수료' : '미수료'}
          </strong>
        </div>
      </div>
      <br></br>
      <h3>시험 문제 ({result.exam.questionCount}문항)</h3>
      <div className="question-results">
        {result.exam.questions.map((question, index) => {
          //학생 답 찾기
          const studentAnswer = result.answers.find(
            (answer) => answer.questionId === question.questionId
          );

          // 정답인지 여부에 따라 점수 표시 (5점 만점)
          const isCorrect =
            studentAnswer && studentAnswer.answer === question.correctAnswer;
          const score = isCorrect ? '5/5' : '0/5';

          return (
            <div key={index}>
              <div className="question-header">
                <h2>Q{index + 1}.</h2>
                {isCorrect ? (
                  <div
                    style={{
                      position: 'absolute',
                      left: '0px',
                      top: '50%',
                      transform: 'translateY(-50%)',
                      width: '60px', // 원 크기
                      height: '60px',
                      border: '3px solid red', // 얇은 선으로 원 만들기
                      borderRadius: '50%', // 원형 모양
                    }}
                  ></div>
                ) : (
                  <div
                    style={{
                      position: 'absolute',
                      left: '30px',
                      top: '50%',
                      transform: 'translateY(-50%) rotate(40deg)', // 대각선 회전
                      width: '3px', // 선 두께 (얇게 조정 가능)
                      height: '80px', // 선 길이
                      backgroundColor: 'red',
                    }}
                  ></div>
                )}
                <div className="question-title">{question.questionTitle}</div>
                <span
                  className={`score ${score === '0/5' ? 'incorrect' : ''}`}
                  style={{ fontSize: '20px', marginLeft: '10px' }}
                >
                  {score}
                </span>
              </div>

              <div className="question-text">{question.questionText}</div>

              {['answer1', 'answer2', 'answer3', 'answer4'].map((key, i) => (
                <div
                  key={i}
                  className={`option ${
                    question.correctAnswer === i + 1 ? 'correct' : ''
                  }`}
                >
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      value={i + 1}
                      checked={studentAnswer && studentAnswer.answer === i + 1}
                      disabled
                    />
                    {i + 1}. {question[key]}
                  </label>
                </div>
              ))}
              <p className="result-text">
                {studentAnswer &&
                studentAnswer.answer === question.correctAnswer
                  ? `✅ 정답 : ${studentAnswer.answer}`
                  : `❌ 오답 / 정답: ${question.correctAnswer}`}
              </p>
            </div>
          );
        })}
      </div>

      <div className="button-container">
        <button
          onClick={() => navigate(`/classroom/${classId}/exam`)}
          className="home-btn"
        >
          시험목록으로
        </button>
      </div>
    </div>
  );
};

export default ExamResult;