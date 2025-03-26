import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/team-activities";

// 팀 활동 게시글 생성
export const createTeamActivityPost = async (postData) => {
  const response = await axios.post(`${API_BASE_URL}/posts`, postData);
  return response.data;
};

// 팀 활동 게시글 목록 조회
export const getTeamActivityPosts = async () => {
  const response = await axios.get(`${API_BASE_URL}/posts`);
  return response.data;
};

// 특정 팀 활동 게시글 조회
export const getTeamActivityPost = async (postId) => {
  const response = await axios.get(`${API_BASE_URL}/posts/${postId}`);
  return response.data;
};

// 강의실(classId)별 팀 활동 게시글 목록 조회 (추가된 엔드포인트)
export const getTeamActivityPostsByClassId = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/posts/class/${classId}`);
  return response.data;
};

// 팀 활동 게시물에 참가 신청하기
export const applyForTeamActivity = async (postId, applicantId) => {
  const response = await axios.post(`${API_BASE_URL}/${postId}/apply`, null, {
    params: { applicantId },
  });
  return response.data;
};

// 신청 승인 (게시물 작성자 전용)
export const approveTeamActivityApplication = async (applicationId) => {
  const response = await axios.put(`${API_BASE_URL}/applications/${applicationId}/approve`);
  return response.data;
};

// 신청 거절 (게시물 작성자 전용)
export const rejectTeamActivityApplication = async (applicationId) => {
  const response = await axios.put(`${API_BASE_URL}/applications/${applicationId}/reject`);
  return response.data;
};

// 특정 팀 활동 게시물에 대한 신청 목록 조회
export const getTeamActivityApplications = async (postId) => {
  const response = await axios.get(`${API_BASE_URL}/${postId}/applications`);
  return response.data;
};

// 팀 활동 게시물에 댓글 추가
export const addTeamActivityComment = async (postId, commentData) => {
  const response = await axios.post(`${API_BASE_URL}/${postId}/comments`, commentData);
  return response.data;
};

// 팀 활동 게시물의 댓글 목록 조회
export const getTeamActivityComments = async (postId) => {
  const response = await axios.get(`${API_BASE_URL}/${postId}/comments`);
  return response.data;
};

// 팀 활동 게시글 삭제 함수 추가
export const deleteTeamActivityPost = async (postId) => {
  const response = await axios.delete(`${API_BASE_URL}/posts/${postId}`);
  return response.data;
};

// 참석 API 함수 추가: POST /posts/{postId}/attend?attendeeId=...
export const attendTeamActivityPost = async (postId, attendeeId) => {
  const response = await axios.post(`${API_BASE_URL}/posts/${postId}/attend`, null, {
    params: { attendeeId },
  });
  return response.data;
};

export const toggleTeamActivityLike = async (postId, increment) => {
  const response = await axios.put(`${API_BASE_URL}/posts/${postId}/like`, null, {
    params: { increment }
  });
  return response.data;
};

// 승인된 프로젝트 멤버 조회 API 함수 추가
export const getProjectMembers = async (postId) => {
  const response = await axios.get(`${API_BASE_URL}/posts/${postId}/members`);
  return response.data;
};

// 특정 학생 정보를 조회하는 API 함수 추가
export const getStudentById = async (studentId) => {
  const response = await axios.get(`${API_BASE_URL}/auth/student/${studentId}`);
  return response.data;
};

export const deleteProjectMember = async (memberId) => {
  const response = await axios.delete(`${API_BASE_URL}/project-members/${memberId}`);
  return response.data;
};