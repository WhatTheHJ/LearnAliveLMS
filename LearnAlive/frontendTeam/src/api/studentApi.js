import axios from "axios";
const API_URL = "http://localhost:8080/api/students";

export const registerStudent = async (studentData) => {
  const response = await axios.post(`${API_URL}/register`, studentData);
  return response.data;
};

// ✅ 학생 정보 수정
export const updateStudent = async (studentId, updatedData) => {
  return axios.put(`${API_URL}/${studentId}`, updatedData);
};

// ✅ 학생 삭제 (🚀 여기 추가!)
export const deleteStudent = async (studentId) => {
  return axios.delete(`${API_URL}/${studentId}`);
};

// 학생 추가 api
export const registerStudentToClass = async (studentId, classId, remarks) => {
  return axios.post(`${API_URL}/register-to-class`, { studentId, classId, remarks });
};

// 기존 학생 데이터 검색
export const searchStudents = async (keyword) => {
  const response = await axios.get(`${API_URL}/search?keyword=${keyword}`);
  return response.data;
};


// 특정 강의실의 학생 목록 가져오기
export const fetchStudentsByClass = async (classId) => {
    const response = await axios.get(`${API_URL}/class/${classId}`);
    return response.data;
  };
