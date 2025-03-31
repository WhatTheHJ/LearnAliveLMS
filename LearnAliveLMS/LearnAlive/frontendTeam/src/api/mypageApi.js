import axios from "axios";

// API 기본 URL
const API_BASE_URL = "http://localhost:8080/api/mypage";

export const getUserById = async (userId, role) => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}/${role}`);
  return response.data;
};

// 사용자 정보 업데이트 (POST 요청)
export const updateUser = async (userId, email, phone) => {
  const response = await axios.post(`${API_BASE_URL}/update-user`, {
    userId,
    email,
    phone,
  });
  return response.data;
};

// 비밀번호 변경 (POST 요청)
export const updatePassword = async (userId, newPassword) => {
  const response = await axios.post(`${API_BASE_URL}/update-password`, {
    userId,
    newPassword,
  });
  return response.data;
};

export const getClassByClassId = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/classes/${classId}`);
  return response.data;
};