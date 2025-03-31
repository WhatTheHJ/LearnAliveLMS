import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  // ✅ import 확인!
import Header from "./components/Header";
import Footer from "./components/Footer";
import Dashboard from "./components/Dashboard";
import AdminUniversityDepartmentManagement from "./components/AdminUniversityDepartmentManagement";

import ManageAttendancePage from "./pages/ManageAttendancePage";
import ClassSettings from "./pages/ClassSettings"; 
import SurveyCreate from "./components/SurveyCreate";
import SurveyDetail from "./components/SurveyDetail";
import AddPostPage from "./components/AddPostPage";
import ClassroomDetail from "./pages/ClassroomDetail";
import PreRegistrationPage from "./pages/PreRegistrationPage";

import ProfessorStatus from "./pages/ProfessorStatus";  
import ManageNotice from "./pages/ManageNotice";  
import NoticeDetail from "./pages/NoticeDetail";  // 공지사항 상세 페이지
import RegisterStudent from "./components/RegisterStudent";

import ExamList from './pages/ExamList';
import ExamCreate from './pages/ExamCreate';
import ExamDetail from './pages/ExamDetail';

import MyPage from "./pages/MyPage";
import MyProfile from "./components/MyProfile";
import MyPost from "./components/MyPost";
import MyPostDetail from "./components/MyPostDetail";
import MyAttendance from "./components/MyAttendance";
import MyGrades from "./components/MyGrades"
import MyClasses from "./components/MyClasses";
import Achievements from "./components/Achievements";
import AchievementsDetail from "./components/AchievementsDetail";

import CalendarPage from "./pages/CalendarPage";
//--------------웹소켓시도
import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { NotificationProvider } from "./context/NotificationContext";
  
function App() {
  return (
    <AuthProvider> {/* ✅ 여기서 Provider 감싸기 */}
    <NotificationProvider>
      <Router>
        <Header />
        <ToastContainer />
        {/* {user?.classId && <NotificationListener classId={classId} />} */}

        <main style={{ minHeight: '80vh' }}>
        <Routes>
          <Route path="/pre-registration" element={<PreRegistrationPage />} />

          <Route path="/" element={<Dashboard />} />
          <Route path="/admin/university" element={<AdminUniversityDepartmentManagement />} />
          <Route path="/register" element={<RegisterStudent />} />
          <Route path="/admin/professors" element={<ProfessorStatus />} />
          <Route path="/notice/manage" element={<ManageNotice />} />
          <Route path="/notice/:notice_id" element={<NoticeDetail />} />

          <Route path="/classroom/:classId/manage-attendance" element={<ManageAttendancePage />} />
          <Route path="/survey/create" element={<SurveyCreate />} />
          <Route path="/survey/:surveyId" element={<SurveyDetail />} />
          <Route path="/classroom/:classId/boards" element={<ClassroomDetail />} /> 
          <Route path="/classroom/:classId/settings" element={<ClassSettings />} />

          <Route path="/classroom/:classId/boards/addpost/:boardId" element={<AddPostPage />} /> {/* 게시글 추가 페이지 */}

          <Route path="/Calendar" element={<CalendarPage />} />

          <Route path="/classroom/:classId/exam" element={<ExamList />} />
          <Route
            path="/classroom/:classId/exam/add"
             element={<ExamCreate />}
          />
          <Route path="exam/:examId" element={<ExamDetail />} />

          <Route path="/mypage" element={<MyPage />}>
            <Route path="/mypage/myprofile" element={<MyProfile />} />
            <Route path="/mypage/mypost" element={<MyPost />} />
            <Route path="/mypage/post/:postId" element={<MyPostDetail />} /> {/* 🔹 상세 페이지 추가 */}
            <Route path="/mypage/myattendance" element={<MyAttendance />} />
            <Route path="/mypage/myclasses" element={<MyClasses />} />
            <Route path="/mypage/mygrades" element={<MyGrades />} />
            <Route path="/mypage/achievements" element={<Achievements />} />
            <Route path="/mypage/achievements/detail" element={<AchievementsDetail />} />
          </Route>
        </Routes>
        </main>
        <Footer />
      </Router>
      </NotificationProvider>
    </AuthProvider>
  );
}

export default App;