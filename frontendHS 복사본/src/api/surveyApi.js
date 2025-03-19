import axios from "axios";

const API_URL = "http://localhost:8080/api/surveys";

/** ✅ 특정 강의실의 설문조사 게시판 목록 조회 */
export const fetchSurveyBoards = async (classId) => {
    try {
        const response = await axios.get(`${API_URL}/boards/${classId}`);
        return response.data;
    } catch (error) {
        console.error("❌ 설문조사 게시판 목록 조회 오류:", error);
        return [];
    }
};

/** ✅ 설문조사 게시판 생성 */
export const createSurveyBoard = async (classId) => {
    try {
        const response = await axios.post(`${API_URL}/board/${classId}`);
        return response.data;
    } catch (error) {
        console.error("❌ 설문조사 게시판 생성 오류:", error);
        return null;
    }
};

/** ✅ 특정 게시판의 설문조사 목록 조회 */
export const fetchSurveysByBoard = async (boardId) => {
    try {
        const response = await axios.get(`${API_URL}/board/${boardId}/surveys`);
        return response.data;
    } catch (error) {
        console.error("❌ 설문조사 목록 조회 오류:", error);
        return [];
    }
};

/** ✅ 특정 설문조사 상세 정보 조회 (post + question) */
export const fetchSurveyDetail = async (surveyId) => {
    console.log(`📌 fetchSurveyDetail 요청: ${API_URL}/survey/${surveyId}`);
    try {
      const response = await axios.get(`${API_URL}/survey/${surveyId}`);
      console.log("📌 불러온 설문조사 상세:", response.data);
      return response.data;
    } catch (error) {
      console.error("❌ 설문조사 상세 조회 오류:", error);
      return null;
    }
  };

/** ✅ 설문조사 + 질문을 한 번에 생성하는 API 요청 */
export const createSurveyWithQuestions = async (surveyData) => {
  try {
      console.log("📌 설문조사 생성 요청 데이터:", JSON.stringify(surveyData, null, 2));
      const response = await axios.post(`${API_URL}/create`, surveyData, {
          headers: { "Content-Type": "application/json" }
      });
      console.log("📌 설문조사 생성 응답:", response.data);
      return response.data;
  } catch (error) {
      console.error("❌ 설문조사 생성 오류:", error.response?.data || error.message);
      return null;
  }
};
  
  /** ✅ 설문 시작 및 종료 시간 업데이트 API */
  export const updateSurveyTimes = async (surveyId, startTime, endTime) => {
    try {
      const response = await axios.put(`${API_URL}/${surveyId}/update-times`, { startTime, endTime });
      return response.data;
    } catch (error) {
      console.error("❌ 설문 시간 업데이트 오류:", error);
      throw error;
    }
  };

/** ✅ 특정 사용자의 응답 조회 */
export const fetchUserResponse = async (surveyId, userId) => {
    try {
      const response = await axios.get(`${API_URL}/${surveyId}/response/${userId}`);
      console.log("📌 사용자의 기존 응답:", response.data);
  
      const formattedResponses = {};
  
      if (Array.isArray(response.data)) {
        // ✅ 응답 데이터가 배열일 경우 (기존 로직 유지)
        response.data.forEach((res) => {
          try {
            formattedResponses[res.questionId] = JSON.parse(res.response); // 다중 선택 응답 처리
          } catch {
            formattedResponses[res.questionId] = res.response; // 일반 응답 처리
          }
        });
      } else if (typeof response.data === "object" && response.data !== null) {
        // ✅ 응답 데이터가 객체일 경우 (객체를 직접 가공)
        Object.keys(response.data).forEach((key) => {
          try {
            formattedResponses[key] = JSON.parse(response.data[key]); // 다중 선택 응답 처리
          } catch {
            formattedResponses[key] = response.data[key]; // 일반 응답 처리
          }
        });
      } else {
        console.warn("⚠️ 예상치 못한 응답 데이터 형식:", response.data);
      }
  
      return formattedResponses;
    } catch (error) {
      console.error("❌ 응답 데이터 조회 오류:", error);
      return null;
    }
  };
  
  
  /** ✅ 설문 응답 제출 또는 수정 */
  export const submitOrUpdateResponse = async (surveyId, userId, responses) => {
    try {
      // ✅ 다중 선택 응답은 JSON 문자열로 변환
      const formattedResponses = {};
      Object.keys(responses).forEach((questionId) => {
        formattedResponses[questionId] = Array.isArray(responses[questionId])
          ? JSON.stringify(responses[questionId])
          : responses[questionId];
      });
  
      const response = await axios.post(`${API_URL}/${surveyId}/response/${userId}`, formattedResponses);
      console.log("✅ 응답 제출/수정 성공:", response.data);
      alert(response.data); // 사용자에게 결과 알림
      return response.data;
    } catch (error) {
      console.error("❌ 응답 제출/수정 오류:", error);
      alert("❌ 응답 제출에 실패했습니다. 다시 시도해주세요.");
      return null;
    }
  };


