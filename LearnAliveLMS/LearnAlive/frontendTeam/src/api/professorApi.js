import axios from "axios";

const BASE_URL = "http://localhost:8080/api/professors";

// 아이디 찾기 API
export const findProfessorId = async (name, email) => {
    console.log("API URL 확인:", `${BASE_URL}/find-id`);
    const response = await axios.post(
      `${BASE_URL}/find-id`,
      { name, email },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  };
  
  // 비밀번호 재설정 API
  export const resetProfessorPassword = async (userId, name, phone, newPassword) => {
    const response = await axios.post(
      `${BASE_URL}/reset-password`,
      { userId, name, phone, newPassword },
      { headers: { "Content-Type": "application/json" } }
    );
    return response.data;
  };
  