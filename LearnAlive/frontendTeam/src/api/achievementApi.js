import axios from "axios";

// API 기본 URL
const API_BASE_URL = "http://localhost:8080/api/achievements";

export const getAchievementByUser = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/${userId}`);
  return response.data;
};