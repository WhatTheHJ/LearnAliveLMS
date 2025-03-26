import { useState, useEffect } from 'react';
import { getSurveyTitles } from '../api/scheduleApi';
import { useAuth } from "../context/AuthContext";
import Slider from "react-slick";
import "../styles/calendar.css"; // 스타일 분리

const ScheduleReminder = () => {
  const [surveyTitles, setSurveyTitles] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  const fetchSurveyTitles = async (userId) => {
    try {
      const data = await getSurveyTitles(userId);

      const now = new Date();
      const soon = new Date();
      soon.setDate(now.getDate() + 7);

      const upcoming = data.filter((survey) => {
        const end = new Date(survey.endTime);
        return end >= now && end <= soon;
      });

      setSurveyTitles(upcoming);
      setLoading(false);
    } catch (err) {
      setError("설문조사를 가져오는 데 실패했습니다.");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user?.userId) {
      fetchSurveyTitles(user.userId);
    }
  }, [user]);

  const settings = {
    vertical: true,
    verticalSwiping: true,
    infinite: true,
    speed: 2600,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: false,
    autoplaySpeed: 1000,
    arrows: true,
  };

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="survey-reminder-vertical">
      <h3>📋 진행중인 설문</h3>
      <Slider {...settings}>
        {surveyTitles.map((survey) => (
          <div key={survey.surveyId} className="survey-slide">
            <strong>{survey.title}</strong><br />
            <span className="deadline">
              {new Date(survey.endTime).toLocaleDateString("ko-KR")}{" "}
              {new Date(survey.endTime).toLocaleTimeString("ko-KR")}
            </span>
          </div>
        ))}
      </Slider>
    </div>
  );
};

export default ScheduleReminder;
