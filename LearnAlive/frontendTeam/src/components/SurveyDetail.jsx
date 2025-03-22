import { useEffect, useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import {
  fetchSurveyDetail,
  fetchUserResponse,
  submitOrUpdateResponse,
  updateSurveyTimes,
  updateSurveyWithQuestions,
} from "../api/surveyApi";
import "../styles/SurveyDetail.css";

const SurveyDetail = ({ surveyId, onBack, onShowResponseStatus, onShowVisualization, onShowUpdate }) => {
  const { user } = useAuth();
  const userId = user?.userId;
  const isProfessor = user?.role === "professor";

  // 일반 응답 관련 상태
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({});
  const [errors, setErrors] = useState({});
  const [userHasResponded, setUserHasResponded] = useState(false);
  const [isWithinTime, setIsWithinTime] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // 수정모드 관련 상태 (교수 전용)
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedQuestions, setEditedQuestions] = useState([]);
  const [editingTime, setEditingTime] = useState(false);
  const [newStartTime, setNewStartTime] = useState("");
  const [newEndTime, setNewEndTime] = useState("");

  // API 호출: 설문 상세 및 기존 응답 불러오기
  useEffect(() => {
    if (!surveyId || !userId) return;
    fetchSurveyDetail(surveyId)
      .then((data) => {
        console.log("📌 불러온 설문조사 상세:", data);
        setSurvey(data);
        // 시간 체크
        const now = new Date();
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        setIsWithinTime(now >= start && now <= end);
        // 시간 수정용 상태 초기화
        setNewStartTime(data.startTime);
        setNewEndTime(data.endTime);

        // 기존 응답 불러오기
        fetchUserResponse(surveyId, userId)
          .then((existingResponse) => {
            if (existingResponse && Object.keys(existingResponse).length > 0) {
              const parsedResponses = {};
              Object.keys(existingResponse).forEach((key) => {
                try {
                  parsedResponses[key] = JSON.parse(existingResponse[key]);
                } catch {
                  parsedResponses[key] = existingResponse[key];
                }
              });
              setResponses(parsedResponses);
              setUserHasResponded(true);
            } else {
              const initialResponses = {};
              data.questions.forEach((q) => {
                initialResponses[q.questionId] = q.questionType === "checkbox" ? [] : "";
              });
              setResponses(initialResponses);
            }
          })
          .catch((error) => console.error("❌ 사용자 응답 조회 오류:", error));
      })
      .catch((error) => console.error("❌ 설문조사 상세 조회 오류:", error));
  }, [surveyId, userId]);

  /** 옵션 데이터를 배열로 변환 (이중 인코딩 대응 포함) */
  const parseOptions = (options) => {
    if (!options) return [];
    if (typeof options === "string") {
      const trimmed = options.trim();
      try {
        let parsed = JSON.parse(trimmed);
        if (typeof parsed === "string") {
          parsed = JSON.parse(parsed);
        }
        if (Array.isArray(parsed)) return parsed;
        if (typeof parsed === "object") {
          return Object.keys(parsed).length > 0 ? Object.values(parsed) : [];
        }
        return [];
      } catch (error) {
        console.error("❌ 옵션 파싱 오류:", error, "데이터:", options);
        return [];
      }
    }
    if (Array.isArray(options)) return options;
    if (typeof options === "object") {
      return Object.keys(options).length > 0 ? Object.values(options) : [];
    }
    return [];
  };

  const handleUpdateTime = async () => {
    if (!isProfessor) return;
    try {
      await updateSurveyTimes(surveyId, newStartTime, newEndTime);
      alert("✅ 설문 시간이 업데이트되었습니다!");
  
      // 업데이트 후 최신 설문 데이터를 불러와 상태를 갱신하고, isWithinTime도 다시 계산합니다.
      const updatedSurvey = await fetchSurveyDetail(surveyId);
      setSurvey(updatedSurvey);
  
      const now = new Date();
      const start = new Date(updatedSurvey.startTime);
      const end = new Date(updatedSurvey.endTime);
      setIsWithinTime(now >= start && now <= end);
  
      setEditingTime(false);
    } catch (error) {
      alert("❌ 설문 시간 업데이트에 실패했습니다.");
    }
  };
  
  

  /** 응답 변경 핸들러 (일반 응답 제출용) */
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: null }));
  };

  /** 체크박스 응답 핸들러 */
  const handleCheckboxChange = (question, value) => {
    const selectedOptions = responses[question.questionId] || [];
    let updatedOptions;
    if (selectedOptions.includes(value)) {
      updatedOptions = selectedOptions.filter((o) => o !== value);
    } else {
      updatedOptions = [...selectedOptions, value];
    }
    setResponses((prev) => ({ ...prev, [question.questionId]: updatedOptions }));
    setErrors((prev) => ({ ...prev, [question.questionId]: null }));
  };

  /** 응답 검증 (일반 제출용) - Create와 동일 */
  const validateResponses = () => {
    let newErrors = {};
    let firstErrorMessage = "";
    survey.questions.forEach((q, index) => {
      const response = responses[q.questionId];
      const questionNumber = `문항 ${index + 1}`;
      // isRequired를 boolean으로 바로 사용
      const isRequired = q.isRequired;
      
      // 필수 항목 검증: 응답이 없거나 빈 배열인 경우
      if (isRequired && (!response || (Array.isArray(response) && response.length === 0))) {
        newErrors[q.questionId] = "이 문항은 필수 입력 항목입니다.";
        if (!firstErrorMessage) firstErrorMessage = `⚠️ ${questionNumber}: 필수 입력 항목입니다.`;
      }
      
      // 다중 선택(checkbox) 검증: 사용자가 선택한 응답(response)의 길이 기준
      if (q.questionType === "checkbox") {
        if (q.minSelect && (!response || response.length < q.minSelect)) {
          newErrors[q.questionId] = `최소 ${q.minSelect}개 이상 선택해야 합니다.`;
          if (!firstErrorMessage) firstErrorMessage = `⚠️ ${questionNumber}: 최소 ${q.minSelect}개 이상 선택해야 합니다.`;
        }
        if (q.maxSelect && response && response.length > q.maxSelect) {
          newErrors[q.questionId] = `최대 ${q.maxSelect}개까지만 선택 가능합니다.`;
          if (!firstErrorMessage) firstErrorMessage = `⚠️ ${questionNumber}: 최대 ${q.maxSelect}개까지만 선택 가능합니다.`;
        }
      }
      
      // 객관식 (radio) 검증: 응답이 없으면
      if (q.questionType === "radio") {
        if (isRequired && (!response || response.trim() === "")) {
          newErrors[q.questionId] = "이 문항은 필수 입력 항목입니다.";
          if (!firstErrorMessage) firstErrorMessage = `⚠️ ${questionNumber}: 필수 입력 항목입니다.`;
        }
      }
    });
    setErrors(newErrors);
    if (Object.keys(newErrors).length > 0) {
      alert(firstErrorMessage);
      return false;
    }
    return true;
  };
  
  

  /** 응답 제출 (일반 모드) */
  const handleSubmit = async () => {
    if (!isWithinTime) {
      alert("❌ 설문 응답 가능 시간이 아닙니다.");
      return;
    }
    if (isSubmitting) {
      console.warn("⏳ 이미 제출 중입니다!");
      return;
    }
    // 먼저 입력값 검증 실행
    if (!validateResponses()) {
      // 검증 실패 시 제출 상태를 false로 유지(또는 이미 false임)
      return;
    }
    // 검증 통과 후에 제출 상태를 true로 설정
    setIsSubmitting(true);
    try {
      const result = await submitOrUpdateResponse(surveyId, userId, responses);
      if (result) {
        alert(userHasResponded ? "✅ 응답이 수정되었습니다!" : "✅ 설문이 제출되었습니다!");
        setUserHasResponded(true);
      }
    } catch (error) {
      console.error("❌ 응답 제출/수정 오류:", error);
    } finally {
      setIsSubmitting(false);
    }
  };
  

  /** textarea 자동 높이 조절 */
  const handleTextAreaResize = (event) => {
    const textarea = event.target;
    textarea.style.height = "auto";
    textarea.style.height = textarea.scrollHeight + "px";
  };

  // -------------------- [수정 모드 Update Form] --------------------
  // 수정모드 진입 시, 기존 survey 데이터를 복사 (옵션은 반드시 배열로 변환)
  useEffect(() => {
    if (survey && isEditing) {
      const parsedQuestions = survey.questions.map((q) => ({
        ...q,
        options: parseOptions(q.options),
      }));
      setEditedTitle(survey.title);
      setEditedQuestions(parsedQuestions);
    }
  }, [survey, isEditing]);

  // 수정 모드 함수들 (SurveyCreate와 동일)
  const handleEditedQuestionChange = (questionId, value) => {
    setEditedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, questionText: value } : q
      )
    );
  };

  const handleEditedOptionChange = (questionId, index, value) => {
    setEditedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId
          ? { ...q, options: q.options.map((opt, i) => (i === index ? value : opt)) }
          : q
      )
    );
  };

  const toggleEditedRequired = (questionId) => {
    setEditedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, isRequired: !q.isRequired } : q
      )
    );
  };

  const toggleEditedMultipleChoice = (questionId) => {
    setEditedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId
          ? {
              ...q,
              questionType: q.questionType === "radio" ? "checkbox" : "radio",
              allowMultiple: q.questionType === "radio" ? true : false,
              minSelect: q.questionType === "radio" ? 1 : null,
              maxSelect: q.questionType === "radio" ? q.options.length : null,
            }
          : q
      )
    );
  };

  const addEditedOption = (questionId) => {
    setEditedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, options: [...q.options, ""] } : q
      )
    );
  };

  // 질문 삭제 (수정 모드에서)
  const deleteQuestion = (questionId) => {
    setEditedQuestions((prev) => prev.filter((q) => q.questionId !== questionId));
  };

  // 선택지 삭제 (수정 모드에서)
  const deleteOption = (questionId, index) => {
    setEditedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId
          ? { ...q, options: q.options.filter((_, i) => i !== index) }
          : q
      )
    );
  };

  // 수정 모드 진입 시 사용할 새 질문 객체 생성 함수
