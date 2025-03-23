import { useRef, useState, useEffect } from "react";
import { updateSurveyWithQuestions, fetchSurveyQuestions } from "../api/surveyApi";
import "../styles/SurveyCreate.css"; // ✅ 스타일 추가

  // 📌 KST(한국 시간) 기준으로 날짜와 시간을 변환하는 함수
  const getKSTISOString = (hours, minutes) => {
    const now = new Date();
    now.setUTCDate(now.getUTCDate() + 1); // 🔹 다음날로 설정
    now.setUTCHours(hours - 9, minutes, 0, 0); // 🔹 UTC+9 보정 (KST 기준)
    
    return new Date(now.getTime() + 9 * 60 * 60 * 1000).toISOString().slice(0, 16); // 🔹 YYYY-MM-DDTHH:MM 형식
  };

  const SurveyUpdate = ({ surveyId, onSurveyUpdated, onBack }) => {
    const [title, setTitle] = useState("");
    const [startTime, setStartTime] = useState(""); // ✅ 기존 데이터가 없을 경우 빈 값으로 초기화
    const [endTime, setEndTime] = useState("");
    const [questions, setQuestions] = useState([]);
    const titleRef = useRef(null);
    const questionRef = useRef(null);
    const [isBold, setIsBold] = useState(false);
    const [isUnderline, setIsUnderline] = useState(false);


/** ✅ 기존 설문 데이터를 불러오는 useEffect */
useEffect(() => {
  const loadSurveyData = async () => {
    try {
      const surveyQuestions = await fetchSurveyQuestions(surveyId); // 기존 질문 목록 불러오기
      if (surveyQuestions.length > 0) {
        setTitle(surveyQuestions[0].surveyTitle); // 첫 번째 질문의 설문 제목 사용
        setStartTime(surveyQuestions[0].startTime || getKSTISOString(11, 40));
        setEndTime(surveyQuestions[0].endTime || getKSTISOString(12, 0));
      }
      setQuestions(
        surveyQuestions.map(q => ({
          questionId: q.questionId,
          questionText: q.questionText,
          questionType: q.questionType,
          options: q.options ? JSON.parse(q.options) : [],
          isRequired: q.isRequired,
          minSelect: q.minSelect,
          maxSelect: q.maxSelect,
          minValue: q.minValue,
          maxValue: q.maxValue,
          minLabel: q.minLabel,
          maxLabel: q.maxLabel,
        }))
      );
    } catch (error) {
      console.error("❌ 설문 데이터 불러오기 실패:", error);
    }
  };


    if (surveyId) loadSurveyData(); // ✅ surveyId가 있을 때만 실행
  }, [surveyId]); // ✅ surveyId가 변경될 때만 실행

  /** ✅ 스타일 토글 (볼드 & 밑줄) */
  const toggleStyle = (command, setState) => {
    document.execCommand(command, false, null);
    setState(prev => !prev);
  };

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

  /** ✅ 설문 수정 요청 */
  const handleUpdateSurvey = async () => {
    if (!title.trim()) return alert("설문조사 제목을 입력하세요.");
    if (questions.length === 0) return alert("최소 하나의 질문을 추가하세요.");

    const updatedSurvey = {
      surveyId, // ✅ surveyId 직접 사용
      title,
      startTime,
      endTime,
      questions: questions.map(q => ({
        questionId: q.questionId,
        questionText: q.questionText.trim(),
        questionType: q.questionType,
        options: q.options ? JSON.stringify(q.options.filter(opt => opt.trim() !== "")) : null,
        isRequired: Boolean(q.isRequired),
      })),
    };

    console.log("📌 설문 수정 요청 데이터:", JSON.stringify(updatedSurvey, null, 2));

    const response = await updateSurveyWithQuestions(surveyId, updatedSurvey);
    if (response) {
      alert("✅ 설문조사가 수정되었습니다.");
      onSurveyUpdated(); // ✅ 수정 완료 후 콜백 실행
    } else {
      alert("❌ 설문조사 수정에 실패했습니다.");
    }
  };

  
  

  return (
    <div className="survey-create-page">
      <button className="back-button" onClick={onBack} style={{ display: "block", marginLeft: "auto" }}>⬅ 뒤로가기</button>
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
  
            <div className="style-toolbar">
            {/* ✅ 볼드(B) 버튼 */}
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                document.execCommand("bold");
                setIsBold(document.queryCommandState("bold"));
              }}
              className={`style-button ${document.queryCommandState("bold") ? "active" : ""}`}
            >
              <b>B</b>
            </button>

            {/* ✅ 언더라인(U) 버튼 */}
            <button
              onMouseDown={(e) => {
                e.preventDefault();
                document.execCommand("underline");
                setIsUnderline(document.queryCommandState("underline"));
              }}
              className={`style-button ${document.queryCommandState("underline") ? "active" : ""}`}
            >
              <u>U</u>
            </button>
          </div>

          {/* ✅ 질문 입력 (contentEditable 적용) */}
          <div
            className="multi-line-input"
            contentEditable="true"
            suppressContentEditableWarning={true}
            ref={questionRef}
            data-placeholder="질문 내용을 입력해주세요."
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                
                // ✅ 브라우저 호환성을 고려한 줄바꿈 처리
                if (document.queryCommandSupported("insertLineBreak")) {
                  document.execCommand("insertLineBreak"); // ✅ 일부 브라우저에서 지원
                } else {
                  document.execCommand("insertHTML", false, "<br><br>"); // ✅ 기본 방식
                }
              }
            }}
            onBlur={(e) => {
              handleQuestionChange(q.id, e.target.innerHTML.trim()); // ✅ HTML 유지한 채 저장
            }}
            onFocus={(e) => {
              // ✅ 기존 입력 내용을 유지한 채 커서 이동 방지
              const range = document.createRange();
              range.selectNodeContents(e.target);
              range.collapse(false);
              const sel = window.getSelection();
              sel.removeAllRanges();
              sel.addRange(range);
            }}
          >
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
                      className="option-input"
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
      <button className="submit-survey-btn" onClick={handleUpdateSurvey}>
        설문 수정
      </button>
    </div>
  );  
};
export default SurveyUpdate;
