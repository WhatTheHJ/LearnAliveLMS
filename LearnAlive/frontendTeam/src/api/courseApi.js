import axios from "axios";
const API_BASE_URL = "http://localhost:8080/api/course";

// ✅ 예비 수강신청 가능한 강의 목록 가져오기
export const fetchPreRegistrationCourses = async () => {
  const response = await axios.get(`${API_BASE_URL}/pre/courses`);
  // dayOfWeek 콤마(,)로 넘어오니 배열로 변환
  const transformed = response.data.map(course => ({
    ...course,
    dayOfWeek: course.dayOfWeek ? course.dayOfWeek.split(',') : []
  }));
  return transformed;
};

// ✅ 학생의 예비 수강신청 내역 가져오기
export const fetchMyPreRegisteredCourses = async (studentId) => {
  const response = await axios.get(`${API_BASE_URL}/pre/mycourses`, {
    params: { studentId }
  });
  const transformed = response.data.map(course => ({
    ...course,
    dayOfWeek: course.dayOfWeek ? course.dayOfWeek.split(',') : []
  }));
  return transformed;
};

// ✅ 예비 수강신청 추가 (장바구니 담기)
export const addPreRegistration = async ({ studentId, classId }) => {
  const response = await axios.post(`${API_BASE_URL}/pre`, { studentId, classId }, {
    headers: { "Content-Type": "application/json" }
  });
  return response.data;
};

// ✅ 예비 수강신청 삭제 (취소)
export const removePreRegistration = async ({ studentId, classId }) => {
  const response = await axios.delete(`${API_BASE_URL}/pre`, {
    params: { studentId, classId }
  });
  return response.data;
};
