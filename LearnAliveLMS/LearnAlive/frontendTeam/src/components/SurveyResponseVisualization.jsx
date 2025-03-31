import { useEffect, useRef, useState } from "react";
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
            new Map(
              data.map((item) => [
                item.questionId,
                {
                  questionId: item.questionId,
                  questionText: item.questionText,
                  questionType: item.questionType,
                },
              ])
            ).values()
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
      .filter((res) => res.questionId === question.questionId && res.name !== null)
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

        values.forEach((value) => {
          acc[value] = (acc[value] || 0) + 1;
        });

        return acc;
      }, {});

    // ✅ 해당 질문에 대한 전체 응답자 수 계산
    const totalResponses = responses.filter(
      (res) => res.questionId === question.questionId && res.name !== null
    ).length;

    // ✅ 가장 높은 값 찾기 (먼저 계산해야 함)
    const maxCount = Math.max(...Object.values(responseCounts), 0);

    // ✅ 랜덤 파스텔톤 색상을 생성하는 함수
    const getRandomPastelColor = () => {
      const hue = Math.floor(Math.random() * 360); // 0 ~ 359 (색상)
      const saturation = 70 + Math.random() * 20; // 70 ~ 90% (채도)
      const lightness = 80 + Math.random() * 10; // 80 ~ 90% (명도)
      return `hsl(${hue}, ${saturation}%, ${lightness}%)`;
    };

    // ✅ 최대값을 위한 파스텔톤 핑크
    const pastelPink = "#FFB6C1"; // 연한 핑크

    // ✅ 데이터 배열 생성 (최대값은 핑크, 나머지는 랜덤 파스텔)
    const chartData = Object.keys(responseCounts)
      .map((key) => ({
        name: key,
        count: responseCounts[key],
        fill: responseCounts[key] === maxCount ? pastelPink : getRandomPastelColor(), // ✅ 최대값은 핑크, 나머지는 랜덤
      }))
      .sort((a, b) => a.name.localeCompare(b.name)); // ✅ 선택지를 오름차순 정렬

    // 컨테이너의 실제 너비 측정을 위한 ref 및 state
    const containerRef = useRef(null);
    const [containerWidth, setContainerWidth] = useState(0);

    useEffect(() => {
      if (containerRef.current) {
        setContainerWidth(containerRef.current.offsetWidth);
      }
    }, [containerRef, chartData]);

    // 커스텀 tick을 inline 함수로 정의 (별도 파일 없이)
    const CustomizedTick = (props) => {
      const { x, y, payload, containerWidth, chartDataLength } = props;
      const text = payload.value;

      // 각 카테고리에 할당되는 대략적인 가용 폭
      const availableWidth = containerWidth / (chartData.length || 1) - 4;

      // Canvas API를 사용하여 실제 텍스트 폭 측정
      const canvas = document.createElement("canvas");
      const ctx = canvas.getContext("2d");
      // 실제 렌더링되는 스타일과 동일하게 설정 (여기서는 bold 23px sans-serif)
      ctx.font = "bold 23px sans-serif";
      const textWidth = ctx.measureText(text).width;

      let displayText = text;
      if (textWidth > availableWidth) {
        // 가용 폭에 맞출 때까지 한 글자씩 줄이고 "..." 붙이기
        while (displayText.length > 0 && ctx.measureText(displayText + "...").width > availableWidth) {
          displayText = displayText.slice(0, -1);
        }
        displayText = displayText + "...";
      }

      return (
        <g transform={`translate(${x},${y})`}>
          <text
            x={0}
            y={0}
            dy={16}
            textAnchor="middle"
            fill="#000"
            fontSize="23"
            fontWeight="bold"
          >
            {displayText}
          </text>
        </g>
      );
    };

    return (
      // 감싸는 div에 ref를 추가하여 너비 측정
      <div ref={containerRef} style={{ width: "100%" }}>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={chartData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis
              dataKey="name"
              tickMargin={10}
              interval={0}
              tick={
                <CustomizedTick
                  containerWidth={containerWidth}
                  chartDataLength={chartData.length}
                />
              }
            />
            <YAxis />
            <Tooltip
              formatter={(value) => {
                const percentage =
                  totalResponses > 0 ? ((value / totalResponses) * 100).toFixed(1) : 0;
                return [`응답: ${value}명 / 총 ${totalResponses}명 中 (${percentage}%)`];
              }}
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
      </div>
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
              <div className="chat-avatar">{res.name.charAt(0)}</div> {/* ✅ 이제 null 걱정 없음 */}
              <div>
                <strong>{res.name}</strong> <span>({res.studentId}) - {res.department}</span>
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
      <button onClick={onBack} className="back-button" style={{ display: "block", marginLeft: "auto" }}>
        ⬅ 돌아가기
      </button>

      <h2 className="left-title" style={{ display: "flex", justifyContent: "center" }}>
        📊 설문 응답 시각화
      </h2>

      <br />
      <br />

      <div className="survey-questions">
        {questions.map((question) => (
          <div key={question.questionId} className="question-container">
            <h3
              className="question-title"
              dangerouslySetInnerHTML={{ __html: question.questionText }}
            ></h3>

            {/* ✅ 객관식 단일 선택 (Radio) → 막대 그래프 */}
            {question.questionType === "radio" && (
              <ResponseBarChart responses={responses} question={question} />
            )}

            {/* ✅ 객관식 다중 선택 (Checkbox) → 막대 그래프 */}
            {question.questionType === "checkbox" && (
              <ResponseBarChart responses={responses} question={question} />
            )}

            {/* ✅ 서술형 (Text) → 채팅 UI */}
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
    </div>
  );
};

export default SurveyResponseVisualization;