const addEditedQuestion = () => {
  setEditedQuestions((prev) => [
    ...prev,
    {
      questionId: Date.now(), // 고유 ID (DB 연동 시 적절한 방식 사용)
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

  const updateEditedMinMaxSelect = (questionId, field, value) => {
    setEditedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, [field]: value } : q
      )
    );
  };

  const updateEditedLinearScale = (questionId, field, value) => {
    setEditedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId ? { ...q, [field]: value } : q
      )
    );
  };

  // 수정 시 입력값 검증 (Create와 동일)
  const validateEditedSurvey = () => {
    if (!editedTitle.trim()) {
      alert("설문조사 제목을 입력하세요.");
      return false;
    }
    if (editedQuestions.length === 0) {
      alert("최소 하나의 질문을 추가하세요.");
      return false;
    }
    for (let q of editedQuestions) {
      if (!q.questionText.trim()) {
        return alert(`문항 ${editedQuestions.indexOf(q) + 1}의 질문을 입력하세요.`);
      }
      if ((q.questionType === "radio" || q.questionType === "checkbox") &&
          parseOptions(q.options).filter(opt => opt.trim() !== "").length === 0) {
        return alert(`문항 ${editedQuestions.indexOf(q) + 1}의 선택지를 최소 하나 이상 입력해주세요.`);
      }
    }
    return true;
  };

  // 수정 완료 시 업데이트 API 호출
    const handleUpdateSurvey = async () => {
      if (!isProfessor) return;
      if (!validateEditedSurvey()) return;
      
      // 제출 상태 활성화
      setIsSubmitting(true);
      
      try {
        await updateSurveyWithQuestions(surveyId, {
          title: editedTitle,
          startTime: survey.startTime,
          endTime: survey.endTime,
          questions: editedQuestions.map((q) => ({
            questionText: q.questionText.trim(),
            questionType: q.questionType,
            options:
              (q.questionType === "radio" || q.questionType === "checkbox")
                ? JSON.stringify(q.options.filter(opt => opt.trim() !== ""))
                : null,
            minSelect: q.questionType === "checkbox" ? q.minSelect : null,
            maxSelect: q.questionType === "checkbox" ? q.maxSelect : null,
            minValue: q.questionType === "linear_scale" ? q.minValue : null,
            maxValue: q.questionType === "linear_scale" ? q.maxValue : null,
            minLabel: q.questionType === "linear_scale" ? (q.minLabel?.trim() || null) : null,
            maxLabel: q.questionType === "linear_scale" ? (q.maxLabel?.trim() || null) : null,
            isRequired: Boolean(q.isRequired),
          })),
        });
        alert("✅ 설문이 수정되었습니다!");
        setIsEditing(false);
    // 최신 데이터 재조회: 수정된 설문 데이터와 새 질문 ID가 포함됨
    const updatedSurvey = await fetchSurveyDetail(surveyId);
    setSurvey(updatedSurvey);
    // 최신 설문에 맞춰 응답 상태 초기화
    const initialResponses = {};
    updatedSurvey.questions.forEach((q) => {
      initialResponses[q.questionId] = q.questionType === "checkbox" ? [] : "";
    });
    setResponses(initialResponses);
  } catch (error) {
    alert("❌ 설문 수정 실패!");
  } finally {
    // 제출 상태 해제
    setIsSubmitting(false);
  }
};

  const moveEditedQuestion = (index, direction) => {
    const newQuestions = [...editedQuestions];
    const targetIndex = direction === "up" ? index - 1 : index + 1;
    if (targetIndex < 0 || targetIndex >= newQuestions.length) return;
    
    // 배열 내 두 항목 교환
    [newQuestions[index], newQuestions[targetIndex]] = [newQuestions[targetIndex], newQuestions[index]];
    setEditedQuestions(newQuestions);
  };
  
  const changeEditedQuestionType = (questionId, newType) => {
    setEditedQuestions((prev) =>
      prev.map((q) =>
        q.questionId === questionId
          ? {
              ...q,
              questionType: newType,
              allowMultiple: newType === "checkbox",
              minSelect: newType === "checkbox" ? 1 : null,
              maxSelect: newType === "checkbox" ? q.options.length : null,
              options: newType === "text" ? ["서술형 답변"] : q.options.length ? q.options : [""],
              minValue: newType === "linear_scale" ? 1 : null,
              maxValue: newType === "linear_scale" ? 5 : null,
            }
          : q
      )
    );
  };
  

  // -------------------- [수정 로직 끝] --------------------

  if (!survey) return <p>📌 설문조사 데이터를 불러오는 중...</p>;

  return (
    <div className="survey-detail-container">
      <button onClick={onBack} className="back-button" style={{ display: "block", marginLeft: "auto" }}>
        ⬅ 돌아가기
      </button>
      {/* 설문 제목 */}
      <h2 className="normal-title">
        {isEditing ? (
          <input
            type="text"
            value={editedTitle}
            onChange={(e) => setEditedTitle(e.target.value)}
            className="survey-title-box"
          />
        ) : (
          <>📋 {survey.title}</>
        )}
      </h2>
      
      {/* 교수자용 버튼: 수정 모드가 아닐 때만 상단에 표시 */}
      {isProfessor && !isEditing && (
        <div style={{ display: "flex", justifyContent: "center", gap: "10px" }}>
          <button onClick={() => onShowResponseStatus(surveyId)} className="normal-button">
            👩‍👧‍👦 응답 여부 보기
          </button>
          <button onClick={() => onShowVisualization(surveyId)} className="normal-button">
            📊 응답 도표 보기
          </button>
          <button
            onClick={() => {
              setIsEditing(true);
              // 수정모드 진입 시 survey 데이터 복사 (options는 parseOptions로 배열 변환)
              setEditedTitle(survey.title);
              setEditedQuestions(
                survey.questions.map((q) => ({
                  ...q,
                  options: parseOptions(q.options),
                }))
              );
            }}
            className="normal-button"
          >
            ✏️ 설문 수정
          </button>
        </div>
      )}


      {/* 응답 제출 시간 및 시간 수정 UI */}
      <br /><br />
      <div className="survey-questions">
        <div className="question-item">
          <p>
            ⏳ 시작 시간: {survey.startTime} <br /><br />
            ⏳ 종료 시간: {survey.endTime}
          </p>
          {!isWithinTime && <p className="time-sign">⚠️ 현재는 설문 응답 가능 시간이 아닙니다.</p>}
          {isProfessor && (
            <div>
              {editingTime ? (
                <div>
                  <label style={{ marginRight: "5px" }}>설문 시작 시간:</label>
                  <input
                    type="datetime-local"
                    value={newStartTime}
                    onChange={(e) => setNewStartTime(e.target.value)}
                    style={{ marginRight: "15px" }}
                  />
                  <label style={{ marginRight: "5px" }}>설문 종료 시간:</label>
                  <input
                    type="datetime-local"
                    value={newEndTime}
                    onChange={(e) => setNewEndTime(e.target.value)}
                    style={{ marginRight: "5px" }}
                  />
                  <button onClick={handleUpdateTime} className="save-button">저장</button>
                  <button onClick={() => setEditingTime(false)} className="cancel-button">취소</button>
                </div>
              ) : (
                <div>
                  <button onClick={() => setEditingTime(true)} className="normal-button">
                    설문 시간 수정
                  </button>
                </div>
              )}
            </div>
          )}
        </div>

        {/* 설문 문항들 */}
        {isEditing ? (
          <>
            {editedQuestions.map((q, index) => (
              <div key={q.questionId} className="question-item">
                <div>
                  {q.isRequired && <p className="info-box required-info">⚠️필수</p>}
                  <br /><br />
                  <div className="question-header">
                  <div className="move-buttons">
                    <button 
                      onClick={() => moveEditedQuestion(index, "up")} 
                      disabled={index === 0} 
                      title="위로 이동"
                    >
                      ▲
                    </button>
                    <button 
                      onClick={() => moveEditedQuestion(index, "down")} 
                      disabled={index === editedQuestions.length - 1} 
                      title="아래로 이동"
                    >
                      ▼
                    </button>
                  </div>
                    <strong>문항 {index + 1}</strong>
                    {/* 삭제 버튼 */}
                    <button className="delete-question" onClick={() => deleteQuestion(q.questionId)}>×</button>
                  </div>
                </div>

                {/* 스타일 툴바 */}
                <div className="style-toolbar">
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

                {/* 질문 텍스트 편집 아래에 문항 타입 선택 드롭다운 추가 */}
                <select
                  value={q.questionType}
                  onChange={(e) => changeEditedQuestionType(q.questionId, e.target.value)}
                >
                  <option value="radio">객관식 (단일 선택)</option>
                  <option value="checkbox">객관식 (다중 선택)</option>
                  <option value="text">서술형</option>
                  <option value="linear_scale">선형 배율</option>
                </select>

                {/* 질문 텍스트 편집 */}
                  <div
                    className="multi-line-input"
                    contentEditable="true"
                    suppressContentEditableWarning={true}
                    data-placeholder="질문 내용을 입력해주세요."
                    onKeyDown={(e) => {
                      if (e.key === "Enter") {
                        e.preventDefault();
                        if (document.queryCommandSupported("insertLineBreak")) {
                          document.execCommand("insertLineBreak");
                        } else {
                          document.execCommand("insertHTML", false, "<br><br>");
                        }
                      }
                    }}
                    onBlur={(e) =>
                      handleEditedQuestionChange(q.questionId, e.target.innerHTML.trim())
                    }
                    onFocus={(e) => {
                      const range = document.createRange();
                      range.selectNodeContents(e.target);
                      range.collapse(false);
                      const sel = window.getSelection();
                      sel.removeAllRanges();
                      sel.addRange(range);
                    }}
                    dangerouslySetInnerHTML={{ __html: q.questionText }}
                  />



                {/* 필수 토글 */}
                <div className="toggle-container">
                  <p>필수</p>
                  <label className="toggle-switch">
                    <input
                      type="checkbox"
                      checked={q.isRequired}
                      onChange={() => toggleEditedRequired(q.questionId)}
                    />
                    <span className="slider"></span>
                  </label>
                </div>

                {/* 단일 ↔ 다중 선택 토글 */}
                {(q.questionType === "radio" || q.questionType === "checkbox") && (
                  <div className="toggle-container">
                    <p>다중 선택 허용</p>
                    <label className="toggle-switch">
                      <input
                        type="checkbox"
                        checked={q.allowMultiple || false}
                        onChange={() => toggleEditedMultipleChoice(q.questionId)}
                      />
                      <span className="slider"></span>
                    </label>
                  </div>
                )}

                {/* 객관식 선택지 편집 */}
                {(q.questionType === "radio" || q.questionType === "checkbox") && (
                  <div className="options">
                    {parseOptions(q.options).map((opt, i) => (
                      <div key={i} className="option-item">
                        <input
                          className="option-input"
                          type="text"
                          placeholder={`선택지 ${i + 1}`}
                          value={opt}
                          onChange={(e) =>
                            handleEditedOptionChange(q.questionId, i, e.target.value)
                          }
                        />
                        {/* 선택지 삭제 버튼 */}
                        <button
                          className="delete-question"
                          onClick={() => deleteOption(q.questionId, i)}
                        >
                          x
                        </button>
                      </div>
                    ))}
                    <button onClick={() => addEditedOption(q.questionId)} className="survey-add-button">
                      + 선택지 추가
                    </button>
                  </div>
                )}

                {/* 서술형 미리보기 */}
                {q.questionType === "text" && (
                  <div className="text-preview">
                    <input type="text" placeholder="서술형 답변 (입력 불가)" disabled />
                  </div>
                )}

                {/* 선형 배율 미리보기 */}
                {q.questionType === "linear_scale" && (
                  <div
                    className="linear-scale-preview"
                    style={{ "--scale-count": q.maxValue - q.minValue + 1 }}
                  >
                    <div className="scale-line"></div>
                    {[...Array(q.maxValue - q.minValue + 1)].map((_, i) => (
                      <div key={i} className="scale-point">
                        {i === 0 && q.minLabel && (
                          <span className="scale-label-top">{q.minLabel}</span>
                        )}
                        {i === q.maxValue - q.minValue && q.maxLabel && (
                          <span className="scale-label-top">{q.maxLabel}</span>
                        )}
                        <span className="circle"></span>
                        <span className="scale-label">{q.minValue + i}</span>
                      </div>
                    ))}
                  </div>
                )}

                {/* 다중 선택 문항: 최소/최대 선택 개수 설정 */}
                {q.questionType === "checkbox" && (
                  <div className="multiple-choice-settings">
                    <label>최소 선택:</label>
                    <input
                      type="number"
                      min="1"
                      max={parseOptions(q.options).length}
                      value={q.minSelect || 1}
                      onChange={(e) =>
                        updateEditedMinMaxSelect(q.questionId, "minSelect", parseInt(e.target.value))
                      }
                    />
                    <label>최대 선택:</label>
                    <input
                      type="number"
                      min={q.minSelect || 1}
                      max={parseOptions(q.options).length}
                      value={q.maxSelect || parseOptions(q.options).length}
                      onChange={(e) =>
                        updateEditedMinMaxSelect(q.questionId, "maxSelect", parseInt(e.target.value))
                      }
                    />
                  </div>
                )}

                {/* 선형 배율 설정 입력 */}
                {q.questionType === "linear_scale" && (
                  <div className="linear-scale-settings">
                  <div className="scale-field">
                    <label>최소값:</label>
                    <input
                      type="number"
                      min="1"
                      max="10"
                      value={q.minValue || 1}
                      onChange={(e) =>
                        updateEditedLinearScale(q.questionId, "minValue", parseInt(e.target.value))
                      }
                    />
                  </div>
                  
                  <div className="scale-field">
                    <label>최대값:</label>
                    <input
                      type="number"
                      min={q.minValue || 1}
                      max="10"
                      value={q.maxValue || 5}
                      onChange={(e) =>
                        updateEditedLinearScale(q.questionId, "maxValue", parseInt(e.target.value))
                      }
                      style={{ marginRight: "47px" }} // 오른쪽에 10px 마진 추가
                    />
                  </div>
                </div>
                )}

                {/* 선형 배율 설명 입력 */}
                {q.questionType === "linear_scale" && (
                  <div className="linear-scale-labels">
                  <div className="scale-field">
                    <label>최소값 설명:</label>
                    <input
                      type="text"
                      placeholder="예: 매우 그렇지 않다"
                      value={q.minLabel || ""}
                      onChange={(e) => updateEditedLinearScale(q.questionId, "minLabel", e.target.value)}
                    />
                  </div>
                
                  <div className="scale-field">
                    <label>최대값 설명:</label>
                    <input
                      type="text"
                      placeholder="예: 매우 그렇다"
                      value={q.maxLabel || ""}
                      onChange={(e) => updateEditedLinearScale(q.questionId, "maxLabel", e.target.value)}
                    />
                  </div>
                </div>
              )}
              </div>
            ))}
            {/* 수정 모드일 때 전체 질문 아래에 문항 추가 버튼 */}
            <button onClick={addEditedQuestion} className="survey-add-button">
              + 질문 추가
            </button>
          </>
        ) : (
          // 일반 응답 제출 UI (수정모드가 아닐 때)
          survey.questions.map((q, index) => (
            <div key={q.questionId} className="question-item">
              <div>
                {q.isRequired && <p className="info-box required-info">⚠️필수</p>}
                <br />
                <p className="question-title">
                  <strong>문항 {index + 1}:</strong>{" "}
                  <span dangerouslySetInnerHTML={{ __html: q.questionText.replace(/\n/g, "<br>") }}></span>
                </p>
              </div>
              {q.questionType === "radio" && (
                <div className="options">
                  {parseOptions(q.options).map((opt, i) => (
                    <label key={i}>
                      <input
                        type="radio"
                        name={`question-${q.questionId}`}
                        value={opt}
                        checked={String(responses[q.questionId]) === String(opt)}
                        onChange={(e) => handleResponseChange(q.questionId, e.target.value)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.questionType === "checkbox" && (
                <div className="options">
                  {(q.minSelect || q.maxSelect) && (
                    <p className="info-box">
                      {q.minSelect && `최소: ${q.minSelect}개`}
                      {q.minSelect && q.maxSelect ? " | " : ""}
                      {q.maxSelect && `최대: ${q.maxSelect}개`}
                    </p>
                  )}
                  {parseOptions(q.options).map((opt, i) => (
                    <label key={i}>
                      <input
                        type="checkbox"
                        value={opt}
                        checked={(responses[q.questionId] || []).includes(opt)}
                        onChange={() => handleCheckboxChange(q, opt)}
                      />
                      {opt}
                    </label>
                  ))}
                </div>
              )}
              {q.questionType === "text" && (
                <textarea
                  placeholder="답변을 입력하세요..."
                  value={responses[q.questionId]}
                  onChange={(e) => handleResponseChange(q.questionId, e.target.value)}
                  onInput={handleTextAreaResize}
                />
              )}
              {q.questionType === "linear_scale" && (
                <div className="linear-scale-preview" style={{ "--scale-count": q.maxValue - q.minValue + 1 }}>
                  <div className="scale-line"></div>
                  {[...Array(q.maxValue - q.minValue + 1)].map((_, i) => (
                    <label key={i} className="scale-point">
                      {i === 0 && <span className="scale-label-top">{q.minLabel}</span>}
                      {i === q.maxValue - q.minValue && <span className="scale-label-top">{q.maxLabel}</span>}
                      <span className={`circle ${responses[q.questionId] == q.minValue + i ? "selected" : ""}`}></span>
                      <input
                        type="radio"
                        name={`question-${q.questionId}`}
                        value={q.minValue + i}
                        checked={responses[q.questionId] == q.minValue + i}
                        onChange={(e) => handleResponseChange(q.questionId, e.target.value)}
                        style={{ display: "none" }}
                      />
                      <span className="scale-label">{q.minValue + i}</span>
                    </label>
                  ))}
                </div>
              )}
              {errors[q.questionId] && (
                <p className="error-message" style={{ color: "red" }}>{errors[q.questionId]}</p>
              )}
            </div>
          ))
        )}
      </div>

        <div className="survey-buttons">
        {isEditing ? (
        <>
          <button 
            onClick={handleUpdateSurvey} 
            className="submit-edit-button" 
            disabled={isSubmitting}
          >
            {isSubmitting ? "제출 중..." : "✅ 수정 완료"}
          </button>
          {!isSubmitting && (
            <button 
              onClick={() => setIsEditing(false)} 
              className="submit-cancel-button"
            >
              ❌ 취소
            </button>
          )}
        </>
        ) : (
          <button 
            onClick={handleSubmit}
            disabled={isSubmitting}
            className="submit-button"
          >
            {isSubmitting ? "제출 중..." : (userHasResponded ? "응답 수정" : "응답 제출")}
          </button>
        )}
      </div>
    </div>
  );
};

export default SurveyDetail;
