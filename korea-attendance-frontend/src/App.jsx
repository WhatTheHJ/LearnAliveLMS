import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";  // ✅ import 확인!
import Header from "./components/Header";
import ClassroomList from "./components/ClassroomList";
import ClassroomDetail from "./pages/ClassroomDetail";
import AttendancePage from "./pages/AttendancePage";
import ManageAttendancePage from "./pages/ManageAttendancePage";

function App() {
  return (
    <AuthProvider> {/* ✅ 여기서 Provider 감싸기 */}
      <Router>
        <Header />
        <Routes>
          <Route path="/" element={<ClassroomList />} />
          <Route path="/classroom/:classId" element={<ClassroomDetail />} />
          <Route path="/classroom/:classId/attendance" element={<AttendancePage />} />
          <Route path="/classroom/:classId/manage-attendance" element={<ManageAttendancePage />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
