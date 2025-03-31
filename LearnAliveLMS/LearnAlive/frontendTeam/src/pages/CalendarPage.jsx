import { useState, useEffect  } from 'react';
import FullCalendar from '@fullcalendar/react'; // FullCalendar React 컴포넌트
import dayGridPlugin from '@fullcalendar/daygrid'; // 달력의 기본 그리드 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 이벤트 상호작용 플러그인 (드래그, 클릭 등)
import "../styles/calendar.css"
import ScheduleModal from '../components/ScheduleModal';
import ScheduleReminder from '../components/ScheduleReminder';
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

import { createSchedule, getAllSchedule } from '../api/scheduleApi';
import { useAuth } from "../context/AuthContext";
import ScheduleDetailModal from '../components/ScheduleDetailModal';
import Alams from '../components/Alarms';


const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({ title: "", content: "", mark: 0, alarmTime: "" });
  const { user } = useAuth(); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);


//  //강제새로고침 
//   useEffect(() => {
//     if (performance.navigation.type !== performance.navigation.TYPE_RELOAD) {
//       window.location.reload();
//     }
//   }, []);

//알림 권한 요청
const requestNotificationPermission = () => {
  if (Notification.permission === "default") {
    Notification.requestPermission().then(permission => {
      if (permission === "granted") {
        console.log("알림 권한이 허용되었습니다.");
      } else {
        console.log("알림 권한이 거부되었습니다.");
      }
    });
  }
};

// 일정 목록을 가져오는 함수
const fetchSchedules = async () => {
      try {
        const schedules = await getAllSchedule(user.userId);
        
        const formattedEvents = schedules.map(schedule => ({
          id: schedule.scheduleId,
          title: schedule.title,
          start: schedule.date,
          // start: `${schedule.date}T09:00:00+09:00`, // ⭐️ 핵심
          extendedProps: {
            content: schedule.content,
            mark: schedule.mark,
            alarmTime: schedule.alarmTime,  // 🔥 alarmTime 추가!
          },
          color: schedule.color,
          description: schedule.mark ? "🔔" : "",
        }));

        setEvents(formattedEvents);
        console.log("일정 가져오기 완료:", formattedEvents);
      } catch (error) {
        console.error("일정 가져오기 실패:", error);
      }
    };

   // 페이지 로드 시 일정 가져오기& 알람 권한 받기
   useEffect(() => {
    if (!user || !user.userId) return;
  
    requestNotificationPermission();
    fetchSchedules();
  }, [user]);


  //--------------------------------
  const getAlarmDates = () => {
    const filtered = events.filter(event => {
      const mark = event.extendedProps?.mark;
      return mark === true || mark === 1 || mark === "1";
    });
  
    // console.log("✅ 알람 있는 이벤트들:", filtered);
  
    return filtered.map(event => {
      const utcString = new Date(event.start).toISOString(); // → UTC 기준 ISO 문자열
      const datePart = utcString.split("T")[0]; // → YYYY-MM-DD
      return datePart;
    });
  };
  
  

  const alarmDates = getAlarmDates(); // 알람이 있는 날짜 목록
//----------------------------------------------------------------------

  const handleDateClick = (event) => {
    setSelectedDate(event.dateStr);
    setIsModalOpen(true);
  };

  
const handleEventClick = (info) => {
  setSelectedEvent(info.event);
  setIsDetailModalOpen(true);
};

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    // console.log(name, value);  // 디버깅용 로그 추가
  
    if (name === 'alarmTime') {
      // alarmTime은 datetime-local이므로 값이 제대로 처리되는지 확인
      setFormData({
        ...formData,
        alarmTime: value,  // 값 그대로 저장
      });
    } else {
      setFormData({
        ...formData,
        [name]: type === "checkbox" ? checked : value,
      });
    }
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
  
    try {
        const schedule = {
        userId: user.userId,
        date: selectedDate,
        title: formData.title,
        content: formData.content,
        mark: formData.mark ? 1 : 0,  // mark는 0 또는 1로 처리
        color: formData.color,
        alarmTime: formData.alarmTime
      };
      // 일정 등록 API 호출
      await createSchedule(schedule);
      await fetchSchedules();   
      // 성공적으로 등록되면 이벤트에 추가
      // setEvents([
      //   ...events,
      //   {
      //     title: formData.title,
      //     date: selectedDate,
      //     content: formData.content,
      //     extendedProps: {
      //       alarmTime: formData.alarmTime,  // alarmTime도 포함
      //       mark: formData.mark,
      //     },
      //     backgroundColor: formData.color,
      //   },
        
      // ]);

      // 폼 초기화 및 모달 닫기
      setFormData({ title: "", content: "", mark: 0, color: "#ffcccc"});
      setIsModalOpen(false);
  
      alert("일정이 성공적으로 등록되었습니다!");
    } catch (error) {
      console.error("일정 등록 실패:", error);
      alert("일정 등록에 실패했습니다. 다시 시도해주세요.");
    }
  };
  
  

  return (

    <div className='calendar'>

        <div className='calendar-top'>
        <ScheduleReminder /> {/* 🔼 상단으로 이동 */}
        </div>

  <div className='calendar-body'>
        
        <div className='fullcalendar'>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]} // 사용할 플러그인 등록
            initialView="dayGridMonth" // 처음에 보여줄 뷰 설정 (일간 그리드)
            events={events} // 표시할 이벤트 목록
            dateClick={handleDateClick} // 날짜 클릭 이벤트 핸들러
            eventClick={handleEventClick} // 이벤트 클릭 이벤트 핸들러
            timeZone="Asia/Seoul" 
            eventContent={(eventInfo) => (
              <div>
                {eventInfo.event.extendedProps.mark === 1 && "🔔"}
                {eventInfo.event.title}
              </div>
            )}

            dayCellContent={(args) => {
              const dateStr = args.date.toISOString().split("T")[0];
              // 알람이 설정된 날짜에 벨 아이콘 표시
              if (alarmDates.includes(dateStr)) {
                return (
                  <>
                    <span>{args.dayNumberText}</span>
                    <span className="bell-icon">🔔</span>
                  </>
                );
              }
            
              return <span>{args.dayNumberText}</span>;
            }}
          />
        </div>

        <div className='calendar-right'>
        {isDetailModalOpen && (
          <ScheduleDetailModal 
            isOpen={isDetailModalOpen} 
            event={selectedEvent} 

            
            fetchSchedules={fetchSchedules}  // 부모에서 자식으로 전달
            selectedDate={selectedDate}
            onClose={() => setIsDetailModalOpen(false)} 
          />
        )}
        {isModalOpen && (
          <ScheduleModal
          isModalOpen={isModalOpen}
          selectedDate={selectedDate}
          formData={formData}
          onChange={handleInputChange}
          onSubmit={handleSubmit}
          onClose={() => setIsModalOpen(false)}
          />
           )}
            <Alams events={events} />
    </div>
    </div>
    </div>
  );
};

export default CalendarPage;