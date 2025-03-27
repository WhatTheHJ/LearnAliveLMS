import { useState, useEffect } from "react";
import { getAchievementByUser } from "../api/achievementApi";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const AchievementsDetail = () => {
  const { user } = useAuth();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (user?.userId) {
      getAchievementByUser(user.userId)
        .then((data) => {
          setAchievement(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("업적 상세 정보를 가져오는데 실패했습니다:", err);
          setError("업적 상세 정보를 가져오는데 실패했습니다.");
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div>
      <h2>업적 상세 조회</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>항목</th>
            <th>수치</th>
          </tr>
        </thead>
        <tbody>
          <tr>
            <td>작성한 게시물 수</td>
            <td>{achievement.postCount}</td>
          </tr>
          <tr>
            <td>게시물 좋아요 총 갯수</td>
            <td>{achievement.totalLikes}</td>
          </tr>
          <tr>
            <td>게시물 총 조회수</td>
            <td>{achievement.totalViews}</td>
          </tr>
        </tbody>
      </table>
      <br />
      <button onClick={() => navigate(-1)}>뒤로가기</button>
    </div>
  );
};

export default AchievementsDetail;