import { useState, useRef } from 'react';
import { createExam } from '../api/examApi';
import { useNavigate, useParams } from 'react-router-dom';
import '../styles/ExamCreate.css';

const ExamCreate = () => {
  const [examTitle, setExamTitle] = useState('');
  const [profId] = useState('');
  const [profName, setProfName] = useState('');
  const [questions, setQuestions] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const [questionCount] = useState('');
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);
  const { classId } = useParams();
  const navigate = useNavigate();

  // 정답을 선택할 때 숫자(1, 2, 3, 4)만 전달되도록 해야 합니다.
  const handleCorrectAnswerChange = (qIndex, oIndex) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].correctAnswer = oIndex + 1;
    setQuestions(updatedQuestions);
  };

  // 질문 추가
  const addQuestion = () => {
    if (questions.length >= 20) {
      alert('최대 20문항까지 추가할 수 있습니다.');
      return;
    }
    setQuestions([
      ...questions,
      {
        title: '',
        text: '',
        options: ['', '', '', ''], // 선택지 초기화
        correctAnswer: 0, // 올바른 답안을 저장하는 필드 추가
      },
    ]);
  };

  // 질문 삭제
  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  const handleQuestionTitleChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].title = value; // 문제 제목을 별도로 업데이트
    console.log(`문제 제목 업데이트됨: ${value}`);
    setQuestions(updatedQuestions);
  };

  const handleQuestionTextChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].text = value; // 문제 내용을 별도로 업데이트
    setQuestions(updatedQuestions);
  };

  // 선택지 변경
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  // 시험 저장
  const handleSave = async () => {
    if (!profName.trim()) {
      alert('담당 교수를 입력해주세요.');
      return;
    }
    if (!examTitle.trim()) {
      alert('시험 제목을 입력해주세요.');
      return;
    }
    if (!startTime) {
      alert('시작 시간을 설정해주세요.');
      return;
    }
    if (!endTime) {
      alert('종료 시간을 설정해주세요.');
      return;
    }
    if (new Date(startTime) > new Date(endTime)) {
      alert('종료 시간은 시작 시간보다 늦어야 합니다.');
      return;
    }
    if (questions.length !== 20) {
      alert('시험은 20문항을 입력해야 합니다.');
      return;
    }

    for (let i = 0; i < questions.length; i++) {
      const q = questions[i];
      if (!q.title.trim()) {
        alert(`문제 ${i + 1}의 제목을 입력해주세요.`);
        return;
      }
      if (!q.text.trim()) {
        alert(`문제 ${i + 1}의 내용을 입력해주세요.`);
        return;
      }
      if (q.options.some((option) => !option.trim())) {
        alert(`문제 ${i + 1}의 모든 선택지를 입력해주세요.`);
        return;
      }
      if (q.correctAnswer === 0) {
        alert(`문제 ${i + 1}의 정답을 선택해주세요.`);
        return;
      }
    }

    const examData = {
      classId,
      profId, // 여기에 교수 ID 추가
      profName,
      title: examTitle,
      startTime,
      endTime,
      questionCount, // 문항 수 추가
      questions: questions.map((q) => {
        // 선택지 4개 고정
        const [answer1, answer2, answer3, answer4] = q.options
          .concat(['', '', '', ''])
          .slice(0, 4);

        return {
          questionTitle: q.title,
          questionText: q.text,
          correctAnswer: q.correctAnswer,
          answer1, // 없는 값은 빈 문자열로 채움
          answer2,
          answer3,
          answer4,
        };
      }),
    };
    console.log('보낼 데이터:', examData);
    try {
      await createExam(examData);
      alert('시험이 저장되었습니다!');
      navigate(-1);
    } catch (error) {
      console.error('시험 저장 실패:', error);
      alert('시험 저장에 실패했습니다.');
    }
  };

  return (
    <div>
      <div className="exam-container">
        <h2>📝 시험 만들기</h2>
        <input
          type="text"
          placeholder="담당교수 입력"
          value={profName}
          onChange={(e) => setProfName(e.target.value)}
          className="input-field"
        />
        <input
          type="text"
          placeholder="시험 제목 입력"
          value={examTitle}
          onChange={(e) => setExamTitle(e.target.value)}
          className="input-field"
        />
        <div className="date-picker-container">
          <label>시작 시간:</label>
          <input
            type="datetime-local"
            ref={startTimeRef}
            value={startTime}
            onChange={(e) => setStartTime(e.target.value)}
            className="input-field"
          />
        </div>
        <div className="date-picker-container">
          <label>종료 시간:</label>
          <input
            type="datetime-local"
            ref={endTimeRef}
            value={endTime}
            onChange={(e) => setEndTime(e.target.value)}
            className="input-field"
          />
        </div>
        🔔 알림: 20문항을 생성하세요.
        {questions.map((question, qIndex) => (
          <div key={qIndex} className="question-box">
            <div className="question-header">
              <strong>문제 {qIndex + 1}</strong>
              <button
                className="delete-btn"
                onClick={() => removeQuestion(qIndex)}
              >
                ✖
              </button>
            </div>
            <br></br>
            <div> ✅ 정답 : {question.correctAnswer}</div>
            <br></br>
            <textarea
              placeholder="문제 제목 입력"
              value={question.title}
              onChange={(e) =>
                handleQuestionTitleChange(qIndex, e.target.value)
              }
              className="question-input"
            />

            <textarea
              placeholder="문제 입력"
              value={question.text}
              onChange={(e) => handleQuestionTextChange(qIndex, e.target.value)}
              className="question-input"
            />

            {question.options.map((option, oIndex) => (
              <div key={oIndex} className="choice-box">
                <input
                  type="radio"
                  name={`correct-answer-${qIndex}`}
                  checked={question.correctAnswer === oIndex + 1}
                  onChange={() => handleCorrectAnswerChange(qIndex, oIndex)}
                />
                <input
                  type="text"
                  placeholder="선택지 입력"
                  value={option}
                  onChange={(e) =>
                    handleOptionChange(qIndex, oIndex, e.target.value)
                  }
                  className="choice-input"
                />
              </div>
            ))}
          </div>
        ))}
        <button className="add-question-btn" onClick={addQuestion}>
          + 문제 추가
        </button>
        <br></br>
        <br></br>
        <br></br>
        <br></br>
        <div>
          <button className="save-btn" onClick={handleSave}>
            시험 저장
          </button>
          <button className="back-btn" onClick={() => navigate(-1)}>
            ⬅ 목록으로
          </button>
        </div>
      </div>
    </div>
  );
};

export default ExamCreate;