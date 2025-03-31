import axios from "axios";

const API_URL = "http://localhost:8080/api/attendance";

export const fetchAttendanceByDate = async (classId, date) => {
  // ✅ 한국 시간대(KST)로 변환
  const localDate = new Date(date);
  localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset()); 
  const formattedDate = localDate.toISOString().split("T")[0]; // YYYY-MM-DD 형식으로 변환

  const response = await axios.get(`${API_URL}/class/${classId}/date/${formattedDate}`);
  return response.data;
};


export const updateAttendanceState = (attendanceId, state) =>
  axios.put(`${API_URL}/${attendanceId}/state`, { state });

export const updateAttendanceReason = (attendanceId, reason) =>
  axios.put(`${API_URL}/${attendanceId}/reason`, { reason });

export const deleteAttendance = (attendanceId) =>
  axios.delete(`${API_URL}/${attendanceId}`);

// ✅ 학생 출석 체크 (Check-in)
export const studentCheckIn = (studentId, classId, date) => {
  return axios.post(`${API_URL}/check-in`, {
    studentId: String(studentId),  // 반드시 문자열로 변환
    classId: Number(classId),      // 숫자로 변환
    date: String(date)             // YYYY-MM-DD 형식 유지
  });
};
export const addAttendance = (studentId, classId, date, state) =>
  axios.post(`${API_URL}/add`, { studentId, classId, date, state });

export const fetchAttendanceByStudent = async (studentId, date) => {
  const response = await axios.get(`${API_URL}/student/${studentId}?date=${date}`);
  return response.data;
}

// ✅ 한달 단위 출석 데이터를 가져오는 API 함수 추가 (YYYY-MM 형식의 month)
export const fetchMonthlyAttendance = async (studentId, month) => {
  const response = await axios.get(`${API_URL}/student/${studentId}/month`, { params: { month } });
  return response.data;
};

// 기존 import 및 API_URL 선언 위쪽에 추가
export const fetchPastAttendance = async (studentId, endDate) => {
  const response = await axios.get(`${API_URL}/student/${studentId}/past`, {
    params: { endDate },
  });
  return response.data;
};