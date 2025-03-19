package com.lms.attendance.service;

import java.util.List;
import java.util.Map;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.lms.attendance.model.StudentSurveyStatus;
import com.lms.attendance.model.SurveyResponse;
import com.lms.attendance.model.SurveyResponseVisualization;
import com.lms.attendance.repository.SurveyMapper;
import com.lms.attendance.repository.SurveyResponseMapper;

@Service
public class SurveyResponseService {
    private final SurveyResponseMapper surveyResponseMapper;
    private final SurveyMapper surveyMapper;

    public SurveyResponseService(SurveyResponseMapper surveyResponseMapper, SurveyMapper surveyMapper) {
        this.surveyResponseMapper = surveyResponseMapper;
        this.surveyMapper = surveyMapper;
    }

    /** ✅ 특정 사용자의 응답 조회 */
    public List<SurveyResponse> getUserResponse(int surveyId, String userId) {
        return surveyResponseMapper.getUserResponse(surveyId, userId);
    }

    /** ✅ 응답 제출 또는 수정 */
    @Transactional
    public boolean submitOrUpdateResponse(int surveyId, String userId, Map<Integer, String> responses) {
        boolean isUpdated = false;

        for (Map.Entry<Integer, String> entry : responses.entrySet()) {
            int questionId = entry.getKey();
            String response = entry.getValue();

            SurveyResponse existingResponse = surveyResponseMapper.findResponse(surveyId, userId, questionId);

            if (existingResponse != null) {
                // ✅ 기존 응답이 있으면 업데이트
                surveyResponseMapper.updateResponse(surveyId, userId, questionId, response);
                isUpdated = true;
            } else {
                // ✅ 없으면 새로 삽입
                surveyResponseMapper.insertResponse(surveyId, userId, questionId, response);
            }
        }
        return isUpdated;
    }
    
    /** ✅ 응답 여부 조회 서비스 */
    public List<StudentSurveyStatus> getSurveyResponseStatus(int surveyId) {
        return surveyResponseMapper.getSurveyResponseStatus(surveyId);
    }
    
    /** ✅ 특정 설문조사의 모든 응답을 시각화용으로 가져오기 */
    public List<SurveyResponseVisualization> getSurveyResponsesForVisualization(int surveyId) {
        return surveyResponseMapper.getSurveyResponsesForVisualization(surveyId);
    }
}
