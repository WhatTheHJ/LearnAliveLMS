import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { fetchClassDetail } from '../api/classroomApi';
import { fetchSurveyBoards, createSurveyBoard } from '../api/surveyApi'; // ✅ 설문조사 API 불러오기
import { useAuth } from '../context/AuthContext';
import AttendancePage from '../pages/AttendancePage';
import ManageAttendance from '../pages/ManageAttendancePage';
import SurveyList from '../pages/SurveyList';
import SurveyCreate from '../components/SurveyCreate';
import '../styles/ClassroomDetail.css';

const ClassroomDetail = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const [classDetail, setClassDetail] = useState(null);
  const [activeComponent, setActiveComponent] = useState(null);
  const [boards, setBoards] = useState([]); // ✅ 게시판 목록 (설문조사만 관리)
  const [showBoardModal, setShowBoardModal] = useState(false); // ✅ 모달 상태
  const [selectedBoardId, setSelectedBoardId] = useState(null); // ✅ 선택한 게시판
  const [selectedBoardType, setSelectedBoardType] = useState(null); // ✅ 선택한 게시판 유형

  useEffect(() => {
    fetchClassDetail(classId)
      .then((data) => setClassDetail(data))
      .catch((error) =>
        console.error('❌ 강의실 정보를 불러오는데 실패했습니다:', error)
      );

    fetchSurveyBoards(classId) // ✅ 설문조사 게시판 목록 불러오기
      .then(setBoards)
      .catch((error) => console.error('❌ 게시판 목록 불러오기 실패:', error));
  }, [classId]);

  /** ✅ 게시판 추가 (사용자가 선택한 유형에 따라 API 호출) */
  const handleCreateBoard = async () => {
    if (!selectedBoardType) return; // ✅ 선택하지 않았으면 리턴

    if (selectedBoardType === 'survey') {
      await createSurveyBoard(classId); // ✅ 설문조사 게시판 추가
      fetchSurveyBoards(classId).then(setBoards); // ✅ 새로 추가된 게시판 반영
    }

    setShowBoardModal(false); // ✅ 모달 닫기
    setSelectedBoardType(null); // ✅ 선택 초기화
  };

  const handleSelectBoard = (boardId) => {
    console.log('📌 설문 게시판 선택됨:', boardId);

    // ✅ 강제 리렌더링을 위해 `selectedBoardId`를 null로 초기화 후 다시 설정
    setActiveComponent(null);
    setSelectedBoardId(null);

    setTimeout(() => {
      setSelectedBoardId(boardId);
    }, 0); // 0ms 후 다시 설정 → React가 변경을 감지하도록 유도
  };

  /** ✅ 게시판 선택 시 SurveyList 렌더링 */
  useEffect(() => {
    if (selectedBoardId) {
      console.log('📌 선택한 게시판 ID:', selectedBoardId);
      setActiveComponent(
        <SurveyList
          key={selectedBoardId} // ✅ 강제 리렌더링을 위해 key 추가
          boardId={selectedBoardId}
        />
      );
    } else {
      setActiveComponent(null);
    }
  }, [selectedBoardId]);

  if (!classDetail) {
    return <p>클래스 정보를 불러오는 중...</p>;
  }

  return (
    <div className="classroom-detail-wrapper" style={{ position: 'relative' }}>
      {' '}
      {/* ✅ 모달을 포함하기 위해 relative 추가 */}
      <div className="classroom-detail-container">
        <h2>{classDetail.className}</h2>
        <p>
          <strong>교수자:</strong> {classDetail.professorName}
        </p>
        <p>
          <strong>이메일:</strong> {classDetail.professorEmail}
        </p>
      </div>
      <div className="classroom-layout">
        <div className="classroom-menu">
          {user.role === 'student' ? (
            <button
              className="menu-button"
              onClick={() =>
                setActiveComponent(<AttendancePage classId={classId} />)
              }
            >
              출석하기
            </button>
          ) : (
            <button
              className="menu-button"
              onClick={() =>
                setActiveComponent(<ManageAttendance classId={classId} />)
              }
            >
              출석 관리
            </button>
          )}

          {/* ✅ 게시판 추가 버튼 (모달 열기)
          {user.role === "professor" && (
            <button className="menu-button add-board-btn" onClick={() => setShowBoardModal(true)}>
              + 게시판 추가
            </button>
          )} */}

          {/* ✅ 설문조사 게시판 목록 */}
          {boards.length > 0 ? (
            boards.map((board) => (
              <button
                key={board.boardId}
                className="menu-button"
                onClick={() => handleSelectBoard(board.boardId)} // ✅ 항상 리렌더링
              >
                설문조사
              </button>
            ))
          ) : (
            <p>📌 아직 설문조사 게시판이 없습니다. 생성해 주세요.</p>
          )}
        </div>

        {/* ✅ 오른쪽 컴포넌트 렌더링 */}
        <div className="classroom-content">
          {activeComponent || <p>📌 설문조사 게시판을 선택하세요.</p>}
        </div>
      </div>
      {/* ✅ 게시판 추가 모달 (창처럼 띄우기) */}
      {showBoardModal && (
        <div className="modal-overlay" onClick={() => setShowBoardModal(false)}>
          <div className="modal-window" onClick={(e) => e.stopPropagation()}>
            <h3>게시판 추가</h3>
            <p>추가할 게시판 유형을 선택하세요.</p>

            <div className="modal-buttons">
              <button onClick={() => setSelectedBoardType('survey')}>
                설문조사 게시판
              </button>
              <button disabled>일반 게시판 (준비 중)</button>{' '}
              {/* 나중에 추가 */}
              <button disabled>투표 게시판 (준비 중)</button>{' '}
              {/* 나중에 추가 */}
            </div>

            {selectedBoardType && (
              <div className="modal-footer">
                <p>
                  선택된 게시판 유형:{' '}
                  <strong>
                    {selectedBoardType === 'survey'
                      ? '설문조사 게시판'
                      : selectedBoardType}
                  </strong>
                </p>
                <button onClick={handleCreateBoard}>추가</button>
              </div>
            )}

            <button
              className="modal-close"
              onClick={() => setShowBoardModal(false)}
            >
              취소
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default ClassroomDetail;
