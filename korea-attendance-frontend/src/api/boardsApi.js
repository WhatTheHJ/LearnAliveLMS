import axios from "axios";

// API 기본 URL
const API_BASE_URL = "http://localhost:8080/api/boards";

// 게시판 목록 가져오기
export const fetchBoardsByClassId = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/${classId}`);
  console.log( "함수 실행");
  return response.data;
  
};

// // 게시판 추가하기
// export const addBoard = async (boardData) => {
//   const response = await axios.post(`${API_BASE_URL}/add`, boardData);
//   return response.data;
// };

// // 게시판 삭제하기
// export const deleteBoard = async (boardId) => {
//   return await axios.delete(`${API_BASE_URL}/${String(boardId)}`);
// };

