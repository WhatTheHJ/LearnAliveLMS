import {
  BrowserRouter as Router,
  Routes,
  Route,
  useLocation,
} from 'react-router-dom';
import { useEffect } from 'react';
import { AuthProvider } from './context/AuthContext'; // ✅ import 확인!
import Header from './components/Header';
import Footer from './components/Footer';
import ClassroomList from './components/ClassroomList';
// import ClassroomDetail from "./pages/ClassroomDetail";
import AttendancePage from './pages/AttendancePage';
import ManageAttendancePage from './pages/ManageAttendancePage';
import ClassSettings from './pages/ClassSettings';
import SurveyList from './pages/SurveyList';
import SurveyCreate from './components/SurveyCreate';
import SurveyDetail from './components/SurveyDetail';
import BoardPage from './pages/BoardPage';
import AddPostPage from './components/AddPostPage';
import ExamList from './pages/ExamList';
import ExamCreate from './pages/ExamCreate';
import ExamDetail from './pages/ExamDetail';
import ExamTake from './pages/ExamTake';
import ExamResult from './pages/ExamResult';

function TitleUpdater() {
  const location = useLocation(); // 현재 경로 감지

  useEffect(() => {
    switch (location.pathname) {
      case '/':
        document.title = '[고려대학교] 출결관리 시스템';
        break;
      case '/classroom/:classId':
        document.title = '[고려대학교] 강의실 상세보기';
        break;
      case '/classroom/:classId/attendance':
        document.title = '[고려대학교] 출석하기';
        break;
      case '/classroom/:classId/manage-attendance':
        document.title = '[고려대학교] 출결 관리 페이지';
        break;
      case '/classroom/:classId/settings':
        document.title = '[고려대학교] 강의실 설정';
        break;
      default:
        document.title = '[고려대학교] 출결관리 시스템';
    }
  }, [location]); // location 변경될 때마다 실행

  return null; // 아무것도 렌더링하지 않음
}

function App() {
  return (
    <AuthProvider>
      {' '}
      {/* ✅ 여기서 Provider 감싸기 */}
      <Router>
        <TitleUpdater />
        <Header />
        <main>
          <Routes>
            <Route path="/" element={<ClassroomList />} />
            {/* <Route path="/classroom/:classId" element={<ClassroomDetail />} /> */}
            <Route
              path="/classroom/:classId/attendance"
              element={<AttendancePage />}
            />
            <Route
              path="/classroom/:classId/manage-attendance"
              element={<ManageAttendancePage />}
            />
            {/* <Route path="/classroom/:classId/surveys" element={<SurveyList />} /> */}
            <Route path="/survey/create" element={<SurveyCreate />} />
            <Route path="/survey/:surveyId" element={<SurveyDetail />} />
            <Route path="/classroom/:classId/boards" element={<BoardPage />} />
            <Route
              path="/classroom/:classId/boards/addpost/:boardId"
              element={<AddPostPage />}
            />{' '}
            {/* 게시글 추가 페이지 */}
            <Route
              path="/classroom/:classId/surveys"
              element={<SurveyList />}
            />
            <Route
              path="/classroom/:classId/settings"
              element={<ClassSettings />}
            />
            <Route path="/classroom/:classId/exam" element={<ExamList />} />
            <Route
              path="/classroom/:classId/exam/add"
              element={<ExamCreate />}
            />
            <Route path="exam/:examId" element={<ExamDetail />} />
            <Route path="exam_take/:classId/:examId" element={<ExamTake />} />
            <Route
              path="exam_result/:classId/:examId"
              element={<ExamResult />}
            />
          </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;
