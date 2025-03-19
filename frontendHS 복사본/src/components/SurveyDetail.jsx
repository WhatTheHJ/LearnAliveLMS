import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext"; // ✅ AuthContext에서 user 가져오기
import { fetchSurveyDetail, fetchUserResponse, submitOrUpdateResponse, updateSurveyTimes } from "../api/surveyApi";
import "../styles/SurveyDetail.css";

const SurveyDetail = ({ surveyId, onBack, onShowResponseStatus, onShowVisualization }) => {
  const { user } = useAuth(); // ✅ 로그인된 사용자 정보 가져오기
  const userId = user?.userId; // ✅ userId 추출
  const [survey, setSurvey] = useState(null);
  const [responses, setResponses] = useState({}); // 응답 저장
  const [errors, setErrors] = useState({}); // 에러 메시지 저장
  const [userHasResponded, setUserHasResponded] = useState(false);
  const [isWithinTime, setIsWithinTime] = useState(false);

  useEffect(() => {
    if (!surveyId || !userId) {
      console.error("❌ surveyId 또는 userId 유효하지 않음:", { surveyId, userId });
      return;
    }

    fetchSurveyDetail(surveyId)
      .then((data) => {
        console.log("📌 불러온 설문조사 상세:", data);
        setSurvey(data);

        // ✅ 설문 응답 가능 시간 체크
        const now = new Date();
        const start = new Date(data.startTime);
        const end = new Date(data.endTime);
        setIsWithinTime(now >= start && now <= end);

         // ✅ 기존 응답 조회
         fetchUserResponse(surveyId, userId)
         .then((existingResponse) => {
           console.log("📌 기존 응답 데이터:", existingResponse);

           if (existingResponse && Object.keys(existingResponse).length > 0) {
             // JSON 파싱
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
             // ✅ 기존 응답이 없으면 기본값으로 초기화
             console.log("📌 기존 응답 없음. 기본값 설정");
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


  /** ✅ 응답 가능 시간 업데이트 */
  const [editingTime, setEditingTime] = useState(false); // 수정 모드 상태
  const [newStartTime, setNewStartTime] = useState(survey?.startTime || ""); // 새로운 시작 시간
  const [newEndTime, setNewEndTime] = useState(survey?.endTime || ""); // 새로운 종료 시간
  
  /** ✅ 응답 가능 시간 업데이트 */
  const handleUpdateTime = async () => {
    if (!isProfessor) return; // ✅ 교수만 변경 가능하도록 제한
  
    try {
      await updateSurveyTimes(surveyId, newStartTime, newEndTime);
      alert("✅ 설문 시간이 업데이트되었습니다!");
      setSurvey((prev) => ({ ...prev, startTime: newStartTime, endTime: newEndTime })); // 화면 즉시 반영
      setEditingTime(false); // 수정 모드 종료
    } catch (error) {
      alert("❌ 설문 시간 업데이트에 실패했습니다.");
    }
  };

  /** ✅ options를 배열로 변환하는 함수 */
  const parseOptions = (options) => {
    if (!options) return [];
    try {
      let parsed = typeof options === "string" ? JSON.parse(options) : options;
      if (typeof parsed === "string") {
        parsed = JSON.parse(parsed);
      }
      return Array.isArray(parsed) ? parsed : [];
    } catch (error) {
      console.error("❌ 옵션 파싱 오류:", error, "데이터:", options);
      return [];
    }
  };

  
  /** ✅ 응답 변경 핸들러 */
  const handleResponseChange = (questionId, value) => {
    setResponses((prev) => ({ ...prev, [questionId]: value }));
    setErrors((prev) => ({ ...prev, [questionId]: null })); // 입력 시 오류 해제
  };

  /** ✅ 다중 선택 응답 핸들러 */
  const handleCheckboxChange = (question, value) => {
    const selectedOptions = responses[question.questionId] || [];

    let updatedOptions;
    if (selectedOptions.includes(value)) {
      updatedOptions = selectedOptions.filter((o) => o !== value);
    } else {
      updatedOptions = [...selectedOptions, value];
    }

    setResponses((prev) => ({ ...prev, [question.questionId]: updatedOptions }));
    setErrors((prev) => ({ ...prev, [question.questionId]: null })); // 입력 시 오류 해제
  };

  /** ✅ 입력값 검증 */
  const validateResponses = () => {
    let newErrors = {};
    let firstErrorMessage = ""; // 첫 번째 오류 메시지를 저장할 변수

    survey.questions.forEach((q, index) => {
      const response = responses[q.questionId];
      const questionNumber = `문항 ${index + 1}`; // ✅ 1부터 시작하는 문항 번호

      // ✅ 0 또는 1로 저장된 isRequired 값을 Boolean으로 변환
      const isRequired = q.isRequired === 1;

      // ✅ 필수 문항이 응답되지 않은 경우 오류 메시지 추가
      if (isRequired && (!response || (Array.isArray(response) && response.length === 0))) {
        newErrors[q.questionId] = "이 문항은 필수 입력 항목입니다.";
        if (!firstErrorMessage) firstErrorMessage = `⚠️ ${questionNumber}: 필수 입력 항목입니다.`;
      }

      // ✅ 다중 선택 문항의 최소/최대 개수 검증
      if (q.questionType === "checkbox") {
        if (q.minSelect && response.length < q.minSelect) {
          newErrors[q.questionId] = `최소 ${q.minSelect}개 이상 선택해야 합니다.`;
          if (!firstErrorMessage) firstErrorMessage = `⚠️ ${questionNumber}: 최소 ${q.minSelect}개 이상 선택해야 합니다.`;
        }
        if (q.maxSelect && response.length > q.maxSelect) {
          newErrors[q.questionId] = `최대 ${q.maxSelect}개까지만 선택 가능합니다.`;
          if (!firstErrorMessage) firstErrorMessage = `⚠️ ${questionNumber}: 최대 ${q.maxSelect}개까지만 선택 가능합니다.`;
        }
      }
    });

  setErrors(newErrors);

  if (Object.keys(newErrors).length > 0) {
    alert(firstErrorMessage); // ✅ 첫 번째 오류 문항을 alert으로 띄움
    return false;
  }

  return true;
};


/** ✅ 응답 제출 또는 수정 */
const handleSubmit = async () => {
  if (!isWithinTime) {
    alert("❌ 설문 응답 가능 시간이 아닙니다.");
    return;
  }

  if (validateResponses()) {
    try {
      const result = await submitOrUpdateResponse(surveyId, userId, responses);
      if (result) {
        alert(userHasResponded ? "✅ 응답이 수정되었습니다!" : "✅ 설문이 제출되었습니다!");
        setUserHasResponded(true);
      }
    } catch (error) {
      console.error("❌ 응답 제출/수정 오류:", error);
    }
  }
};

  if (!survey) {
    return <p>📌 설문조사 데이터를 불러오는 중...</p>;
  }

  /** ✅ textarea 높이 자동 조절 */
const handleTextAreaResize = (event) => {
  const textarea = event.target;
  textarea.style.height = "auto"; // 기존 높이를 초기화
  textarea.style.height = textarea.scrollHeight + "px"; // 실제 높이로 조정
};

  const isProfessor = user?.role === "professor"; // ✅ 교수 계정 여부 확인

  return (
    <div className="survey-questions">
    <div className="survey-detail-container">
      
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h2>📋 {survey.title}</h2>
        <button onClick={onBack} className="delete-question">x</button>
      </div>

      {/* ✅ 교수자만 "응답 여부 보기" 버튼 표시 */}
      {isProfessor && (
        <div>
        <button onClick={() => onShowResponseStatus(surveyId)} className="response-status-button">
          📊 응답 여부 보기
        </button>
        <button onClick={() => onShowVisualization(surveyId)} className="response-status-button">
      📈 응답 시각화 보기
        </button>
      </div>
      )}

      {!isWithinTime && <p className="error-text">⚠️ 현재는 설문 응답 가능 시간이 아닙니다.</p>}

      <div className="question-item">
      <p>
      ⏳ 시작 시간: {survey.startTime} <br></br><br></br> 
      ⏳ 종료 시간: {survey.endTime}
      </p>
      <br></br>
      {isProfessor && (
        <div>
          {editingTime ? (
            <div>
              <label>설문 시작 시간:</label>
              <input
                type="datetime-local"
                value={newStartTime}
                onChange={(e) => setNewStartTime(e.target.value)}
              />
              <label>설문 종료 시간:</label>
              <input
                type="datetime-local"
                value={newEndTime}
                onChange={(e) => setNewEndTime(e.target.value)}
              />
              <button onClick={handleUpdateTime} className="save-button">저장</button>
              <button onClick={() => setEditingTime(false)} className="cancel-button">취소</button>
            </div>
          ) : (
            <div>
              <button onClick={() => setEditingTime(true)} className="edit-button">
                설문 시간 수정
              </button>
            </div>
          )}
        </div>
      )}
      </div>

        {survey.questions.map((q, index) => (
          <div key={q.questionId} className="question-item">
            {/* ✅ 필수 입력 안내 박스 추가 */}
            <div>
            {q.isRequired && (
              <p className="info-box required-info">⚠️필수</p>
            )}
            <p><strong>문항 {index + 1}:</strong> {q.questionText} {q.isRequired && " *"}</p>
            </div>

            {/* ✅ 객관식 (단일 선택) */}
            {q.questionType === "radio" && (
              <div className="options">
                {parseOptions(q.options).map((opt, i) => (
                  <label key={i}>
                    <input
                      type="radio"
                      name={`question-${q.questionId}`}
                      value={opt}
                      checked={responses[q.questionId] === opt}
                      onChange={(e) => handleResponseChange(q.questionId, e.target.value)}
                    />
                    {opt}
                  </label>
                ))}
              </div>
            )}

            {/* ✅ 객관식 (다중 선택) */}
            {q.questionType === "checkbox" && (
              <div className="options">
                {/* ✅ 최소/최대 선택 개수 안내 박스 추가 */}
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

            {/* ✅ 서술형 (자유 입력) */}
            {q.questionType === "text" && (
              <textarea
              placeholder="답변을 입력하세요..."
              value={responses[q.questionId]}
              onChange={(e) => handleResponseChange(q.questionId, e.target.value)}
              onInput={handleTextAreaResize} // ✅ 입력 시 자동 크기 조정
              />
            )}

            {/* ✅ 선형 배율 */}
            {q.questionType === "linear_scale" && (
              <div className="linear-scale-preview" style={{ "--scale-count": q.maxValue - q.minValue + 1 }}>
                {/* ✅ 선형 배율 가로선 */}
                <div className="scale-line"></div>

                {/* ✅ 동그라미와 라벨 */}
                {[...Array(q.maxValue - q.minValue + 1)].map((_, i) => (
                  <label key={i} className="scale-point">
                    {/* ✅ 최소/최대 라벨 */}
                    {i === 0 && <span className="scale-label-top">{q.minLabel}</span>}
                    {i === q.maxValue - q.minValue && <span className="scale-label-top">{q.maxLabel}</span>}

                    {/* ✅ 동그라미 */}
                    <span className={`circle ${responses[q.questionId] == q.minValue + i ? "selected" : ""}`}></span>
                    <input
                      type="radio"
                      name={`question-${q.questionId}`}
                      value={q.minValue + i}
                      checked={responses[q.questionId] == q.minValue + i}
                      onChange={(e) => handleResponseChange(q.questionId, e.target.value)}
                      style={{ display: "none" }} // ✅ 기본 라디오 버튼 숨김
                    />
                    {/* ✅ 숫자 라벨 */}
                    <span className="scale-label">{q.minValue + i}</span>
                  </label>
                ))}
              </div>
            )}



            {/* ✅ 에러 메시지 출력 */}
            {errors[q.questionId] && (
              <p className="error-message" style={{ color: "red" }}>{errors[q.questionId]}</p>
            )}
          </div>
        ))}
      </div>

      {/* ✅ 버튼 */}
      <div className="survey-buttons">
        <button onClick={handleSubmit}>
          {userHasResponded ? "응답 수정" : "응답 제출"}
        </button>
      </div>
    </div>
  );
};

export default SurveyDetail;
