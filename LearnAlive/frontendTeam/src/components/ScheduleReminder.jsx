import { useState, useEffect } from 'react';
import { getSurveyTitles } from '../api/scheduleApi'; // API 호출 함수
const ScheduleReminder = () => {
    // 상태 변수 선언
    const [surveyTitles, setSurveyTitles] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
  
    // 데이터 로드 함수
    const fetchSurveyTitles = async () => {
      try {
        const data = await getSurveyTitles();  // API 호출
        setSurveyTitles(data);  // 가져온 데이터를 상태에 저장
        setLoading(false);  // 로딩 상태 false로 설정
        console.log("설문",data )
      } catch (err) {
        setError('설문조사를 가져오는 데 실패했습니다.');  // 에러 처리
        setLoading(false);  // 로딩 상태 false로 설정
      }
    };
  
    // 컴포넌트가 마운트될 때 API 호출
    useEffect(() => {
      fetchSurveyTitles();
    }, []);  // 빈 배열을 넣어 컴포넌트가 처음 렌더링될 때만 실행
  
    // 로딩 중일 때 표시할 내용
    if (loading) {
      return <div>로딩 중...</div>;
    }
  
    // 에러가 발생했을 때 표시할 내용
    if (error) {
      return <div>{error}</div>;
    }
  

  
  // 데이터가 있을 경우, 리스트로 표시
  return (
    <div>
      <h2>설문조사 목록</h2>
      <ul>
        {surveyTitles.map((survey) => (
          <li key={survey.surveyId}>
            <strong>{survey.title}</strong> - 종료일: {new Date(survey.endTime).toLocaleString()}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ScheduleReminder;
