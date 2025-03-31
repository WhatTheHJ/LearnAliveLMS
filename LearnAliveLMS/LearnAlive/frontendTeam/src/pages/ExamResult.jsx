import { useEffect, useState } from 'react';
import { fetchExamResult } from '../api/examApi';
import { useAuth } from '../context/AuthContext';
import '../styles/ExamResult.css';

const ExamResult = ({ examId, classId, onBack}) => {
  const { user } = useAuth(); // user 객체에서 studentId를 가져옵니다.
  const [result, setResult] = useState(null);
  const [totalExamTime, setTotalExamTime] = useState(null);

  useEffect(() => {
    if (!user) return; // user가 존재할 때만 실행

    const loadResult = async () => {
      try {
        const data = await fetchExamResult(examId, user.userId);
        if (data) {
          setResult(data);
          console.log('📥 시험 결과 result:', data);
          // ⏳ 시험 시간 계산 로직
          if (data.exam.startTime && data.exam.endTime) {
            const startTime = new Date(data.exam.startTime);
            const endTime = new Date(data.exam.endTime);

            if (!isNaN(startTime) && !isNaN(endTime)) {
              const totalTime = Math.floor((endTime - startTime) / 60000);
              setTotalExamTime(totalTime);
            } else {
              console.error(
                'startTime 또는 endTime이 올바른 날짜 형식이 아닙니다.',
                {
                  startTime: data.exam.startTime,
                  endTime: data.exam.endTime,
                }
              );
            }
          } else {
            console.error('startTime 또는 endTime 값이 없습니다.');
          }
        }
      } catch (error) {
        console.error('시험 결과를 불러오는 데 실패했습니다.', error);
      }
    };
    loadResult();
  }, [examId, user]);

  if (!result) {
    return <p className="loading">시험 결과를 불러오는 중...</p>;
  }

  // 맞은 문제 개수 계산 함수

  const getCorrectAnswerCount = () => {
    if (!result.answers) return 0;

    return result.exam.questions.reduce((correctCount, question) => {
      // result.answers가 객체 배열 형태이므로, 해당 questionId와 일치하는 answerId 값을 찾아 비교
      const answer = result.answers.find(
        (a) => a.questionId === question.questionId
      );

      // answer 값이 정답일 경우 정답 수를 증가
      if (answer && answer.isCorrect) {
        return correctCount + 1;
      }

      return correctCount;
    }, 0);
  };
  // score가 60 이상이면 수료, 미만이면 미수료
  const passed = result.examSubmission.score >= 60;

  return (
    <div className="exam-container">
      <h2 className="exam-title">{result.exam.title} (시험 결과)</h2>
      <div className="exam-info-field">
        <span>
          담당 교수 : {result.exam.profName}
          <br />
          <br />
          수료기준 : 60점
          <br />
          <br />총 시험 시간 : {totalExamTime}분
          <br />
          <br />
          시험 시작 시간 : {result.exam.startTime.replace('T', ' ')}
          <br />
          <br />
          시험 종료 시간 : {result.exam.endTime.replace('T', ' ')}
        </span>

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

        <div className="answer-container">
          <div className="timer-header">
            <div className="timer">⏱️ 00:00</div>{' '}
            {/* 타이머를 00:00으로 고정 */}
            <div className="getAnsweredCount">
              {getCorrectAnswerCount()}/{result.exam.questionCount}
            </div>
          </div>

          <div className="answer-preview">
            {result.exam.questions.map((question, index) => {
              // result.answers에서 해당 questionId와 일치하는 answer 객체 찾기
              const answer = result.answers.find(
                (a) => a.questionId === question.questionId
              );

              return (
                <span key={index} className="answer-item">
                  <span>{index + 1}</span>

                  {answer && answer.isCorrect ? (
                    <span className="correct">⭕</span>
                  ) : (
                    <span className="incorrect">❌</span>
                  )}
                </span>
              );
            })}
          </div>
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
                      left: '6px',
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
                <div className="question-title-2">{question.questionTitle}</div>
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
      <button className="back-btn" onClick={onBack}>
          ⬅ 목록으로
        </button>
      </div>
    </div>
  );
};

export default ExamResult;