import { BrowserRouter as Router, Routes, Route, useLocation  } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";  // ✅ import 확인!
import Header from "./components/Header";
import Footer from "./components/Footer";
import ClassroomList from "./components/ClassroomList";
// import ClassroomDetail from "./pages/ClassroomDetail";
// import AttendancePage from "./pages/AttendancePage";
import ManageAttendancePage from "./pages/ManageAttendancePage";
import ClassSettings from "./pages/ClassSettings"; 
// import SurveyList from "./pages/SurveyList";
import SurveyCreate from "./components/SurveyCreate";
import SurveyDetail from "./components/SurveyDetail";
// import BoardPage from "./pages/BoardPage";
import AddPostPage from "./components/AddPostPage";
import ClassroomDetail from "./pages/ClassroomDetail";
// import PostDetailPage from "./components/PostDetail";


function TitleUpdater() {
  const location = useLocation(); // 현재 경로 감지

  // [고려대학교]글자만 뺌
  useEffect(() => {
    switch (location.pathname) {
      case "/":
        document.title = "출결관리 시스템";
        break;
      case "/classroom/:classId":
        document.title = "강의실 상세보기";
        break;
      case "/classroom/:classId/attendance":
        document.title = "출석하기";
        break;
      case "/classroom/:classId/manage-attendance":
        document.title = "출결 관리 페이지";
        break;
      case "/classroom/:classId/settings":
        document.title = "강의실 설정";
        break;
      default:
        document.title = "출결관리 시스템";
    }
  }, [location]); // location 변경될 때마다 실행
  return null; // 아무것도 렌더링하지 않음
}
  
function App() {
  return (
    <AuthProvider> {/* ✅ 여기서 Provider 감싸기 */}
      <Router>
        <TitleUpdater />
        <Header />
        <main>
        <Routes>
          <Route path="/" element={<ClassroomList />} />
          {/* <Route path="/classroom/:classId" element={<ClassroomDetail />} /> */}
          {/* <Route path="/classroom/:classId/attendance" element={<AttendancePage />} /> */}
          <Route path="/classroom/:classId/manage-attendance" element={<ManageAttendancePage />} />
          
          <Route path="/survey/create" element={<SurveyCreate />} />
          <Route path="/survey/:surveyId" element={<SurveyDetail />} />

          <Route path="/classroom/:classId/boards" element={<ClassroomDetail />} /> 
          <Route path="/classroom/:classId/boards/addpost/:boardId" element={<AddPostPage />} /> {/* 게시글 추가 페이지 */}
          {/* <Route path="/posts/:postId" element={<PostDetailPage />} /> ✅ 게시글 상세 페이지 추가 */}

          <Route path="/classroom/:classId/settings" element={<ClassSettings />} />
        </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;