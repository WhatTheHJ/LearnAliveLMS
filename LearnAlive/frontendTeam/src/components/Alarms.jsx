import { useEffect, useState  } from 'react';
import {createTodo,deleteTodo,updateTodo, getTodo } from '../api/scheduleApi'; 
import { useAuth } from '../context/AuthContext';

const Alams = ({ events }) => {
  const [todoList, setTodoList] = useState([]); // 투두리스트 상태
  const [newTodo, setNewTodo] = useState(""); // 새로운 투두 입력값
  const [upcomingEvents, setUpcomingEvents] = useState([]); // 2주 내 일정 상태
  const { user } = useAuth();
 

//알람 전송
  const sendNotification = (title, content) => {
    if (Notification.permission === "granted") {
      new Notification(title, {
        body: content,
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

  //

  // useEffect(() => {
  //   setTimeout(() => {
  //     fetchTodo();
  //   }, 700); // 0.5초 후 실행
  // }, []);

  const fetchTodo = async () => {
        try {
          console.log("Fetching todos for userId:", user.userId); // userId 확인
          const todos = await getTodo(user.userId);
          console.log("Retrieved todos:", todos);
          const formattedTodo = todos.map(todo => ({
            id: todo.todoId,
            text: todo.text,
            completed: todo.completed,
          }));
          setTodoList(formattedTodo);
          console.log("todo 가져오기 완료:", formattedTodo);
        } catch (error) {
          console.error("todo 가져오기 실패:", error);
        }
      };

  // 투두 추가
  const addTodo = async () => {
    if (newTodo.trim()) {
      try{
        const newTask = { text: newTodo, completed: false, userId: user.userId };  // userId 포함
        const response = await createTodo(newTask);
        setTodoList([...todoList, response]);  // 서버 응답 데이터 반영
        setNewTodo("");
        
    } catch (error) {
      console.error("투두 추가 실패:", error);
    }
  }
  fetchTodo();
  };

   // 투두 완료 체크 (서버 연동)
   const toggleTodo = async (index) => {
    const updatedTodos = [...todoList];
    updatedTodos[index].completed = !updatedTodos[index].completed; // 상태 변경
  
    try {
      // 서버에 업데이트된 상태 반영
      await updateTodo(updatedTodos[index].id, updatedTodos[index]);
      setTodoList(updatedTodos);  // 상태 업데이트
    } catch (error) {
      console.error("투두 업데이트 실패:", error);
    }
  };

    // 투두 삭제 (서버 연동)
    const removeTodo = async (todoId) => {
      try {
        await deleteTodo(todoId);
        setTodoList(todoList.filter(todo => todo.todoId !== todoId));  // 삭제된 항목 제외
        // alert("삭제했습니다.")
        
      } catch (error) {
        console.error("투두 삭제 실패:", error);
      }
      fetchTodo();
    };
    
    useEffect(() => {
      const completedTodos = todoList.filter(todo => todo.completed);
      if (completedTodos.length > 2) {
        const sortedTodos = [...completedTodos].sort((a, b) => a.timestamp - b.timestamp);
        const oldestTodo = sortedTodos[0];  // 가장 오래된 완료된 투두
        removeTodo(oldestTodo.id);  // 가장 오래된 투두를 삭제
        fetchTodo();
      }
      if (events.length > 0) {
        scheduleAlarm();
        filterUpcomingEvents();
        fetchTodo();
      }
    }, [events]); // todoList 또는 events가 변경될 때 실행

  //      // 로딩 중일 때 처리
  //  if (loading) {
  //   return <div>로딩 중...</div>;
  // }
  
  return (
    <div>
    <div className='todo-list' >
    <h4>Todo List</h4>
      <div className='todo-input'>
      <input 
        type="text"
        value={newTodo}
        onChange={(e) => setNewTodo(e.target.value)}
        placeholder="할 일을 입력하세요"
      />
      <button onClick={addTodo}>추가</button>
      </div>
     

      <ul >
        {todoList.map((todo, index) => (
          <li key={index} className="todo-item">
            <input type="checkbox" checked={todo.completed} onChange={() => toggleTodo(index)} />
            
            <span>{todo.text}</span>
            <button onClick={() => removeTodo(todo.id)}>X</button>
          </li>
        ))}
      </ul>
    </div>

<div className='todo-list'>
      <h4>최근 일정</h4>
      {upcomingEvents.length > 0 ? (
        <ul className="event-list">
          {upcomingEvents
            .slice() // 원본 배열을 변경하지 않도록 복사
            .sort((a, b) => new Date(a.start) - new Date(b.start)) // 날짜 기준 오름차순 정렬
            .map((event, index) => (
              
              <li key={index} className="event-item">
                {new Date(event.start).toLocaleDateString('ko-KR', {
            // year: 'numeric',
            // month: 'long',
            day: 'numeric',
          })} : {event.title}
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