import { useRef, useState } from "react";
import { createSurveyWithQuestions } from "../api/surveyApi";
import "../styles/SurveyCreate.css"; // ✅ 스타일 추가

  // 📌 KST(한국 시간) 기준으로 날짜와 시간을 변환하는 함수
  const getKSTISOString = (hours, minutes) => {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() + 1); // 🔹 다음날로 설정
    now.setUTCHours(hours - 9, minutes, 0, 0); // 🔹 UTC+9 보정 (KST 기준)
    
    return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16); // 🔹 YYYY-MM-DDTHH:MM 형식
  };

const SurveyCreate = ({ boardId, onSurveyCreated }) => {
  const [title, setTitle] = useState("");
  const [startTime, setStartTime] = useState(getKSTISOString(11, 40)); // 내일 오전 11:40
  const [endTime, setEndTime] = useState(getKSTISOString(12, 0)); // 내일 정오 12:00
  const [questions, setQuestions] = useState([]);
  const titleRef = useRef(null);
  const questionRef = useRef(null);
  const [questionText, setQuestionText] = useState("");


  /** ✅ 질문 추가 */
  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        id: Date.now(),
        questionText: "",
        questionType: "radio", // 기본값: 객관식 (단일 선택)
        options: [""], 
        allowMultiple: false, 
        minSelect: null, 
        maxSelect: null, 
        minValue: null, 
        maxValue: null, 
        isRequired: false,
      },
    ]);
  };

  /** ✅ 질문 삭제 */
  const deleteQuestion = (questionId) => {
    setQuestions(questions.filter(q => q.id !== questionId));
  };

  
  /** ✅ 특정 질문의 내용만 업데이트 */
  const handleQuestionChange = (questionId, value) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, questionText: value } : q
    ));
  };

  /** ✅ 객관식 선택지 추가 */
  const addOption = (questionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId ? { ...q, options: [...q.options, ""] } : q
    ));
  };

  /** ✅ 필수 응답 여부 토글 */
  const toggleRequired = (questionId) => {
    setQuestions(prevQuestions =>
      prevQuestions.map(q =>
        q.id === questionId
          ? { ...q, isRequired: !q.isRequired } // ✅ 값 정확히 변경
          : q
      )
    );
  };

  /** ✅ 다중 선택 토글 */
  const toggleMultipleChoice = (questionId) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { 
            ...q, 
            allowMultiple: !q.allowMultiple,
            questionType: q.allowMultiple ? "radio" : "checkbox", 
            minSelect: q.allowMultiple ? null : 1, 
            maxSelect: q.allowMultiple ? null : q.options.length 
          }
        : q
    ));
  };

  /** ✅ 질문 타입 변경 */
  const changeQuestionType = (questionId, newType) => {
    setQuestions(questions.map(q =>
      q.id === questionId
        ? { 
            ...q, 
            questionType: newType, 
            allowMultiple: newType === "checkbox",
            minSelect: newType === "checkbox" ? 1 : null, 
            maxSelect: newType === "checkbox" ? q.options.length : null,
            options: newType === "text" ? ["서술형 답변"] : q.options.length ? q.options : [""],
            minValue: newType === "linear_scale" ? 1 : null,
            maxValue: newType === "linear_scale" ? 5 : null
          }
        : q
    ));
  };

  /** ✅ 설문 저장 */
  const handleCreateSurvey = async () => {
    if (!title.trim()) return alert("설문조사 제목을 입력하세요.");
    if (questions.length === 0) return alert("최소 하나의 질문을 추가하세요.");
  
    const newSurvey = {
      boardId,
      title,
      startTime,
      endTime,
      questions: questions.map(q => ({
        questionText: q.questionText.trim(),
        questionType: q.questionType,
        options: (q.questionType === "radio" || q.questionType === "checkbox") 
          ? JSON.stringify(q.options.filter(opt => opt.trim() !== ""))  // 🚀 빈 값 제거 후 JSON 변환
          : null,
        minSelect: q.questionType === "checkbox" ? q.minSelect : null,
        maxSelect: q.questionType === "checkbox" ? q.maxSelect : null,
        minValue: q.questionType === "linear_scale" ? q.minValue : null,
        maxValue: q.questionType === "linear_scale" ? q.maxValue : null,
        minLabel: q.questionType === "linear_scale" ? (q.minLabel?.trim() || null) : null,
        maxLabel: q.questionType === "linear_scale" ? (q.maxLabel?.trim() || null) : null,
        isRequired: Boolean(q.isRequired), // ✅ `true` 또는 `false` 값만 저장
      })),
    };
  
    console.log("📌 최종 요청 데이터:", JSON.stringify(newSurvey, null, 2));
  
    const surveyResponse = await createSurveyWithQuestions(newSurvey);
    if (surveyResponse) {
      alert("설문조사가 생성되었습니다.");
      onSurveyCreated();
    } else {
      alert("설문조사 생성에 실패했습니다.");
    }
  };
  
  

  return (
    <div className="survey-create-page">
      <h2>📋 설문조사 만들기</h2>
      <br></br>
      <div
        className="survey-title-box"
        contentEditable="true"
        suppressContentEditableWarning={true}
        ref={titleRef}
        data-placeholder="설문조사 제목을 입력해주세요."
        onFocus={(e) => {
          if (e.target.innerText === "설문조사 제목을 입력해주세요.") e.target.innerText = "";
        }}
        onBlur={() => {
          const text = titleRef.current.innerText.trim();
          setTitle(text || ""); // 빈 값이면 상태 업데이트
          if (!text) titleRef.current.innerText = ""; // 비어있을 때 ::before 활성화
        }}
      >
        {title}
      </div>

      <div className="question-item">
      <label>설문 시작 시간:</label>
      <input type="datetime-local" value={startTime} onChange={(e) => setStartTime(e.target.value)} />
      <label>설문 종료 시간:</label>
      <input type="datetime-local" value={endTime} onChange={(e) => setEndTime(e.target.value)} />
    </div>

      <div className="question-section">
        {questions.map((q, index) => (
          <div key={q.id} className="question-item">
            <div className="question-header">
              <strong>문항 {index + 1}</strong>
              <button className="delete-question" onClick={() => deleteQuestion(q.id)}>×</button>
            </div>
  
            {/* ✅ 질문 입력 (contentEditable 적용) */}
            <div
              className="multi-line-input"
              contentEditable="true"
              suppressContentEditableWarning={true}
              ref={questionRef}
              data-placeholder="질문 내용을 여기에 입력해주세요."
              onFocus={(e) => {
                if (e.target.innerText === "질문 내용을 여기에 입력해주세요.") e.target.innerText = "";
              }}
              onBlur={(e) => {
                const text = questionRef.current.innerText.trim();
                handleQuestionChange(q.id, text); // ✅ 특정 질문만 업데이트
                if (!text) questionRef.current.innerText = ""; // 비어있을 때 ::before 활성화
              }}
            >
              {q.questionText}
            </div>

            {/* ✅ 질문 유형 선택 */}
            <select value={q.questionType} onChange={(e) => changeQuestionType(q.id, e.target.value)}>
              <option value="radio">객관식 (단일 선택)</option>
              <option value="checkbox">객관식 (다중 선택)</option>
              <option value="text">서술형</option>
              <option value="linear_scale">선형 배율</option>
            </select>

              {/* ✅ 필수 응답 여부 토글 */}
            <div className="toggle-container">
              <p>필수</p>
              <label className="toggle-switch">
                <input type="checkbox" checked={q.isRequired} onChange={() => toggleRequired(q.id)} />
                <span className="slider"></span>
              </label>
            </div>

            {/* ✅ 서술형 답변 미리보기 */}
            {q.questionType === "text" && (
              <div className="text-preview">
                <input type="text" placeholder="서술형 답변 (입력 불가)" disabled />
              </div>
            )}

            {/* ✅ 단일 ↔ 다중 선택 토글 */}
            {q.questionType === "radio" || q.questionType === "checkbox" ? (
              <div className="toggle-container">
                <p>다중 선택 허용</p>
                <label className="toggle-switch">
                  <input type="checkbox" checked={q.allowMultiple} onChange={() => toggleMultipleChoice(q.id)} />
                  <span className="slider"></span>
                </label>
              </div>
            ) : null}

            {/* ✅ 객관식 선택지 추가 및 삭제 버튼 */}
            {q.questionType !== "text" && q.questionType !== "linear_scale" && (
              <div className="options">
                {q.options.map((opt, i) => (
                  <div key={i} className="option-item">
                    {q.allowMultiple ? "☑️" : "🔘"}
                    <input
                      type="text"
                      placeholder={`선택지 ${i + 1}`}
                      value={opt}
                      onChange={(e) => {
                        const updatedOptions = [...q.options];
                        updatedOptions[i] = e.target.value;
                        setQuestions(questions.map(q2 =>
                          q2.id === q.id ? { ...q2, options: updatedOptions } : q2
                        ));
                      }}
                    />
                    {/* ✅ 선택지 삭제 버튼 */}
                    <button
                      className="delete-question"
                      onClick={() => {
                        const updatedOptions = q.options.filter((_, index) => index !== i);
                        setQuestions(questions.map(q2 =>
                          q2.id === q.id ? { ...q2, options: updatedOptions } : q2
                        ));
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
                <button onClick={() => addOption(q.id)}>+ 선택지 추가</button>
              </div>
            )}

  
            {/* ✅ 다중 선택 최소/최대 선택 개수 설정 */}
            {q.allowMultiple && (
              <div className="multiple-choice-settings">
                <label>최소 선택:</label>
                <input type="number" min="1" max={q.options.length} value={q.minSelect || 1} onChange={(e) => setQuestions(questions.map(q2 =>
                  q2.id === q.id ? { ...q2, minSelect: parseInt(e.target.value) } : q2
                ))} />
                <label>최대 선택:</label>
                <input type="number" min={q.minSelect || 1} max={q.options.length} value={q.maxSelect || q.options.length} onChange={(e) => setQuestions(questions.map(q2 =>
                  q2.id === q.id ? { ...q2, maxSelect: parseInt(e.target.value) } : q2
                ))} />
              </div>
            )}

            {/* ✅ 선형 배율 미리보기 */}
            {q.questionType === "linear_scale" && (
              <div
                className="linear-scale-preview"
                style={{ "--scale-count": q.maxValue - q.minValue + 1 }}
              >
                <div className="scale-line"></div> {/* ✅ 선을 먼저 렌더링 */}
                {[...Array(q.maxValue - q.minValue + 1)].map((_, i) => (
                  <div key={i} className="scale-point">
                    {/* ✅ 최소/최대 동그라미 위에만 라벨 추가 */}
                    {i === 0 && q.minLabel && <span className="scale-label-top">{q.minLabel}</span>}
                    {i === q.maxValue - q.minValue && q.maxLabel && <span className="scale-label-top">{q.maxLabel}</span>}
                    
                    <span className="circle"></span>
                    
                    {/* ✅ 동그라미 아래 기본 숫자 유지 */}
                    <span className="scale-label">{q.minValue + i}</span>
                  </div>
                ))}
              </div>
            )}


  
            {/* ✅ 선형 배율일 때만 최소값 & 최대값 설명 입력 */}
            {q.questionType === "linear_scale" && (
              <div className="linear-scale-labels">
                <input
                  type="text"
                  placeholder="최소값 설명 (예: 매우 그렇지 않다)"
                  value={q.minLabel || ""}
                  onChange={(e) =>
                    setQuestions(questions.map(q2 =>
                      q2.id === q.id ? { ...q2, minLabel: e.target.value } : q2
                    ))
                  }
                />
                <input
                  type="text"
                  placeholder="최대값 설명 (예: 매우 그렇다)"
                  value={q.maxLabel || ""}
                  onChange={(e) =>
                    setQuestions(questions.map(q2 =>
                      q2.id === q.id ? { ...q2, maxLabel: e.target.value } : q2
                    ))
                  }
                />
              </div>
            )}



            {/* ✅ 선형 배율 설정 */}
            {q.questionType === "linear_scale" && (
              <div className="linear-scale-settings">
                <label>최소값:</label>
                <input type="number" min="1" max="10" value={q.minValue || 1} onChange={(e) => setQuestions(questions.map(q2 =>
                  q2.id === q.id ? { ...q2, minValue: parseInt(e.target.value) } : q2
                ))} />
                <label>최대값:</label>
                <input type="number" min={q.minValue || 1} max="10" value={q.maxValue || 5} onChange={(e) => setQuestions(questions.map(q2 =>
                  q2.id === q.id ? { ...q2, maxValue: parseInt(e.target.value) } : q2
                ))} />
              </div>
            )}
          </div>
        ))}
      </div>
      <button onClick={addQuestion}>+ 질문 추가</button>
      <br></br><br></br><br></br><br></br>
      <button className="submit-survey-btn" onClick={handleCreateSurvey}>
        설문 저장
      </button>
    </div>
  );  
};

export default SurveyCreate;
