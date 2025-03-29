## Front-end

1. [수정] api → studentApi.js (학습자 아이디찾기, 비밀번호 재설정 Api 추가)
2. [생성] api - milestoneApi.js
  
3. [수정] components → FindAccountModal.jsx  (아이디찾기, 비밀번호 재설정 기능 사용시 교수자와 학습자를 선택해서 찾도록 라디오버튼 추가)
4. [수정] components → CreateProfessor.jsx (교수자 생성 css 조정을 위해 수정)
5. [3가지 파일 생성] components - TeamClassMilestoneSetup.jsx // TeamProjectMilestones.jsx // TeamProjectMilestoneView.jsx
   
6. [수정]pages → ManageNotice.jsx (UI 개선)
   
7. [수정] styles → CreateProfessor.module.css (교수자 생성 css 조정을 위해 수정)
8. [생성] styles - ProjectMilestones.css





## Back-end (학습자 ID 찾기, 비밀번호 재설정 코드들 추가)

1. [수정]Controller  → StudentController
2. [2가지 파일 생성] controller - TeamClassMilestoneController.java // TeamPostMilestoneStatusController.java
   
1. [2가지 파일 생성] model - TeamClassMilestone.java // TeamPostMilestoneStatus.java

1. [수정]repository → StudentMapper
2. [2가지 파일 생성] repository - TeamClassMilstoneMapper.java // TeamPostMilestoneStatusMapper.java

1. [수정]service → StudentService
2. [2가지 파일 생성] service - TeamClassMilestoneService.java // TeamPostMilestoneStatusService.java



