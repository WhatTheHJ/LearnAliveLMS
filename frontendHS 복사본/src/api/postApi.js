import axios from "axios";

// API 기본 URL
const API_BASE_URL = "http://localhost:8080/api/posts";


// 게시글 목록 가져오기
export const getAllPosts = async (boardId) => {
    const response = await axios.get(`${API_BASE_URL}/${boardId}/post`);
    console.log( "게시글 조회 함수 실행");
    return response.data;
    
  };

  //postid별 게시글 가져오기
  export const getPostById = async (postId) => {
    const response = await axios.get(`${API_BASE_URL}/${postId}`);
   
    return response.data;
  }

// 게시글 작성
  export const createPost = async (boardId, postData) => {
    console.log("📌 게시글 추가 요청:", { boardId, postData });
    const response = await axios.post(`${API_BASE_URL}/${boardId}/post/new`, postData);
    console.log("📌 게시글 추가 응답:", response.data);
    return response.data;
};

//게시글 삭제
  export const deletePost = async (postId) => {
    const response = await axios.delete(`${API_BASE_URL}/${postId}/delete`);
    return response;
  }

  // 특정 사용자의 게시글 모두 조회
export const getUsersAllPosts = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}/posts`);
  return response.data;
};