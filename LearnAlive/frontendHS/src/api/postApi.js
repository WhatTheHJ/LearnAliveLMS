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
    const response = await axios.post(`${API_BASE_URL}/${boardId}/post/new`, postData);
    return response.data;
};

//게시글 삭제
  export const deletePost = async (postId) => {
    const response = await axios.delete(`${API_BASE_URL}/${postId}/delete`);
    return response;
  }

   //게시글의 파일 다운로드
   export const downloadFile = async(postId) => {
    const response = await axios.get(`${API_BASE_URL}/${postId}/download`);
    return response.data;
   }

  //게시글 수정
  export const updatePost = async (postId, updatedPost) => {
    try {
      const response = await fetch(`${API_BASE_URL}/${postId}/update`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(updatedPost),
      });
      if (!response.ok) {
        throw new Error("게시글 수정에 실패했습니다.");
      }
      return await response.json();
    } catch (error) {
      console.error("게시글 수정 오류:", error);
      throw error;
    }
  };

  //좋아요 기능
  // postApi.js
export const likePost = (postId, userId) => {
  return axios.post(`${API_BASE_URL}/${postId}/like`, { userId });
};

export const checkIfLiked = async (postId, userId) => {
  try {
    const response = await axios.get(`${API_BASE_URL}/${postId}/isLiked`, {
      params: { userId }
    });console.log(response.data);
    return response.data; // true 또는 false 반환
    
  } catch (error) {
    console.error("좋아요 상태 확인 오류:", error);
    return false;
  }
};

  // export const likePost = async (postId, userId) => {

  //     try {
  //       const response = await fetch(`${API_BASE_URL}/${postId}/like`, {
  //         method: 'POST',  // 반드시 POST 메서드로 요청
  //         headers: {
  //           'Content-Type': 'application/json',
  //       },
  //       body: JSON.stringify({ userId }),
  //       });
    
  //       if (!response.ok) {
  //         throw new Error("좋아요 상태 변경에 실패했습니다.");
  //       }
  //   } catch (error) {
  //     console.error("좋아요 처리 실패:", error);
  //     throw error;
  //   }
  // };

 
  