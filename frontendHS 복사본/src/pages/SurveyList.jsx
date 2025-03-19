import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { fetchSurveysByBoard } from "../api/surveyApi";
import SurveyDetail from "../components/SurveyDetail"; 
import SurveyCreate from "../components/SurveyCreate";
import SurveyResponseStatusList from "../components/SurveyResponseStatusList";
import SurveyResponseVisualization from "../components/SurveyResponseVisualization";

const SurveyList = ({ boardId }) => {
  const { user } = useAuth();
  const isProfessor = user?.role === "professor";

  const [surveys, setSurveys] = useState([]);
  const [selectedSurveyId, setSelectedSurveyId] = useState(null);
  const [isCreatingSurvey, setIsCreatingSurvey] = useState(false);
  const [showResponseStatus, setShowResponseStatus] = useState(false);
  const [showVisualization, setShowVisualization] = useState(false);

  useEffect(() => {
    if (!boardId) return;
    fetchSurveysByBoard(boardId)
      .then((data) => {
        console.log("📌 불러온 설문조사 목록:", data);
        setSurveys(data);
      })
      .catch((error) => console.error("❌ 설문조사 목록 조회 오류:", error));
  }, [boardId]);

  const handleSelectSurvey = (surveyId) => {
    console.log("✅ 클릭된 설문 ID:", surveyId);
    setSelectedSurveyId(surveyId);
  };

  const handleBackToList = () => {
    console.log("📌 목록으로 돌아가기");
    setSelectedSurveyId(null);
    setIsCreatingSurvey(false);
    setShowResponseStatus(false);
    setShowVisualization(false);
  };

  const handleBackToDetail = () => {
    setShowResponseStatus(false);
    setShowVisualization(false);
  };

  const handleAddSurvey = () => {
    console.log("📌 설문 추가 버튼 클릭됨");
    setIsCreatingSurvey(true);
  };

  const handleShowResponseStatus = (surveyId) => {
    console.log("📊 응답 여부 보기 클릭됨:", surveyId);
    setSelectedSurveyId(surveyId);
    setShowResponseStatus(true);
    setShowVisualization(false); // ✅ 시각화가 켜져있다면 꺼줌
  };

  const handleShowVisualization = (surveyId) => {
    console.log("📈 응답 시각화 보기 클릭됨:", surveyId);
    setSelectedSurveyId(surveyId);
    setShowVisualization(true);
    setShowResponseStatus(false); // ✅ 응답 여부 보기가 켜져있다면 꺼줌
  };

  console.log("🔄 현재 상태 - selectedSurveyId:", selectedSurveyId, "isCreatingSurvey:", isCreatingSurvey, "showVisualization:", showVisualization, "showResponseStatus:", showResponseStatus);

  return (
    <div className="survey-list-container">
      {selectedSurveyId ? (
        showVisualization ? (
          <SurveyResponseVisualization surveyId={selectedSurveyId} onBack={handleBackToDetail} />
        ) : showResponseStatus ? (
          <SurveyResponseStatusList surveyId={selectedSurveyId} onBack={handleBackToDetail} />
        ) : (
          <SurveyDetail
            surveyId={selectedSurveyId}
            onBack={handleBackToList}
            onShowResponseStatus={handleShowResponseStatus}
            onShowVisualization={handleShowVisualization}
          />
        )
      ) : isCreatingSurvey ? (
        <SurveyCreate boardId={boardId} onSurveyCreated={handleBackToList} />
      ) : (
        <>
          <h2>📋 설문조사 목록</h2>
          {isProfessor && (
            <button onClick={handleAddSurvey}>💁‍♀️ 설문조사 추가</button>
          )}

          <ul className="survey-list">
            {surveys.length > 0 ? (
              surveys.map((survey) => (
                <li key={survey.surveyId}>
                  <span 
                    style={{ cursor: "pointer", textDecoration: "underline" }}
                    onClick={() => handleSelectSurvey(survey.surveyId)}
                  >
                    {survey.title}
                  </span>
                </li>
              ))
            ) : (
              <p>📌 아직 설문조사가 없습니다. 새로 추가해 보세요.</p>
            )}
          </ul>
        </>
      )}
    </div>
  );
};

export default SurveyList;
