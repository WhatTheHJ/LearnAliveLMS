import "../styles/calendar.css";
import { useState } from 'react';
import { deleteSchedule, updateSchedule } from '../api/scheduleApi'; // API 함수 임포트

const ScheduleDetailModal = ({ isOpen, event, onClose, fetchSchedules  }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [updatedContent, setUpdatedContent] = useState(event?.extendedProps?.content || "");
  const [updatedTitle, setUpdatedTitle] = useState(event?.title || "");

  const handleDelete = async () => {
    try {
      const scheduleId = event.id;
      console.log("삭제할 scheduleId:", scheduleId);  // scheduleId 값 확인
      const response = await deleteSchedule(scheduleId);  // scheduleId 전달
      console.log('일정 삭제 성공:', response);
      fetchSchedules();  // 삭제 후 일정 목록을 새로고침
      onClose();  // 삭제 후 모달 닫기
    } catch (error) {
      console.error("일정 삭제 실패:", error);
      alert("일정 삭제에 실패했습니다.");
    }
  };

  const handleUpdate = async () => {
    try {
      const updatedData = {
        // ...event,
        title: updatedTitle,
        content: updatedContent,
      };
      await updateSchedule(event.id, updatedData);  // 수정할 일정의 ID
      alert("일정이 수정되었습니다.");
      fetchSchedules();
      onClose();  // 모달 닫기
    } catch (error) {
      console.error("일정 수정 실패:", error);
      alert("일정 수정에 실패했습니다.");
    }
  };

  const handleEditToggle = () => {
    setIsEditing(!isEditing);
  };


  //---------------------------------------------------------

  if (!isOpen || !event) return null;

  //  console.log("모달 이벤트 데이터:", event.extendedProps); // 🔥 디버깅용 로그 추가<확인완>

  return (
    <div className="modal-overlay">
      <div className="modal">
        <h2>일정 상세</h2>
        <p><strong>제목:</strong> {isEditing ? <input type="text" value={updatedTitle} onChange={(e) => setUpdatedTitle(e.target.value)} /> : updatedTitle}</p>
        <p><strong>내용:</strong> {isEditing ? <textarea value={updatedContent} onChange={(e) => setUpdatedContent(e.target.value)} /> : updatedContent}</p>
        <p><strong>알람 설정:</strong> {event.extendedProps?.mark ? "🔔 설정됨" : "❌ 없음"}</p>
        <p><strong>알람 시간:</strong> {event.extendedProps?.alarmTime || "없음"}</p>
        <p><strong>날짜:</strong> {new Date(event.start).toLocaleDateString()}</p>

        <div className="modal-buttons">
          <button onClick={onClose}>닫기</button>
          <button onClick={handleEditToggle}>{isEditing ? "취소" : "수정"}</button>
          {isEditing && <button onClick={handleUpdate}>수정 저장</button>}
          <button onClick={handleDelete}>삭제</button>
        </div>
      </div>
    </div>
  );
};

export default ScheduleDetailModal;