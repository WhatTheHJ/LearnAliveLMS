// CalendarPage.jsx
import { useState, useEffect  } from 'react';
import FullCalendar from '@fullcalendar/react'; // FullCalendar React 컴포넌트
import dayGridPlugin from '@fullcalendar/daygrid'; // 달력의 기본 그리드 플러그인
import interactionPlugin from '@fullcalendar/interaction'; // 이벤트 상호작용 플러그인 (드래그, 클릭 등)
import "../styles/calendar.css"
import ScheduleModal from '../components/ScheduleModal';
import { createSchedule, getAllSchedule } from '../api/scheduleApi';
import { useAuth } from "../context/AuthContext";
import ScheduleDetailModal from '../components/ScheduleDetailModal';

const CalendarPage = () => {
  const [events, setEvents] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedDate, setSelectedDate] = useState("");
  const [formData, setFormData] = useState({ title: "", content: "", mark: 0 });
  const { user } = useAuth(); 
  const [selectedEvent, setSelectedEvent] = useState(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);


// 일정 목록을 가져오는 함수
const fetchSchedules = async () => {
      try {
        const schedules = await getAllSchedule();
        
        const formattedEvents = schedules.map(schedule => ({
          id: schedule.scheduleId,
          title: schedule.title,
          start: schedule.date,
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

   // 페이지 로드 시 일정 가져오기
   useEffect(() => {
    // const fetchSchedules = async () => {
    //   try {
    //     const schedules = await getAllSchedule();
        
    //     const formattedEvents = schedules.map(schedule => ({
    //       id: schedule.scheduleId,
    //       title: schedule.title,
    //       start: schedule.date,
    //       extendedProps: {
    //         content: schedule.content,
    //         mark: schedule.mark,
    //         alarmTime: schedule.alarmTime,  // 🔥 alarmTime 추가!
    //       },
    //       color: schedule.color,
    //       description: schedule.mark ? "🔔" : "",
    //     }));

    //     setEvents(formattedEvents);
    //     console.log("일정 가져오기 완료:", formattedEvents);
    //   } catch (error) {
    //     console.error("일정 가져오기 실패:", error);
    //   }
    // };

    fetchSchedules();
  }, []);


  //--------------------------------
  const getAlarmDates = () => {
    return events
      .filter(event => event.extendedProps?.mark === 1) // mark가 1이면 알람이 설정된 일정
      .map(event => event.date); // 알람이 설정된 일정의 날짜만 추출
  };

  const alarmDates = getAlarmDates(); // 알람이 있는 날짜 목록
//----------------------------------------------------------------------

  const handleDateClick = (event) => {
    setSelectedDate(event.dateStr);
    setIsModalOpen(true);
  };

  
const handleEventClick = (info) => {
  setSelectedEvent(info.event);
  // console.log("이벤트:", info.event);
  setIsDetailModalOpen(true);
};

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    
    console.log(name, value);  // 디버깅용 로그 추가
  
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

      // formData에 selectedDate를 추가하여 서버로 보냄
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
  
      // 성공적으로 등록되면 이벤트에 추가
      setEvents([
        ...events,
        {
          title: formData.title,
          date: selectedDate,
          content: formData.content,
          extendedProps: {
            alarmTime: formData.alarmTime,  // alarmTime도 포함
            mark: formData.mark,
          },
          backgroundColor: formData.color,
          
        },
      ]);
  
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

      <div className='calendar-left'>
        <h3>뭔가 들어갈 자리</h3>
        <ul>
          <li>중요공지사항</li>
          <li>투두리스트</li>
        </ul>
      </div>
        <div className='fullcalendar'>
          <FullCalendar
            plugins={[dayGridPlugin, interactionPlugin]} // 사용할 플러그인 등록
            initialView="dayGridMonth" // 처음에 보여줄 뷰 설정 (일간 그리드)
            events={events} // 표시할 이벤트 목록
            dateClick={handleDateClick} // 날짜 클릭 이벤트 핸들러
            eventClick={handleEventClick} // 이벤트 클릭 이벤트 핸들러
            eventContent={(eventInfo) => (
              <div>
                {eventInfo.event.extendedProps.mark === 1 && "🔔"}
                {eventInfo.event.title}
              </div>
            )}

            dayCellContent={(args) => {
              // 알람이 설정된 날짜에 벨 아이콘 표시
              if (alarmDates.includes(args.dateStr)) {
                return (
                  <>
                    <span>{args.dayNumberText}</span>
                    <span className="bell-icon">🔔</span> {/* 벨 아이콘 추가 */}
                  </>
                );
              }
              return <span>{args.dayNumberText}</span>;
            }}
            

          />
        </div>
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
    </div>
  );
};

export default CalendarPage;
