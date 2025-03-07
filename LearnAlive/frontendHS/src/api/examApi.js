import axios from 'axios';

const API_BASE_URL = 'http://localhost:8080/api/professor/exams';

// ✅ 모든 시험 목록 가져오기
export const fetchExams = async () => {
  const response = await axios.get(`${API_BASE_URL}`);
  return response.data;
};

// ✅ 특정 시험 상세 정보 가져오기
export const fetchExamDetail = async (examId) => {
  const response = await axios.get(`${API_BASE_URL}/${examId}`);
  return response.data;
};

// ✅ 새로운 시험 추가
export const createExam = async (examData) => {
  const response = await axios.post(`${API_BASE_URL}`, examData);
  return response.data;
};

// ✅ 시험 삭제
export const deleteExam = async (examId) => {
  return await axios.delete(`${API_BASE_URL}/${String(examId)}`);
};

// ✅ 시험 수정
export const updateExam = async (examId, examData) => {
  await axios.put(`${API_BASE_URL}/${examId}`, examData);
};

// ✅ 시험 응시 데이터 제출
export const submitExam = async (examId, answers) => {
  const response = await axios.post(
    `${API_BASE_URL}/${examId}/submit`,
    answers
  );
  return response.data;
};

// ✅ 시험 점수 가져오기
export const fetchExamScore = async (examId) => {
  const response = await axios.get(`${API_BASE_URL}/${examId}/score`);
  return response.data;
};
