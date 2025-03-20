import { BrowserRouter as Router, Routes, Route, useLocation  } from "react-router-dom";
import { useEffect } from "react";
import { AuthProvider } from "./context/AuthContext";  // ✅ import 확인!
import Header from "./components/Header";
import Footer from "./components/Footer";
import ClassroomList from "./components/ClassroomList";
import Dashboard from "./components/Dashboard";
import AttendancePage from "./pages/AttendancePage";
import ManageAttendancePage from "./pages/ManageAttendancePage";
import ClassSettings from "./pages/ClassSettings"; 
import SurveyList from "./pages/SurveyList";
import SurveyCreate from "./components/SurveyCreate";
import SurveyDetail from "./components/SurveyDetail";
import BoardPage from "./pages/BoardPage";
import AddPostPage from "./components/AddPostPage";
import MyPage from "./pages/MyPage";
import MyProfile from "./components/MyProfile";
import ProfessorStatus from "./pages/ProfessorStatus";
import MyPost from "./components/MyPost";
import ClassroomDetail from "./pages/ClassroomDetail";
import MyPostDetail from "./components/MyPostDetail";
import MyAttendance from "./components/MyAttendance";
import Exam from "./components/Exam";
import MyGrades from "./components/MyGrades"
import MyClasses from "./components/MyClasses";

function TitleUpdater() {
  const location = useLocation(); // 현재 경로 감지

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
  const studentId = 1; // 예제용, 실제 로그인 정보에서 가져와야 함
  return (
    <AuthProvider> {/* ✅ 여기서 Provider 감싸기 */}
      <Router>
        <TitleUpdater />
        <Header />
        <main>
        <Routes>
          <Route path="/" element={<ClassroomList />} />
          {/* <Route path="/classroom/:classId/attendance" element={<AttendancePage />} /> */}
          <Route path="/classroom/:classId/manage-attendance" element={<ManageAttendancePage />} />

          <Route path="/classroom/:classId/surveys" element={<SurveyList />} />
          <Route path="/survey/create" element={<SurveyCreate />} />
          <Route path="/survey/:surveyId" element={<SurveyDetail />} />

          {/* <Route path="/classroom/:classId/boards" element={<BoardPage />} /> */}
          <Route path="/classroom/:classId/boards" element={<ClassroomDetail />} />
          <Route path="/classroom/:classId/boards/addpost/:boardId" element={<AddPostPage />} /> {/* 게시글 추가 페이지 */}

          <Route path="/classroom/:classId/settings" element={<ClassSettings />} />
          <Route path="/admin/professors" element={<ProfessorStatus />} />

          <Route path="/mypage" element={<MyPage />}>
            <Route path="/mypage/myprofile" element={<MyProfile />} />
            <Route path="/mypage/mypost" element={<MyPost />} />
            <Route path="/mypage/post/:postId" element={<MyPostDetail />} /> {/* 🔹 상세 페이지 추가 */}
            <Route path="/mypage/myattendance" element={<MyAttendance />} />
            <Route path="/mypage/myclasses" element={<MyClasses />} />
            <Route path="/mypage/mygrades" element={<MyGrades />} />
          </Route>
          <Route path="/exam/:classId" element={<Exam />} />
        </Routes>
        </main>
        <Footer />
      </Router>
    </AuthProvider>
  );
}

export default App;







