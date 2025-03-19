import { useEffect, useState } from "react";
import { fetchSurveyResponsesForVisualization } from "../api/surveyApi"; // ✅ 응답 데이터 불러오기 API
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts"; // ✅ 그래프용 라이브러리
import "../styles/SurveyResponseVisualization.css"; // ✅ 스타일

const SurveyResponseVisualization = ({ surveyId, onBack }) => {
  const [questions, setQuestions] = useState([]);
  const [responses, setResponses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!surveyId) return;

    const fetchResponses = async () => {
      setLoading(true);
      console.log(`📡 [API 요청] fetchSurveyResponsesForVisualization(${surveyId})`);
      try {
        const data = await fetchSurveyResponsesForVisualization(surveyId);
        console.log("📊 [API 응답 데이터]", data);

        if (Array.isArray(data)) {
          // ✅ 중복 없이 고유한 질문 목록을 추출
          const uniqueQuestions = Array.from(
            new Map(data.map(item => [item.questionId, {
              questionId: item.questionId,
              questionText: item.questionText,
              questionType: item.questionType
            }])).values()
          );

          setQuestions(uniqueQuestions); // ✅ 질문 목록 설정
          setResponses(data); // ✅ 응답 목록 설정
        } else {
          console.error("❌ [데이터 오류] 예상된 배열 형태가 아님", data);
        }
      } catch (err) {
        console.error("❌ [API 오류]", err);
        setError("❌ 데이터를 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };

    fetchResponses();
  }, [surveyId]);

  if (loading) return <p>📌 데이터를 불러오는 중...</p>;
  if (error) return <p className="error">{error}</p>;

  /** ✅ 막대 그래프 컴포넌트 */
  const ResponseBarChart = ({ responses, question }) => {
    // ✅ 응답 데이터 가공
    const responseCounts = responses
      .filter((res) => res.questionId === question.questionId)
      .reduce((acc, res) => {
        let values = res.response;

        if (question.questionType === "checkbox") {
          try {
            values = JSON.parse(res.response);
          } catch (e) {
            values = [res.response];
          }
        } else {
          values = [res.response]; // ✅ 단일 응답은 배열로 변환
        }

        values.forEach(value => {
          acc[value] = (acc[value] || 0) + 1;
        });

        return acc;
      }, {});

    // ✅ 가장 높은 값 찾기 (먼저 계산해야 함)
    const maxCount = Math.max(...Object.values(responseCounts), 0);

    // ✅ 데이터 배열 생성 (이제 maxCount 사용 가능)
    const chartData = Object.keys(responseCounts).map((key) => ({
      name: key,
      count: responseCounts[key],
      fill: responseCounts[key] === maxCount ? "#FF5733" : "#8884d8" // ✅ 최대값 강조
    }));

    return (
      <ResponsiveContainer width="100%" height={300}>
        <BarChart data={chartData}>
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="name" />
          <YAxis />
          <Tooltip 
            formatter={(value) => [`${value} 명`, "응답"]} 
            />
          <Bar
            dataKey="count"
            radius={[5, 5, 0, 0]}
            barSize={50}
            fill={({ payload }) => payload.fill} // ✅ 색상 적용
            stroke="#333" // ✅ 막대 테두리 추가
            strokeWidth={2} // ✅ 테두리 두께 설정
            opacity={0.9} // ✅ 불투명도 조정
          />
        </BarChart>
      </ResponsiveContainer>
    );
  };

  /** ✅ 서술형 응답을 표시하는 채팅 UI */
  const ResponseChat = ({ responses, question }) => {
    const filteredResponses = responses
      .filter((res) => res.questionId === question.questionId) // ✅ 해당 질문에 대한 응답만 필터링
      .filter((res) => res.name !== null); // ✅ 교수 응답 제거 (name이 null인 경우)

    return (
      <div className="chat-container">
        {filteredResponses.map((res, index) => (
          <div key={index} className="chat-bubble">
            <div className="chat-user">
              <div className="chat-avatar">{res.name.charAt(0)}</div>  {/* ✅ 이제 null 걱정 없음 */}
              <div>
                <strong>{res.name}</strong> <span>({res.studentId})</span>
              </div>
            </div>

            {/* ✅ 회색 구분선 추가 */}
          <hr className="chat-divider" />

            <div className="chat-message">{res.response}</div>
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className="survey-response-visualization">
      <h2>📊 설문 응답 시각화</h2>

      {/* ✅ "돌아가기" 버튼 추가 */}
      <button onClick={onBack} className="back-button">
        🔙 돌아가기
      </button>

      {questions.map((question) => (
        <div key={question.questionId} className="question-container">
          <h3>{question.questionText}</h3>

          {/* ✅ 객관식 단일 선택 (Radio) → 막대 그래프 */}
          {question.questionType === "radio" && (
            <ResponseBarChart responses={responses} question={question} />
          )}

          {/* ✅ 객관식 다중 선택 (Checkbox) → 막대 그래프 */}
          {question.questionType === "checkbox" && (
            <ResponseBarChart responses={responses} question={question} />
          )}

          {/* ✅ 서술형 (Text) → 카카오톡 채팅 UI */}
          {question.questionType === "text" && (
            <ResponseChat responses={responses} question={question} />
          )}

          {/* ✅ 선형 배율 (Linear Scale) → 막대 그래프 */}
          {question.questionType === "linear_scale" && (
            <ResponseBarChart responses={responses} question={question} />
          )}
        </div>
      ))}
    </div>
  );
};

export default SurveyResponseVisualization;
