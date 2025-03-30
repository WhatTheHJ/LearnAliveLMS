import { useEffect, useState } from 'react';
import { fetchExamDetail, submitExam } from '../api/examApi';
import { useAuth } from '../context/AuthContext';
import '../styles/ExamTake.css';

const ExamTake = ({ examId, classId, onBack, onResult }) => {
  const { user } = useAuth();
  const [exam, setExam] = useState(null);
  const [answers, setAnswers] = useState([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const loadExam = async () => {
      try {
        const data = await fetchExamDetail(examId);
        console.log('📥 불러온 시험 데이터:', data);
        if (data && Array.isArray(data.questions)) {
          setExam(data);
          setAnswers(new Array(data.questions.length).fill(null)); // 초기값 설정 (null)
        } else {
          console.error('시험 데이터에 문제가 있습니다.', data);
        }
      } catch (error) {
        console.error('시험 정보를 불러오는 데 실패했습니다.', error);
      }
    };
    loadExam();
  }, [examId]);

  const handleAnswerChange = (index, value) => {
    const updatedAnswers = [...answers];
    updatedAnswers[index] = value;
    setAnswers(updatedAnswers);
  };

  const handleSubmit = async () => {
    const unansweredQuestions = [];

    answers.forEach((answer, index) => {
      if (answer === null) {
        unansweredQuestions.push(index + 1); // 문제 번호 저장 (배열은 0부터 시작이므로 +1)
      }
    });

    if (unansweredQuestions.length > 0) {
      alert(`${unansweredQuestions.join(', ')}번 문제의 답을 선택하세요!`);
      return;
    }

    const examData = {
      examId,
      studentId: user.userId,
      answers,
    };

    setIsSubmitting(true);
    try {
      // 시험 제출
      const result = await submitExam(examId, examData);
      console.log('시험 제출 결과:', result);

      alert('시험 제출 완료!');

      // ✅ 부모 컴포넌트로 결과 전환 요청 (navigate 제거)
      if (onResult) onResult(examId);

    } catch (error) {
      console.error('시험 제출 실패:', error);
      alert('시험 제출에 실패했습니다.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // exam 또는 exam.questions이 없을 경우 로딩 메시지를 표시
  if (!exam || !exam.questions || exam.questions.length === 0) {
    return <p className="loading">시험 정보를 불러오는 중...</p>;
  }

  return (
    <div className="exam-container">
      <h2 className="exam-title">{exam.title} (시험 응시)</h2>

      <div className="exam-info">
        <div className="exam-info-field">
          <span>담당 교수 : {exam.profName.replace('T', ' ')}</span>
          <span>시험 시작 시간 : {exam.startTime.replace('T', ' ')}</span>
          <span>시험 종료 시간 : {exam.endTime.replace('T', ' ')}</span>
        </div>
        <br></br>
        <h3>시험 문제 ({exam.questionCount}문항)</h3>
        <div className="question-options">
          {exam.questions.map((question, index) => (
            <div key={index}>
              <br></br>
              <div className="question-header">
                <h3 className="question-number">Q{index + 1}.</h3>
                <div className="question-title">{question.questionTitle}</div>
              </div>
              <div className="question-text">{question.questionText}</div>
              <br />
              {['answer1', 'answer2', 'answer3', 'answer4'].map((key, i) => (
                <div key={i} className="option">
                  <label>
                    <input
                      type="radio"
                      name={`question-${index}`}
                      className="question-option-input"
                      value={i + 1} // 선택된 값 (1~4)
                      checked={answers[index] === i + 1}
                      onChange={() => handleAnswerChange(index, i + 1)}
                    />
                    {i + 1}. {question[key] || '선택지 없음'}
                  </label>
                </div>
              ))}
            </div>
          ))}
        </div>
        <br></br>
        <br></br>
        <div className="submit-container">
          <button
            className="submit-btn"
            onClick={handleSubmit}
            disabled={isSubmitting}
          >
            {isSubmitting ? '제출 중...' : '시험 제출'}
          </button>
        </div>

        <div className="button-container">
          <button
            onClick={onBack}
            className="home-btn"
          >
            시험목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamTake;
