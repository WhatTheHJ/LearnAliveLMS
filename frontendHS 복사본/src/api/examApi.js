// src/api/examApi.js
import axios from "axios";

const API_BASE_URL = "http://localhost:8080/api/classes";

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