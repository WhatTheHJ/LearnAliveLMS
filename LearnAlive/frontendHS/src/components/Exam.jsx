import { useState, useRef } from 'react';
import { createExam } from '../api/examApi';
import '../styles/Exam.css';
import { useParams } from 'react-router-dom';

const Exam = () => {
  const [examTitle, setExamTitle] = useState('');
  const [questions, setQuestions] = useState([]);
  const [startTime, setStartTime] = useState('');
  const [endTime, setEndTime] = useState('');
  const startTimeRef = useRef(null);
  const endTimeRef = useRef(null);

  const { classId } = useParams();

  // 질문 추가
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        text: '',
        type: 'multiple-choice',
        options: [''],
        answer: '',
      },
    ]);
  };

  // 질문 삭제
  const removeQuestion = (index) => {
    const updatedQuestions = questions.filter((_, i) => i !== index);
    setQuestions(updatedQuestions);
  };

  // 질문 변경
  const handleQuestionChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].text = value;
    setQuestions(updatedQuestions);
  };

  // 문제 유형 변경
  const handleTypeChange = (index, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].type = value;

    if (value === 'short-answer') {
      updatedQuestions[index].options = [];
      updatedQuestions[index].answer = '';
    } else {
      updatedQuestions[index].options = [''];
    }

    setQuestions(updatedQuestions);
  };

  // 선택지 추가
  const addOption = (index) => {
    const updatedQuestions = [...questions];
    updatedQuestions[index].options.push('');
    setQuestions(updatedQuestions);
  };

  // 선택지 변경
  const handleOptionChange = (qIndex, oIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].options[oIndex] = value;
    setQuestions(updatedQuestions);
  };

  // 서술형 답안 변경
  const handleAnswerChange = (qIndex, value) => {
    const updatedQuestions = [...questions];
    updatedQuestions[qIndex].answer = value;
    setQuestions(updatedQuestions);
  };

  // 시험 저장
  const handleSave = async () => {
    const examData = {
      examId: 0,
      classId: classId,
      title: examTitle,
      startTime: startTime,
      endTime: endTime,
      createdAt: undefined,
      updatedAt: undefined,
    };

    console.log(examData); // 요청 데이터 확인

    try {
      const response = await createExam(examData);
      alert('시험이 저장되었습니다!');
      console.log('Exam Created:', response);

      // 시험 저장 후, ExamList에서 시험 목록을 갱신하기 위해 호출
      // onExamCreated();
    } catch (error) {
      console.error('시험 저장 실패:', error);
      alert('시험 저장 중 오류 발생!');
    }
  };

  return (
    <div>
      <div>
        <h2>📄 시험 관리 페이지</h2>

        <input
          type="text"
          placeholder="시험 제목"
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

            <input
              type="text"
              placeholder="문제 입력"
              value={question.text}
              onChange={(e) => handleQuestionChange(qIndex, e.target.value)}
              className="question-input"
            />

            <select
              value={question.type}
              onChange={(e) => handleTypeChange(qIndex, e.target.value)}
              className="input-field"
            >
              <option value="single-choice">객관식 (단일 선택)</option>
              <option value="multiple-choice">객관식 (다중 선택)</option>
              <option value="short-answer">서술형</option>
            </select>

            {question.type === 'short-answer' ? (
              <textarea
                className="input-field"
                placeholder="정답을 입력하세요..."
                value={question.answer}
                onChange={(e) => handleAnswerChange(qIndex, e.target.value)}
              />
            ) : (
              question.options.map((option, oIndex) => (
                <div key={oIndex} className="choice-box">
                  <input
                    type={
                      question.type === 'multiple-choice' ? 'checkbox' : 'radio'
                    }
                    name={`question-${qIndex}`}
                  />
                  <input
                    type="text"
                    placeholder={`선택지 ${oIndex + 1}`}
                    value={option}
                    onChange={(e) =>
                      handleOptionChange(qIndex, oIndex, e.target.value)
                    }
                    className="choice-input"
                  />
                </div>
              ))
            )}

            {question.type !== 'short-answer' && (
              <button
                className="add-choice-btn"
                onClick={() => addOption(qIndex)}
              >
                + 선택지 추가
              </button>
            )}
          </div>
        ))}

        <div className="button-container">
          <button className="add-question-btn" onClick={addQuestion}>
            + 문제 추가
          </button>
          <button className="save-btn" onClick={handleSave}>
            시험 저장
          </button>
        </div>
      </div>
    </div>
  );
};

export default Exam;
