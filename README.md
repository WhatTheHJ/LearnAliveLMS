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





# 3. DB 에는 `team_activity_post` 테이블과 `todo_list` 테이블 사이에 이 두 테이블을 추가했습니다.






```jsx
--
-- Table structure for table `class_milestone`
--

DROP TABLE IF EXISTS `class_milestone`;
-- 1) 한 강의실에 대한 '공통 마일스톤' 정의 테이블
CREATE TABLE class_milestone (
    milestone_id INT AUTO_INCREMENT PRIMARY KEY,
    class_id INT NOT NULL,
    title VARCHAR(255) NOT NULL,
    due_date DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);


-- 3. (만약 기존에 잘못된 외래 키가 있으면 제거 -- MySQL에서는 IF EXISTS 사용 불가하므로, 필요시 수동으로 삭제)
ALTER TABLE class_milestone DROP FOREIGN KEY class_milestone_ibfk_1;

-- 4. 올바른 외래 키 제약조건 추가 (부모 테이블은 'class')
ALTER TABLE class_milestone
  ADD CONSTRAINT class_milestone_ibfk_1
  FOREIGN KEY (class_id) REFERENCES `class` (class_id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

--
-- Table structure for table `post_milestone_status`
--

DROP TABLE IF EXISTS `post_milestone_status`;
-- 2) 특정 게시글이 어떤 마일스톤을 어디까지 진행했는지 상태 저장
CREATE TABLE post_milestone_status (
    status_id INT AUTO_INCREMENT PRIMARY KEY,
    post_id INT NOT NULL,
    milestone_id INT NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'pending',
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    FOREIGN KEY (post_id) REFERENCES team_activity_post(post_id),
    FOREIGN KEY (milestone_id) REFERENCES class_milestone(milestone_id)
);

ALTER TABLE post_milestone_status
DROP FOREIGN KEY post_milestone_status_ibfk_2;

ALTER TABLE post_milestone_status
ADD CONSTRAINT post_milestone_status_ibfk_2
  FOREIGN KEY (milestone_id) REFERENCES class_milestone(milestone_id)
  ON DELETE CASCADE
  ON UPDATE CASCADE;

```
