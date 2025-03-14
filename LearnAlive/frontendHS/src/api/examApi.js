import axios from 'axios';

const API_URL = 'http://localhost:8080/api/exams';

// ✅ 새로운 시험 추가
export const createExam = async (examData) => {
  const response = await axios.post(`${API_URL}`, examData);
  return response.data;
};

// ✅ 특정 클래스의 시험 목록 가져오기
export const fetchExams = async (classId) => {
  try {
    const response = await axios.get(`${API_URL}`, {
      params: { classId }, // classId를 쿼리 파라미터로 전달
    });
    return response.data;
  } catch (error) {
    console.error('❌ 시험 목록을 불러오는 데 실패했습니다:', error);
    throw error;
  }
};

// ✅ 특정 시험 상세 보기
export const fetchExamDetail = async (examId) => {
  const response = await axios.get(`${API_URL}/${examId}`);
  return response.data;
};

// ✅ 시험 삭제
export const deleteExam = async (examId) => {
  return await axios.delete(`${API_URL}/${String(examId)}`);
};

// ✅ 시험 수정
export const updateExam = async (examId, editedExam) => {
  const response = await axios.put(`${API_URL}/${examId}`, editedExam);
  return response.data; // 수정된 데이터 반환
};

// ✅ 시험 응시 데이터 제출
export const submitExam = async (examId, answers) => {
  const response = await axios.post(`${API_URL}/${examId}/submit`, answers, {
    headers: {
      'Content-Type': 'application/json', // 요청 헤더에 Content-Type 명시
    },
  });
  return response.data;
};

// ✅ 시험 점수 가져오기
export const fetchExamScore = async (examId) => {
  const response = await axios.get(`${API_URL}/${examId}/score`);
  return response.data;
};
