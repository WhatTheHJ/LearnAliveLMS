import { useState, useEffect } from "react";
import { useParams, useNavigate} from "react-router-dom";
import { fetchClassrooms } from "../api/classroomApi";
import { fetchClassDetail } from "../api/classroomApi";
import { fetchBoardsByClassId, createBoard, deleteBoardByBoardId } from "../api/boardsApi";
import { fetchSurveyBoards, createSurveyBoard } from "../api/surveyApi"; // 설문조사 게시판 관련 API
import { fetchExamBoards, createQuizBoard, deleteExamBoard } from "../api/examApi"; //시험 관련 API
import { useAuth } from "../context/AuthContext";
import AttendancePage from "../pages/AttendancePage";
import ManageAttendance from "../pages/ManageAttendancePage";
import Post from "../components/PostList"; // 일반 게시물 목록 컴포넌트
import SurveyList from "../pages/SurveyList"; // 설문조사 게시판 목록 컴포넌트
import DeleteBoardModal from "../components/DeleteBoardModal";
import AddBoardModal from "../components/AddBoardModal";
import ExamList from "./ExamList";
import ExamCreate from "./ExamCreate";
import ExamDetail from "./ExamDetail";
import ExamTake from './ExamTake';
import TeamActivity from "../components/TeamActivity";
import "../styles/ClassroomDetail.css";
import "../styles/post.css";

