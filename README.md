3/26 2차 업데이트 (팀 활동 부분 마무리)

1. 데이터베이스
  가. 추가
     1) team_activity_post
     2) team_activity_application
     3) team_activity_comment
     4) project_member

3. 백엔드
   가. model
     1) 추가
        가) TeamActivityApplication
        나) TeamActivityComment
        다) TeamActivityPost
        라) ProjectMember
     2) 수정
        가) Student
   나. mapper
     1) 추가
        가) TeamActivityApplicationMapper
        나) TeamActivityCommentMapper
        다) TeamActivityPostMapper
        라) ProjectMemberMapper
     2) 수정
        가) AttendanceMapper
        나) StudentMapper
   다. service
     1) 추가
        가) TeamActivityService
     2) 수정
        가) AttendanceService
        나) AttendanceServiceImpl
   라. controller
     1) 추가
        가) TeamActivityController
     2) 수정
        가) AttendanceController
        나) StudentContorller
   마. typehandler
     1) 추가
        가) ListToJsonTypeHandler

4. 프론트엔드
   가. api
     1) 추가
        가) teamActivityApi
     2) 수정
        가) postApi
        나) studentApi
   나. components
     1) 추가
        가) ApplicationApproval
        나) ApprovedMembers
        다) TeamActivity
        라) TeamActivityAddPost
        마) TeamActivityPostDetail
     2) 수정
        가) Achievements
        나) MyAttendance
   다. context
     1) 수정
        가) AuthProvider
   라. pages
     1) 수정
        가) ClassroomDetail
   마. App.jsx (수정)

--------------------------------------------------------

3/26 업데이트 (팀 활동 부분 추가, 마이페이지 출결내역 확인 오류 수정)

---------------------------------------------------------

3/23

업적 관련 백엔드, 프론트엔트 파일을 추가했습니다.
윤성님이 합쳐주신 통합 코드로 다시 올리다보니 브렌치를 새로 만들었습니다.

기본 위치
백엔드 : LearnAlive -> src
프론트엔드 : Learnalive -> frontendteam

백엔드
1. model : Achievement.java
2. mapper : AchievementMapper.java
3. service : AchievementService.java
4. controller : AchievementControoler.java

프론트엔드
1. api : achievementApi.js
2. components : Achievement.jsx, AchievementDetil.jsx
3. App.jsx -> Achievement.jsx, AchievementDetil.jsx import 부분 및 mypage route 부분 코드 추가
