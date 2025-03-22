import { useEffect  } from 'react';

const Alams = ({ events }) => {


//알람 전송
  const sendNotification = (title, content) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: content,
        // icon: "/path/to/icon.png", // 알림에 표시할 아이콘
      });
    }
  };


  const scheduleAlarm = () => {
    events.forEach(event => {
      const alarmTime = new Date(event.extendedProps.alarmTime); // 알람 시간이 있는 경우
      const currentTime = new Date();
      
      if (alarmTime > currentTime) {
        const timeUntilAlarm = alarmTime - currentTime; // 알람까지 남은 시간
  
        // 알람 시간이 되면 알림을 보내는 setTimeout 설정
        setTimeout(() => {
          sendNotification(`일정 알림: ${event.title}`, event.extendedProps.content);
        }, timeUntilAlarm);
      }
    });
  };

  useEffect(() => {
    if (events.length > 0) {
        scheduleAlarm();  // 전달받은 이벤트들을 바탕으로 알람 설정
      }
  }, [events]);  // events가 변경될 때마다 알람 체크

  return (
    <div>
      <h2>알람 설정</h2>
      <p>이곳에서 알람을 설정하고 관리합니다.</p>
    </div>
  );
};
  

  export default Alams;