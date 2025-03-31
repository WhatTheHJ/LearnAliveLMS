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
export const createPost = async (boardId, postData, file) => {
  const formData = new FormData();

  if (file) {
    formData.append('file', file);
    console.log("📎 formData에 파일 추가:", file.name);
  }

  formData.append('post', JSON.stringify(postData));
  console.log("📤 최종 formData 내용:", formData);

  const response = await axios.post(`${API_BASE_URL}/${boardId}/post/new`, formData);
  console.log("✅ createPost() axios 응답:", response.data);
  return response.data;
};


//게시글 삭제
  export const deletePost = async (postId) => {
    const response = await axios.delete(`${API_BASE_URL}/${postId}/delete`);
    return response;
  }

   //게시글의 파일 다운로드
   export const downloadFile = async (postId) => {
    const response = await axios.get(`${API_BASE_URL}/${postId}/download`, {
      responseType: 'blob',  
    });
    return response;
  };

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
export const likePost = (postId, userId) => {
  return axios.post(`${API_BASE_URL}/${postId}/like`, null, {
   params: { userId }
});
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

  // 특정 사용자의 게시글 모두 조회
export const getUsersAllPosts = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}/posts`);
  return response.data;
};