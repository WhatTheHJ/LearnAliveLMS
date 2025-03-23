### 윤성님이 금요일에 병합해주신 파일에 제 파일을 이식 및 수정하여 개선한 버전 입니다. 아래에 추가하거나 수정해야할 코드들을 말씀드리겠습니다 다들 화이팅!

# 주요 개선사항
1. admin(관리자) 계정으로 로그인 시 단과대학 및 학과 관리 기능 추가.
2. admin(관리자) 계정으로 로그인 시 교수자 추가버튼 누른 뒤 페이지 자동 렌더링이 되도록 디버깅 (STS 콘솔 무한루프 문제까지 해결)
3. 교수자 계정 추가 모달 UI 개선
4. 회원정보찾기 기능 확인
5. 회원가입시 관리자 계정으로 추가한 단과대학과 학과 안에서만 선택할 수 있도록 개선




## Front-end

1. (수정) components → AdminUniversityDepartmentManagement.jsx
2. (수정) components → CreateProfessor.jsx  (UI 개선, 교수자 생성시 자동렌더링, 백엔드 무한루프 해결)
3. (수정) conponents → RegisterStudent.jsx (학생 회원가입 시 관리자가 생성한 단과대학/학과 만 선택 가능하도록 수정)
3. (수정) pages → ProfessorStatus (UI 개선, 교수자 생성시 자동렌더링, 백엔드 무한루프 해결)
4. (생성) styles → CreateProfessor.module.css
5. (수정) App.jsx (import와 route에 코드 한줄씩 추가)

→ import AdminUniversityDepartmentManagement from "./components/AdminUniversityDepartmentManagement";

→ <Route path="/admin/university" element={<AdminUniversityDepartmentManagement />} />



## Back-end

1. (생성) Controller  → UniversityController
2. (생성) model → Department, University
3. (생성) repository → DepartmentMapper, UniversityMapper
4. (생성) service → UniversityService



## DB (student table 하단에 추가하시면 됩니다.)

-- university, department 테이블 생성
DROP TABLE IF EXISTS university;
CREATE TABLE university (
university_id INT AUTO_INCREMENT PRIMARY KEY,
university_name VARCHAR(255) NOT NULL UNIQUE
);

DROP TABLE IF EXISTS department;
CREATE TABLE department (
department_id INT AUTO_INCREMENT PRIMARY KEY,
department_name VARCHAR(255) NOT NULL,
university_id INT NOT NULL,
FOREIGN KEY (university_id) REFERENCES university(university_id)
);

SELECT * FROM university; -- 데이터가 들어있는지 확인
SELECT * FROM department; -- 데이터가 들어있는지 확인

--

--
