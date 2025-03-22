import axios from "axios";

// 세션에서 userId 가져오기
const user = JSON.parse(sessionStorage.getItem('user'));  // JSON 파싱
const userId = user ? user.userId : null;  // user가 없을 경우 대비
const API_BASE_URL = `http://localhost:8080/api/schedules/${userId}`;


// 일정 목록 가져오기
export const getAllSchedule = async () => {
    const response = await axios.get(`${API_BASE_URL}/`);
    console.log( "일정 가져오기 실행");
    console.log("API 응답:", response.data); // 여기서 반환된 데이터 확인
    return response.data;
  };

  // 일정 추가하기
export const createSchedule = async (schedule) => {
    const response = await axios.post(`${API_BASE_URL}/`, schedule);
    return response.data;
  };

  //일정 삭제
  export const deleteSchedule = async (scheduleId) => {
    console.log("deleteSchedule 함수 호출, scheduleId:", scheduleId);  // 삭제할 id 로그 확인
    const response = await axios.delete(`${API_BASE_URL}/${scheduleId}`);  // 기존 API_BASE_URL에 scheduleId 추가
    return response;
  }

  //일정 수정
  export const updateSchedule = async (scheduleId, updatedData) => {
    return axios.put(`${API_BASE_URL}/${scheduleId}`, updatedData);
  };

  //날짜별 일정 가져오기
  export const getScheduleByDate = async (date) => {
    const response = await axios.get(`${API_BASE_URL}/${date}`);
   
    return response.data;
  }

  // 알람이 설정된 일정 조회
  export const getSchedulesWithAlarm = async () => {
    const response = await axios.get(`${API_BASE_URL}/alarm`);
   
    return response.data;
  }