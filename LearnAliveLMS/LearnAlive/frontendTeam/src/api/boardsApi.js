import axios from "axios";

// API 기본 URL
const API_BASE_URL = "http://localhost:8080/api/boards";


// 게시판 목록 가져오기
export const fetchBoardsByClassId = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/${classId}`);
  console.log( "함수 실행");
  return response.data;
  
};

// 게시판 추가하기
export const createBoard = async (board, classId) => {
  const response = await axios.post(`${API_BASE_URL}/${classId}/addBoard`, board);
  return response.data;
};

// 게시판 삭제하기
export const deleteBoardByBoardId = async (boardId) => {
  try{
    const response =await axios.delete(`${API_BASE_URL}/${String(boardId)}`);
    console.log("삭제 성공:", response.data);
  } catch (error) {
    console.error("삭제 실패:", error.response ? error.response.data : error);
  }
};
