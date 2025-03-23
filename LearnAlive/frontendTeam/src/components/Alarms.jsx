import { useEffect, useState  } from 'react';

const Alams = ({ events }) => {
  const [todoList, setTodoList] = useState([]); // 투두리스트 상태
  const [newTodo, setNewTodo] = useState(""); // 새로운 투두 입력값
  const [upcomingEvents, setUpcomingEvents] = useState([]); // 2주 내 일정 상태


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

 // 2주 내 일정 필터링
      const filterUpcomingEvents = () => {
        const now = new Date();
        const twoWeeksLater = new Date();
        const twoWeeksPrior = new Date();
        twoWeeksPrior.setDate(now.getDate() - 14);
        twoWeeksLater.setDate(now.getDate() + 14);

        const filteredEvents = events.filter((event) => {
          const eventDate = new Date(event.start);
          return eventDate >= twoWeeksPrior && eventDate <= twoWeeksLater;
        });

        setUpcomingEvents(filteredEvents);
      };
  // 투두 추가
  const addTodo = () => {
    if (newTodo.trim()) {
      setTodoList([...todoList, { text: newTodo, completed: false, timestamp: Date.now() }]);
      setNewTodo("");
    }
  };

  // 투두 완료 체크
  const toggleTodo = (index) => {
    const updatedTodos = [...todoList];
    updatedTodos[index].completed = !updatedTodos[index].completed;
    updatedTodos[index].timestamp = Date.now(); // 체크된 시간 업데이트
    setTodoList(updatedTodos);
  };

  // 완료된 투두 자동 삭제 (최대 2개 유지)
  useEffect(() => {
    const completedTodos = todoList.filter(todo => todo.completed);
    if (completedTodos.length > 2) {
      const sortedTodos = [...completedTodos].sort((a, b) => a.timestamp - b.timestamp);
      const updatedTodos = todoList.filter(todo => !todo.completed || todo !== sortedTodos[0]); // 가장 오래된 것 삭제
      setTodoList(updatedTodos);

      scheduleAlarm();
      filterUpcomingEvents();
    }
    if (events.length > 0) {
          scheduleAlarm();
          filterUpcomingEvents();
       }
  }, [todoList, events]); // todoList가 변경될 때마다 실행
  
    // useEffect(() => {
    //   if (events.length > 0) {
    //     scheduleAlarm();
    //     filterUpcomingEvents();
    //   }
    // }, [events]);

  return (
    <div>

<div>
      <h2>📌 투두리스트</h2>
      <input
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button onClick={addTodo}>추가</button>
      <ul>
        {todoList.map((todo, index) => (
          <li key={index} style={{ textDecoration: todo.completed ? "line-through" : "none" }}>
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(index)} />
            {todo.text}
          </li>
        ))}
      </ul>
    </div>

<div>
      <h3>📅 최근 일정</h3>
      {upcomingEvents.length > 0 ? (
        <ul>
          {upcomingEvents
            .slice() // 원본 배열을 변경하지 않도록 복사
            .sort((a, b) => new Date(a.start) - new Date(b.start)) // 날짜 기준 오름차순 정렬
            .map((event, index) => (
              <li key={index}>
                {new Date(event.start).toLocaleDateString()} : {event.title}
              </li>
            ))}
        </ul>
      ) : (
        <p>예정된 일정이 없습니다.</p> // 일정이 없을 경우 메시지 추가
      )}
    </div>


    </div>
   
  );
  
};
  

  export default Alams;