/** ✅ 특정 설문조사의 질문 목록 조회 */
export const fetchSurveyQuestions = async (surveyId) => {
    try {
        const response = await axios.get(`${API_URL}/survey/${surveyId}/questions`);
        return response.data;
    } catch (error) {
        console.error("❌ 설문 질문 목록 조회 오류:", error);
        return [];
    }
};



/** ✅ 특정 설문조사의 응답 목록 조회 */
export const fetchSurveyResponses = async (surveyId) => {
    try {
        const response = await axios.get(`${API_URL}/survey/${surveyId}/responses`);
        return response.data;
    } catch (error) {
        console.error("❌ 설문 응답 목록 조회 오류:", error);
        return [];
    }
};

/** ✅ 특정 학생이 특정 설문조사에 대한 응답 조회 */
export const fetchStudentSurveyResponses = async (surveyId, studentId) => {
    try {
        const response = await axios.get(`${API_URL}/survey/${surveyId}/student/${studentId}/responses`);
        return response.data;
    } catch (error) {
        console.error("❌ 특정 학생 설문 응답 조회 오류:", error);
        return [];
    }
};

/** ✅ 특정 학생이 응답한 모든 설문조사 목록 조회 */
export const fetchStudentSurveys = async (studentId) => {
    try {
        const response = await axios.get(`${API_URL}/student/${studentId}/surveys`);
        return response.data;
    } catch (error) {
        console.error("❌ 특정 학생 설문 목록 조회 오류:", error);
        return [];
    }
};

/** ✅ 설문 응답 제출 */
export const submitSurveyResponse = async (responseData) => {
    try {
        await axios.post(`${API_URL}/response`, responseData);
    } catch (error) {
        console.error("❌ 설문 응답 제출 오류:", error);
    }
};

/** 📌 특정 설문조사의 응답 여부 리스트 가져오기 */
export const fetchSurveyResponseStatus = async (surveyId) => {
    try {
      const response = await axios.get(`${API_URL}/${surveyId}/response-status`);
      
      if (Array.isArray(response.data)) {
        return response.data; // ✅ 정상적인 배열 반환
      } else {
        console.error("❌ 응답 데이터가 배열이 아닙니다:", response.data);
        return []; // ✅ 오류 발생 시 빈 배열 반환
      }
    } catch (error) {
      console.error("❌ 응답 여부 데이터 가져오기 실패:", error);
      return []; // ✅ API 오류 발생 시 빈 배열 반환
    }
  };

/** ✅ 특정 설문조사의 모든 응답을 시각화 용도로 가져오는 API */
export const fetchSurveyResponsesForVisualization = async (surveyId) => {
    try {
        const response = await axios.get(`${API_URL}/${surveyId}/responses/visualization`);
        return response.data;
    } catch (error) {
        console.error("❌ 설문 응답 시각화 데이터 조회 오류:", error);
        return [];
    }
};