// import { BrowserRouter as Router, Routes, Route, useLocation } from "react-router-dom";
// import { useEffect } from "react";
// import { AuthProvider } from "./context/AuthContext";
// import Header from "./components/Header";
// import Footer from "./components/Footer";
// import Dashboard from "./components/Dashboard";
// import AttendancePage from "./pages/AttendancePage";
// import ManageAttendancePage from "./pages/ManageAttendancePage";
// import ClassSettings from "./pages/ClassSettings";
// import SurveyList from "./pages/SurveyList";
// import SurveyCreate from "./components/SurveyCreate";
// import SurveyDetail from "./components/SurveyDetail";
// import BoardPage from "./pages/BoardPage";
// import AddPostPage from "./components/AddPostPage";
// import ProfessorStatus from "./pages/ProfessorStatus";
// import ManageNotice from "./pages/ManageNotice";
// import NoticeDetail from "./pages/NoticeDetail";  // :흰색_확인_표시: 공지사항 상세 페이지 추가
// import MyPage from "./pages/MyPage";
// import MyProfile from "./components/MyProfile";
// import MyPost from "./components/MyPost";
// import MyPostDetail from "./components/MyPostDetail";
// import MyAttendance from "./components/MyAttendance";
// function TitleUpdater() {
//   const location = useLocation();
//   useEffect(() => {
//     switch (location.pathname) {
//       case "/":
//         document.title = "[고려대학교] 출결관리 시스템";
//         break;
//       case "/classroom/:classId":
//         document.title = "[고려대학교] 강의실 상세보기";
//         break;
//       case "/classroom/:classId/attendance":
//         document.title = "[고려대학교] 출석하기";
//         break;
//       case "/classroom/:classId/manage-attendance":
//         document.title = "[고려대학교] 출결 관리 페이지";
//         break;
//       case "/classroom/:classId/settings":
//         document.title = "[고려대학교] 강의실 설정";
//         break;
//       case "/survey/create":
//         document.title = "[고려대학교] 설문 생성";
//         break;
//       case "/survey/:surveyId":
//         document.title = "[고려대학교] 설문 상세 보기";
//         break;
//       case "/classroom/:classId/boards":
//         document.title = "[고려대학교] 게시판";
//         break;
//       case "/admin/professors":
//         document.title = "[고려대학교] 교수 관리";
//         break;
//       case "/notice/manage":
//         document.title = "[고려대학교] 공지사항 관리";
//         break;
//         case location.pathname.startsWith("/notice/"):  // /notice/:noticeId 패턴에 맞는 경로
//         document.title = "[고려대학교] 공지사항 상세 보기";
//         break;
//       case "/mypage":
//         document.title = "[고려대학교] 마이페이지";
//         break;
//       case "/mypage/myprofile":
//         document.title = "[고려대학교] 회원 정보";
//         break;
//       default:
//         document.title = "[고려대학교] 출결관리 시스템";
//     }
//   }, [location]);
//   return null;
// }
// function App() {
//   return (
//     <AuthProvider>
//       <Router>
//         <TitleUpdater />
//         <Header />
//         <main className="main-container">
//           <div className="content-container">
//             <Routes>
//               <Route path="/" element={<Dashboard />} />
//               <Route path="/classroom/:classId/attendance" element={<AttendancePage />} />
//               <Route path="/classroom/:classId/manage-attendance" element={<ManageAttendancePage />} />
//               <Route path="/classroom/:classId/surveys" element={<SurveyList />} />
//               <Route path="/survey/create" element={<SurveyCreate />} />
//               <Route path="/survey/:surveyId" element={<SurveyDetail />} />
//               <Route path="/classroom/:classId/boards" element={<BoardPage />} />
//               <Route path="/classroom/:classId/boards/addpost/:boardId" element={<AddPostPage />} />
//               <Route path="/classroom/:classId/settings" element={<ClassSettings />} />
//               <Route path="/admin/professors" element={<ProfessorStatus />} />
//               <Route path="/notice/manage" element={<ManageNotice />} />
//               <Route path="/notice/:notice_id" element={<NoticeDetail />} />  {/* 공지사항 상세 페이지 경로 추가 */}
//               <Route path="/mypage" element={<MyPage />}>
//                 <Route path="/mypage/myprofile" element={<MyProfile />} />
//                 <Route path="/mypage/mypost" element={<MyPost />} />
//                 <Route path="/mypage/post/:postId" element={<MyPostDetail />} /> {/* :작은_파란색_다이아몬드: 상세 페이지 추가 */}
//                 <Route path="/mypage/myattendance" element={<MyAttendance />} />
//               </Route>
//             </Routes>
//           </div>
//         </main>
//         <Footer />
//       </Router>
//     </AuthProvider>
//   );
// }
// export default App;