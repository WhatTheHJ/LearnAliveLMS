import axios from "axios";
const API_BASE_URL = "http://localhost:8080/api/classes";

export const fetchClassrooms = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};

export const addClassroom = async (classroomData) => {
  const response = await axios.post(`${API_BASE_URL}/add`, classroomData);
  return response.data;
};

// 강의실 삭제 API
export const deleteClassroom = async (classId) => {
  return await axios.delete(`${API_BASE_URL}/${String(classId)}`);
};

// 모든 강의실 가져오기
export const fetchAllClassrooms = async () => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data;
};

// ✅ 강의실 출석 시간 정보 가져오기
export const fetchClassSettings = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/${classId}/settings`);
  return response.data;
};

// ✅ 강의실 출석 시간 저장하기
export const updateClassSettings = async (classId, settings) => {
  await axios.put(`${API_BASE_URL}/${classId}/settings`, settings);
};

// ✅ 클래스 정보 가져오기
export const fetchClassDetail = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/detail/${classId}`);
  return response.data;
};