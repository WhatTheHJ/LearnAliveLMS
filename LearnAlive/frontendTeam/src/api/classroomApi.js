import axios from "axios";
const API_BASE_URL = "http://localhost:8080/api/classes";

export const fetchClassrooms = async (userId) => {
  const response = await axios.get(`${API_BASE_URL}/user/${userId}`);
  return response.data;
};

export const addClassroom = async (classroomData) => {
  console.log("보내는 데이터 확인 👉", classroomData);  // 확인용 로그 추가
  const response = await axios.post(`${API_BASE_URL}/add`, classroomData, {
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${localStorage.getItem("token")}`
    }
  });
  return response.data;
};

// ✅ 관리자용 - 전체 강의실 조회
export const fetchAllClassroomsForAdmin = async () => {
  const response = await axios.get(`${API_BASE_URL}/admin/all`);
  return response.data;
};

// 강의실 삭제 API
export const deleteClassroom = async (classId) => {
  return await axios.delete(`${API_BASE_URL}/${String(classId)}`);
};

// 모든 강의실 가져오기
export const fetchAllClassrooms = async () => {
  const response = await axios.get(`${API_BASE_URL}/all`);
  return response.data;
};

// ✅ 강의실 출석 시간 정보 가져오기
export const fetchClassSettings = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/${classId}/settings`);
  return response.data;
};

// ✅ 강의실 출석 시간 저장하기
export const updateClassSettings = async (classId, settings) => {
  await axios.put(`${API_BASE_URL}/${classId}/settings`, settings);
};

// ✅ 클래스 정보 가져오기
export const fetchClassDetail = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/detail/${classId}`);
  return response.data;
};

// ✅ 성적(점수, 등급) 업데이트 API
export const updateClassGrade = async (classId, score, grade) => {
  const response = await axios.put(`${API_BASE_URL}/${classId}/grade`, { score, grade });
  return response.data;
};

export const updateClassDescription = async (classId, description) => {
  const response = await axios.put(`${API_BASE_URL}/${classId}/description`, { description });
  return response.data;
};

// 강의별 시험 채점 정보를 가져옵니다.
export const fetchExamScores = async (classId) => {
  const response = await axios.get(`${API_BASE_URL}/${classId}/exam-scores`);
  return response.data;
};

// 특정 학생의 시험 채점 정보를 업데이트합니다.
export const updateExamScore = async (classId, studentId, score, grade) => {
  const response = await axios.put(
    `${API_BASE_URL}/${classId}/exam-scores/${studentId}`,
    { score, grade }
  );
  return response.data;
};

// 특정 학생의 시험 채점 정보를 새로 추가합니다.
export const insertExamScore = async (classId, studentId, score, grade) => {
  const response = await axios.post(
    `${API_BASE_URL}/${classId}/exam-scores`,
    { studentId, score, grade }
  );
  return response.data;
};