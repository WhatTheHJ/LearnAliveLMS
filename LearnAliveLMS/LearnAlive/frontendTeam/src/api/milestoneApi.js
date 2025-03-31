// import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api";

// // 교수용: 특정 강의실(classId)에 공통 마일스톤 등록
// export const createClassMilestones = async (classId, milestones) => {
//   const response = await axios.post(`${API_BASE_URL}/class-milestones/${classId}`, { milestones });
//   return response.data;
// };

// // 학생용: 특정 강의실(classId)와 게시글(postId)에 대해 공통 마일스톤과 진행 상태를 조회
// export const getCommonMilestonesForPost = async (classId, postId) => {
//   const response = await axios.get(`${API_BASE_URL}/class-milestones/${classId}/posts/${postId}`);
//   return response.data;
// };

// // 학생용: 특정 게시글(postId)에서 특정 마일스톤(milestoneId)의 상태 업데이트 (예: 'completed')
// export const updatePostMilestoneStatus = async (postId, milestoneId, status) => {
//   const response = await axios.put(`${API_BASE_URL}/post-milestone-status/${postId}/${milestoneId}`, null, {
//     params: { status },
//   });
//   return response.data;
// };


// src/api/milestoneApi.js
// import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api";

// // 교수용: 특정 강의실(classId)에 공통 마일스톤 등록
// export const createClassMilestones = async (classId, milestones) => {
//   const response = await axios.post(`${API_BASE_URL}/class-milestones/${classId}`, { milestones });
//   return response.data;
// };

// // 교수용: 특정 강의실(classId)에 이미 등록된 마일스톤 목록 조회
// export const getClassMilestones = async (classId) => {
//   const response = await axios.get(`${API_BASE_URL}/class-milestones/${classId}`);
//   return response.data; // [{ milestoneId, classId, title, dueDate, createdAt, ...}, ...]
// };

// // 학생용: 특정 강의실(classId)와 게시글(postId)에 대해 공통 마일스톤과 진행 상태를 조회
// export const getCommonMilestonesForPost = async (classId, postId) => {
//   const response = await axios.get(`${API_BASE_URL}/class-milestones/${classId}/posts/${postId}`);
//   return response.data;
// };

// // 학생용: 특정 게시글(postId)에서 특정 마일스톤(milestoneId)의 상태 업데이트 (예: 'completed')
// export const updatePostMilestoneStatus = async (postId, milestoneId, status) => {
//   const response = await axios.put(
//     `${API_BASE_URL}/post-milestone-status/${postId}/${milestoneId}`,
//     null,
//     { params: { status } }
//   );
//   return response.data;
// };




// import axios from "axios";

// const API_BASE_URL = "http://localhost:8080/api";

// // 교수용: 특정 강의실(classId)에 공통 마일스톤 등록
// export const createClassMilestones = async (classId, milestones) => {
//   const response = await axios.post(`${API_BASE_URL}/class-milestones/${classId}`, { milestones });
//   return response.data;
// };

// // 교수용: 특정 강의실(classId)에 이미 등록된 마일스톤 목록 조회
// export const getClassMilestones = async (classId) => {
//   const response = await axios.get(`${API_BASE_URL}/class-milestones/${classId}`);
//   return response.data;
// };

// // 교수용: 특정 마일스톤 업데이트 (PUT /api/class-milestones/{milestoneId})
// export const updateClassMilestone = async (milestoneId, milestoneData) => {
//   const response = await axios.put(`${API_BASE_URL}/class-milestones/${milestoneId}`, milestoneData);
//   return response.data;
// };

// // 나머지 함수들...
// export const getCommonMilestonesForPost = async (classId, postId) => {
//   const response = await axios.get(`${API_BASE_URL}/class-milestones/${classId}/posts/${postId}`);
//   return response.data;
// };

// export const updatePostMilestoneStatus = async (postId, milestoneId, status) => {
//   const response = await axios.put(`${API_BASE_URL}/post-milestone-status/${postId}/${milestoneId}`, null, {
//     params: { status },
//   });
//   return response.data;
// };




// src/api/milestoneApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api";

// 기존 함수들...
export const createClassMilestones = async (classId, milestones) => {
  const response = await axios.post(`${API_BASE_URL}/class-milestones/${classId}`, { milestones });
  return response.data;
};

export const getClassMilestones = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/class-milestones/${classId}`);
  return response.data;
};

export const updateClassMilestone = async (milestoneId, milestoneData) => {
  const response = await axios.put(`${API_BASE_URL}/class-milestones/${milestoneId}`, milestoneData);
  return response.data;
};

// 삭제 API 추가
export const deleteClassMilestone = async (milestoneId) => {
  const response = await axios.delete(`${API_BASE_URL}/class-milestones/${milestoneId}`);
  return response.data;
};

export const getCommonMilestonesForPost = async (classId, postId) => {
  const response = await axios.get(`${API_BASE_URL}/class-milestones/${classId}/posts/${postId}`);
  return response.data;
};

export const updatePostMilestoneStatus = async (postId, milestoneId, status) => {
  const response = await axios.put(`${API_BASE_URL}/post-milestone-status/${postId}/${milestoneId}`, null, {
    params: { status },
  });
  return response.data;
};
