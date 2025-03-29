import { useState, useEffect, useMemo } from 'react';
import { useAuth } from '../context/AuthContext';
import {
  fetchPreRegistrationCourses,
  fetchMyPreRegisteredCourses,
  addPreRegistration,
  removePreRegistration
} from '../api/courseApi';
import '../styles/PreRegistrationPage.css';

function PreRegistrationPage() {
  const { user } = useAuth();
  const studentId = user?.userId; // 인증된 학생의 ID

  // 백엔드에서 불러온 강의 목록과 학생의 예비 신청 내역을 저장
  const [availableCourses, setAvailableCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');

  // 좌측 사이드바: 학점 정보 (하드코딩, 추후 백엔드 연동 가능)
  const majorCreditTaken = 51;
  const generalCreditTaken = 20;
  const majorCreditNeeded = 120 - majorCreditTaken; // 69
  const generalCreditNeeded = 25 - generalCreditTaken; // 5
  const minCredit = 15;
  const maxCredit = 21;

  // 컴포넌트 마운트 시, 그리고 studentId가 있을 때 API 호출하여 데이터 로드
  useEffect(() => {
    if (studentId) {
      // 예비 수강신청 가능한 강의 목록 불러오기
      fetchPreRegistrationCourses()
        .then(data => setAvailableCourses(data))
        .catch(error => console.error("Error fetching available courses:", error));

      // 해당 학생의 예비 신청 내역 불러오기
      fetchMyPreRegisteredCourses(studentId)
        .then(data => setMyCourses(data))
        .catch(error => console.error("Error fetching my courses:", error));
    }
  }, [studentId]);

  // 검색어로 강의 목록 필터링 (백엔드에서 검색 API를 호출할 수도 있음)
  const filteredCourses = useMemo(() => {
    const lowerSearch = searchTerm.toLowerCase();
    return availableCourses.filter(course =>
      course.className.toLowerCase().includes(lowerSearch) ||
      course.professor.toLowerCase().includes(lowerSearch)
    );
  }, [availableCourses, searchTerm]);

  // 예비 신청 추가 (장바구니에 담기)
  const handleAddCourse = (course) => {
    const alreadyAdded = myCourses.some(mc => mc.classId === course.classId);
    if (alreadyAdded) {
      alert('이미 예비 신청한 강의입니다.');
      return;
    }
    addPreRegistration({ studentId, classId: course.classId })
      .then(() => {
        // API 호출 후 성공하면, 내 신청 목록에 추가
        setMyCourses(prev => [...prev, course]);
        alert("강의가 예비 신청 목록에 추가되었습니다.");
      })
      .catch(error => {
        console.error("Error adding course:", error);
        alert("강의 추가 실패");
      });
  };

  // 예비 신청 삭제 (취소)
  const handleRemoveCourse = (classId) => {
    removePreRegistration({ studentId, classId })
      .then(() => {
        setMyCourses(prev => prev.filter(c => c.classId !== classId));
        alert("강의가 예비 신청 목록에서 제거되었습니다.");
      })
      .catch(error => {
        console.error("Error removing course:", error);
        alert("강의 삭제 실패");
      });
  };

  // 시간표에 표시할 요일 순서
  const weekDays = ['월', '화', '수', '목', '금'];

  return (
    <div className="pre-reg-container">
      {/* 좌측 사이드바: 학점 정보 */}
      <aside className="sidebar">
        <h2>학점 정보</h2>
        <div className="sidebar-info">
          <p>전공 취득 학점: {majorCreditTaken}</p>
          <p>교양 취득 학점: {generalCreditTaken}</p>
          <hr />
          <p>전공 남은 학점: {majorCreditNeeded}</p>
          <p>교양 남은 학점: {generalCreditNeeded}</p>
          <hr />
          <p>이번 학기 최소 학점: {minCredit}</p>
          <p>이번 학기 최대 학점: {maxCredit}</p>
        </div>
      </aside>

      {/* 오른쪽 메인 콘텐츠 */}
      <main className="main-content">
        {/* 상단: 강의 검색 영역 */}
        <div className="search-bar">
          <input
            type="text"
            placeholder="강의명 / 교수명 검색"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
          <button>검색</button>
        </div>

        {/* 중단: 강의 리스트 */}
        <div className="course-list">
          <h3>강의 목록</h3>
          <table>
            <thead>
              <tr>
                <th>No</th>
                <th>강의명</th>
                <th>학점</th>
                <th>교수</th>
                <th>요일</th>
                <th>시간</th>
                <th>정원/잔여</th>
                <th>신청</th>
              </tr>
            </thead>
            <tbody>
              {filteredCourses.map((course, idx) => (
                <tr key={course.classId}>
                  <td>{idx + 1}</td>
                  <td>{course.className}</td>
                  <td>{course.credit}</td>
                  <td>{course.professor}</td>
                  <td>{course.dayOfWeek.join(', ')}</td>
                  <td>{course.startTime} ~ {course.endTime}</td>
                  <td>{course.capacity} / {course.remainingSeats}</td>
                  <td>
                    <button onClick={() => handleAddCourse(course)}>
                      담기
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* 하단: 내가 신청한 강의 (예비 신청 목록) */}
        <div className="my-courses">
          <h3>내가 예비 신청한 강의</h3>
          {myCourses.length === 0 ? (
            <p>아직 신청한 강의가 없습니다.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>No</th>
                  <th>강의명</th>
                  <th>학수번호</th>
                  <th>학점</th>
                  <th>요일</th>
                  <th>시간</th>
                  <th>취소</th>
                </tr>
              </thead>
              <tbody>
                {myCourses.map((course, idx) => (
                  <tr key={course.classId}>
                    <td>{idx + 1}</td>
                    <td>{course.className}</td>
                    <td>{course.courseCode}</td>
                    <td>{course.credit}</td>
                    <td>{course.dayOfWeek.join(', ')}</td>
                    <td>{course.startTime} ~ {course.endTime}</td>
                    <td>
                      <button onClick={() => handleRemoveCourse(course.classId)}>
                        취소
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

        {/* 하단: 예비 시간표 */}
        <div className="time-table">
          <h3>예비 시간표</h3>
          <table>
            <thead>
              <tr>
                <th>시간 / 요일</th>
                {weekDays.map(day => (
                  <th key={day}>{day}</th>
                ))}
              </tr>
            </thead>
            <tbody>
              {['09:00', '10:00', '11:00', '13:00', '14:00', '15:00', '16:00'].map(time => (
                <tr key={time}>
                  <td>{time}</td>
                  {weekDays.map(day => {
                    const course = myCourses.find(c =>
                      c.dayOfWeek.includes(day) &&
                      c.startTime <= time &&
                      c.endTime > time
                    );
                    return <td key={day}>{course ? course.className : ''}</td>;
                  })}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </main>
    </div>
  );
}

export default PreRegistrationPage;
