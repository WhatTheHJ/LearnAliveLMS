// import { useState, useEffect } from 'react';
// import { getSurveyTitles } from '../api/scheduleApi';
// import { useAuth } from "../context/AuthContext";
// import Slider from "react-slick";
// import "../styles/calendar.css"; // 스타일 분리

// const ScheduleReminder = () => {
//   const [surveyTitles, setSurveyTitles] = useState([]);
//   const [loading, setLoading] = useState(true);
//   const [error, setError] = useState(null);
//   const { user } = useAuth();

//   const fetchSurveyTitles = async (userId) => {
//     try {
//       const data = await getSurveyTitles(userId);

//       const now = new Date();
//       const soon = new Date();
//       soon.setDate(now.getDate() + 7);

//       const upcoming = data.filter((survey) => {
//         const end = new Date(survey.endTime);
//         return end >= now && end <= soon;
//       });

//       setSurveyTitles(upcoming);
//       setLoading(false);
//     } catch (err) {
//       setError("설문조사를 가져오는 데 실패했습니다.");
//       setLoading(false);
//     }
//   };

//   useEffect(() => {
//     if (user?.userId) {
//       fetchSurveyTitles(user.userId);
//     }
//   }, [user]);

//   const settings = {
//     vertical: true,
//     verticalSwiping: true,
//     infinite: true,
//     speed: 2600,
//     slidesToShow: 1,
//     slidesToScroll: 1,
//     autoplay: false,
//     autoplaySpeed: 1000,
//     arrows: true,
//   };

//   if (loading) return <div>로딩 중...</div>;
//   if (error) return <div>{error}</div>;

//   return (
//     <div className="survey-reminder-vertical">
//       <h3>📋 진행중인 설문</h3>
//       <Slider {...settings}>
//         {surveyTitles.map((survey) => (
//           <div key={survey.surveyId} className="survey-slide">
//             <strong>{survey.title}</strong><br />
//             <span className="deadline">
//               {new Date(survey.endTime).toLocaleDateString("ko-KR")}{" "}
//               {new Date(survey.endTime).toLocaleTimeString("ko-KR")}
//             </span>
//           </div>
//         ))}
//       </Slider>
//     </div>
//   );
// };

// export default ScheduleReminder;
import { useState, useEffect,useRef  } from 'react';
// import { getSurveyTitles } from '../api/scheduleApi';
// import { useAuth } from "../context/AuthContext";
import Slider from "react-slick";
import "../styles/calendar.css"; // 스타일 분리

const ScheduleReminder = () => {
  // const [surveyTitles, setSurveyTitles] = useState([]);
  // const [loading, setLoading] = useState(true);
  // const [error, setError] = useState(null);
  // const { user } = useAuth();

  // const fetchSurveyTitles = async (userId) => {  <설문조사 제목 가져오던것>
  //   try {
  //     const data = await getSurveyTitles(userId);

  //     const now = new Date();
  //     const soon = new Date();
  //     soon.setDate(now.getDate() + 7);

  //     const upcoming = data.filter((survey) => {
  //       const end = new Date(survey.endTime);
  //       return end >= now && end <= soon;
  //     });

  //     setSurveyTitles(upcoming);
  //     setLoading(false);
  //   } catch (err) {
  //     setError("설문조사를 가져오는 데 실패했습니다.");
  //     setLoading(false);
  //   }
  // };
  // useEffect(() => {
  //   if (user?.userId) {
  //     fetchSurveyTitles(user.userId);
  //   }
  // }, [user]);

    const [diet, setDiet] = useState([]); //초기값 null넣으면 map에서오류
    // const [today, setToday] = useState('');
    const sliderRef = useRef();
    const [dateLabels, setDateLabels] = useState([]);
  
    useEffect(() => {
      // // 1. 오늘 날짜 세팅
      // const date = new Date();
      // const formatted = date.toLocaleDateString('ko-KR', {
      //   year: 'numeric',
      //   month: '2-digit',
      //   day: '2-digit'
      // });
      // setToday(formatted);

       // 날짜 라벨 설정
       const now = new Date();
       const labels = [-1, 0, 1].map(offset => {
         const d = new Date(now);
         d.setDate(d.getDate() + offset);
         return d.toLocaleDateString('ko-KR', {
           year: 'numeric',
           month: '2-digit',
           day: '2-digit'
         });
       });
 
       setDateLabels(labels);
  
      // 2. 식단 API 호출
      fetch(
        'https://api.odcloud.kr/api/15130015/v1/uddi:eff6ee81-0eaa-4de0-87dc-b4f00776e567?page=1&perPage=20&serviceKey=tFZF5pw49xpEyedb7ht3PYqJCVjTs9xcbxdq63lJkxZTAE6V7ifvrD%2F6idPIxLuQwiuR16EkKluxkGhhaE%2BbjA%3D%3D'
      )
        .then(res => res.json())
        .then(data => {
          const items= data.data;
          // 랜덤하게 3개 추출
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      const selected = shuffled.slice(0, 3);
          // 예: 아침, 점심, 저녁 중 하나 랜덤 선택
          const meals = ['조식', '중식', '석식'];

           const dietValues = selected.map(item => {
        const type = meals[Math.floor(Math.random() * meals.length)];
        return item[type];
      });
          // setDiet(`${today} 🍽️\n${dietValues}`);
          setDiet(dietValues);

        })
        .catch(error => {
          console.error('식단 데이터 오류:', error);
        });
    }, []);

          const settings = {  //캐러셀설정
            vertical: true,
            verticalSwiping: true,
            infinite: false,
            speed: 2600,
            slidesToShow: 1,
            slidesToScroll: 1,
            autoplay: false,
            autoplaySpeed: 1200,
            arrows: true,
            beforeChange: () => {
              // 슬라이드 변경 직전에 포커스 제거
              if (document.activeElement) {
                document.activeElement.blur();
              }
            },
          };

  return (
    <div className="survey-reminder-vertical">
      <div><h3 className="text-xl font-bold mb-2">🍱 오늘의 식단</h3></div>
      <div className="survey-slide">
      <Slider ref={sliderRef} {...settings}>

      {diet.map((diet, idx) => (
    <div key={idx} className="survey-slide2">
      <p className="text-sm text-gray-600 mb-">{dateLabels[idx]}</p>
      <p className="text-md whitespace-pre-line">{diet}</p>
    </div>
  ))}
      </Slider>
      </div>
    </div>
  );
};

export default ScheduleReminder;