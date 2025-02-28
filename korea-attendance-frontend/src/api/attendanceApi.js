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