const ClassroomDetail = () => {
  const { classId } = useParams();
  const { user } = useAuth();
  const userId = user?.userId;
  const navigate = useNavigate();

  // 강의실 정보 및 게시판 목록 상태
  const [classDetail, setClassDetail] = useState(null);
  const [classrooms, setClassrooms] = useState([]);
  const [boards, setBoards] = useState([]); // 일반 게시판 목록
  const [surveyBoards, setSurveyBoards] = useState([]); // 설문조사 게시판 목록

  // 선택된 메뉴 및 게시판 관련 상태
  const [selectedMenu, setSelectedMenu] = useState(null); // "post", "survey", "attendance"
  const [boardId, setBoardId] = useState(null); // 일반 게시판 선택 시 사용
  const [selectedSurveyBoardId, setSelectedSurveyBoardId] = useState(null); // 설문조사 게시판 선택 시 사용
  const [selectedExamId, setSelectedExamId] = useState(null); // 시험 게시판에서 선택된 시험 게시물의 ID 관리
  const [activeComponent, setActiveComponent] = useState(null);
  const [examBoards, setExamBoards] = useState([]); // 퀴즈 게시판 목록

  // 모달 상태
  const [showBoardModal, setShowBoardModal] = useState(false);
  const [showDeleteModal, setShowDeleteModal] = useState(false);

  // 강의실 정보 및 게시판 목록 불러오기
  useEffect(() => {
    fetchClassDetail(classId)
      .then((data) => setClassDetail(data))
      .catch((error) => console.error("❌ 강의실 정보 불러오기 오류:", error));

    fetchBoardsByClassId(classId)
      .then(setBoards)
      .catch((error) => console.error("❌ 일반 게시판 불러오기 오류:", error));

    fetchSurveyBoards(classId)
      .then(setSurveyBoards)
      .catch((error) => console.error("❌ 설문조사 게시판 불러오기 오류:", error));

    fetchExamBoards(classId)
      .then(setExamBoards)
      .catch((error) => console.error("❌ 퀴즈 게시판 불러오기 오류:", error));
  }, [classId]);

  // 일반 게시판 선택 핸들러
  const handleBoardClick = (id) => {
    setBoardId(id);
    setSelectedMenu("post");
  };

  // 설문조사 게시판 선택 핸들러
  const handleSelectSurveyBoard = (id) => {
    setSelectedSurveyBoardId(id);
    setSelectedMenu("survey");
  };

    // ✅ 강의실 목록 가져오기
    useEffect(() => {
      const getClassrooms = async () => {
        if (!userId) return; // userId가 없으면 요청하지 않음
        try {
          const data = await fetchClassrooms(userId); // API 호출
          setClassrooms(data); // 강의실 목록 저장
        } catch (error) {
          console.error("강의실 목록을 불러오는데 실패했습니다.", error);
        }
      };
  
      getClassrooms();
    }, [userId]);

    // ✅ 강의실 선택 시 바로 이동
    const handleClassroomChange = (event) => {
      const selectedClassId = event.target.value;
      if (selectedClassId) {
        navigate(`/classroom/${selectedClassId}/boards`); // 강의실 페이지로 이동
      }
    };

  // 메뉴 선택에 따라 오른쪽 콘텐츠 렌더링
  useEffect(() => {
    if (!selectedMenu) return;
    switch (selectedMenu) {
      case "post":
        setActiveComponent(
          boardId ? <Post boardId={boardId} /> : <p>게시판을 선택해주세요.</p>
        );
        break;
        case "exam":
          setActiveComponent(<ExamList
            classId={classId}
            setSelectedMenu={setSelectedMenu}
            setSelectedExamId={setSelectedExamId}
          />);
        break;

        case "examCreate":
        setActiveComponent(<ExamCreate classId={classId} onBack={() => setSelectedMenu('exam')} />);
        break;
        case "examDetail":
      if (selectedExamId) {
        setActiveComponent(<ExamDetail
          examId={selectedExamId}
          onUpdated={() => fetchExamBoards(classId).then(setExamBoards)}
          onBack={() => setSelectedMenu("exam")}
        />);
      } else {
        console.log("❌ selectedExamId가 아직 null이다.");
      }
      break;
      case "examTake":
    if (selectedExamId) {
      setActiveComponent(
        <ExamTake
          examId={selectedExamId}
          classId={classId}
          onBack={() => setSelectedMenu("exam")}
        />
      );
    } else {
      console.log("❌ selectedExamId가 아직 null이다.");
    }
    break;
      case "survey":
        setActiveComponent(
          selectedSurveyBoardId ? (
            <SurveyList
              boardId={selectedSurveyBoardId}
              classId={classId}
              surveyId={null} // 필요 시 선택된 설문(post) ID를 전달 (현재는 null)
              onBack={() => {
                setSelectedSurveyBoardId(null);
                setSelectedMenu(null);
              }}
            />
          ) : (
            <p>설문조사 게시판을 선택해주세요.</p>
          )
        );
        break;
      case "attendance":
        setActiveComponent(
          user.role === "student" ? (
            <AttendancePage classId={classId} />
          ) : (
            <ManageAttendance classId={classId} />
          )
        );
        break;
        case "teamActivity":
          setActiveComponent(<TeamActivity classId={classId} />);
          break;
        default:
          setActiveComponent(null);
      }
    }, [selectedMenu, classId, boardId, selectedSurveyBoardId, user, selectedExamId]);
  
  if (!classDetail) return <p>클래스 정보를 불러오는 중...</p>;

  return (
    <div className="classroom-detail-wrapper" style={{ position: "relative" }}>
      <div className="classroom-detail-container">
        <h2>{classDetail.className}</h2>
        <p><strong>교수자:</strong> {classDetail.professorName}</p>
        <p><strong>이메일:</strong> {classDetail.professorEmail}</p>
      </div>
      
      <div className="classroom-detail-container">
              {/* 강의실 선택 dropdown */}
              <select onChange={handleClassroomChange} defaultValue="">
          <option value="" disabled> -- 강의실 선택 -- </option>
          {classrooms.map((classroom) => (
            <option key={classroom.classId} value={classroom.classId}>
              {classroom.className} {/* 강의실 이름 표시 */}
            </option>
          ))}
        </select>
      </div>

      <div className="classroom-layout">
        {/* 좌측 메뉴 */}
        <div className="classroom-menu">
          
          {user.role === "student" ? (
            <button
              className="menu-button"
              onClick={() => setSelectedMenu("attendance")}
            >
              출석하기
            </button>
          ) : (
            <button
              className="menu-button"
              onClick={() => setSelectedMenu("attendance")}
            >
              출석 관리
            </button>
          )}

          {/* 일반 게시판 목록 */}
          {boards.map((board) => (
            <button
              key={board.boardId}
              className="menu-button"
              onClick={() => handleBoardClick(board.boardId)}
            >
              {board.boardName}
            </button>
          ))}

          {/* 설문조사 게시판 목록 */}
          {surveyBoards.length > 0 && (
            <button
              className="menu-button"
              onClick={() => handleSelectSurveyBoard(surveyBoards[0].boardId)}
            >
              설문조사
            </button>
          )}

          {/* 퀴즈 게시판 */}
          {examBoards.length > 0 && (
            <button
              className="menu-button"
              onClick={() => setSelectedMenu("exam")}
            >
              퀴즈
            </button>
          )}

          {/* 새로 추가된 팀 활동 게시판 버튼 */}
          <button
            className="menu-button"
            onClick={() => setSelectedMenu("teamActivity")}
          >
            팀 활동
          </button>


          {/* 추가 메뉴: 메인으로 */}
          {/* <Link to="/">
            <button className="menu-button btn btn-danger">메인으로</button>
          </Link> */}

          {/* 교수 계정: 게시판 추가/삭제 모달 버튼 */}
          {user.role === "professor" && (
            <div className="button-group">
              <button
                className="menu-button"
                onClick={() => setShowBoardModal(true)}
              >
                + 게시판 추가
              </button>
              <button
                className="menu-button"
                onClick={() => setShowDeleteModal(true)}
              >
                게시판 삭제
              </button>
            </div>
          )}

          {/* 게시판 추가 모달 */}
          {showBoardModal && (
            <AddBoardModal
              onClose={() => setShowBoardModal(false)}
              onAddBoardModal={async (boardData) => {
                if (boardData.selectedOption === "survey") {
                  if (surveyBoards.length > 0) {
                    alert("설문조사 게시판은 이미 존재합니다.");
                    setShowBoardModal(false);
                    return;
                  }
                  await createSurveyBoard(classId);
                  fetchSurveyBoards(classId)
                    .then(setSurveyBoards)
                    .catch((error) => console.error("❌ 설문조사 게시판 추가 오류:", error));
                } else if (boardData.selectedOption === "quiz") {
                  if (examBoards.length > 0) {
                    alert("퀴즈 게시판은 이미 존재합니다.");
                    setShowBoardModal(false);
                    return;
                  }
                  await createQuizBoard(classId); // 퀴즈 게시판 생성 API 호출
                  fetchExamBoards(classId)
                    .then(setExamBoards) // 퀴즈 목록 갱신
                    .catch((error) => console.error("❌ 퀴즈 게시판 추가 오류:", error));
                } else {
                  // 일반 게시판 추가
                  createBoard({ ...boardData, classId })
                    .then(() => fetchBoardsByClassId(classId))
                    .then(setBoards)
                    .catch((error) =>
                      console.error("❌ 일반 게시판 추가 오류:", error)
                    );
                }
                setShowBoardModal(false);
              }}
            />
          )}

          {/* 게시판 삭제 모달 */}
          {showDeleteModal && (
            <DeleteBoardModal
              onClose={() => setShowDeleteModal(false)}
              onDeleteBoardModal={(deletedBoardId) => {
                if (surveyBoards.find((board) => board.boardId === deletedBoardId)) {
                  deleteBoardByBoardId(deletedBoardId)
                    .then(() => fetchSurveyBoards(classId))
                    .then(setSurveyBoards)
                    .catch((error) =>
                      console.error("❌ 설문조사 게시판 삭제 오류:", error)
                    );
                } else {
                  deleteBoardByBoardId(deletedBoardId)
                    .then(() => fetchBoardsByClassId(classId))
                    .then(setBoards)
                    .catch((error) =>
                      console.error("❌ 일반 게시판 삭제 오류:", error)
                    );
                }
                setShowDeleteModal(false);
              }}
              boards={boards.concat(
                surveyBoards.map((survey) => ({
                  ...survey,
                  boardName: "설문조사"  // label 고정
                }))
              )}
            />
          )}
        </div>

        {/* 우측 콘텐츠 영역 */}
        <div className="classroom-content">
          {activeComponent || <p>메뉴에서 항목을 선택해주세요.</p>}
        </div>
      </div>
    </div>
  );
};

export default ClassroomDetail;
