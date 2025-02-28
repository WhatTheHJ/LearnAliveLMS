import { useAuth } from "../context/AuthContext";
import { useNavigate, useParams } from "react-router-dom";

const ClassroomDetail = () => {
  const { user } = useAuth();
  const { classId } = useParams();
  const navigate = useNavigate();

  if (!user) {
    return <p>먼저 로그인이 필요합니다.</p>;
  }

  const handleNavigate = () => {
    if (user.role === "student") {
      navigate(`/classroom/${classId}/attendance`);
    } else if (user.role === "professor") {
      navigate(`/classroom/${classId}/manage-attendance`);
    }
  };

  return (
    <div>
      <h2>강의실 상세</h2>
      <button onClick={handleNavigate}>
        {user.role === "student" ? "출석하기" : "출석 관리"}
      </button>
      <button onClick={() => navigate("/")}>강의실 목록으로 돌아가기</button>
    </div>
  );
};

export default ClassroomDetail;
