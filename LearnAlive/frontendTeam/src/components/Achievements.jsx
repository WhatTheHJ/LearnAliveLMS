import { useState, useEffect } from "react";
import { getAchievementByUser } from "../api/achievementApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom";
import WorkspacePremiumIcon from '@mui/icons-material/WorkspacePremium';

const Achievements = () => {
  const { user } = useAuth();
  const [achievement, setAchievement] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (user?.userId) {
      getAchievementByUser(user.userId)
        .then((data) => {
          setAchievement(data);
          setLoading(false);
        })
        .catch((err) => {
          console.error("업적 정보를 가져오는데 실패했습니다:", err);
          setError("업적 정보를 가져오는데 실패했습니다.");
          setLoading(false);
        });
    }
  }, [user]);

  if (loading) return <div>로딩 중...</div>;
  if (error) return <div>{error}</div>;

  // 업적 조건에 따른 메시지 생성
  const achievementMessages = [];
  if (achievement.postCount >= 5)
    achievementMessages.push("게시물 5개 이상 작성 업적 달성!");
  if (achievement.totalLikes >= 10)
    achievementMessages.push("내 게시글의 좋아요 횟수 10회 이상 받기 업적 달성!");
  if (achievement.totalViews >= 10)
    achievementMessages.push("내 게시글이 10회 이상 조회되기 업적 달성!");
  if (achievementMessages.length === 0)
    achievementMessages.push("달성한 업적 없음");

  return (
    <div>
      <h2>내 업적</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>달성한 업적</th>
          </tr>
        </thead>
        <tbody>
          {achievementMessages.map((msg, idx) => (
            <tr key={idx}>
              <td colSpan="2">
                {msg !== "달성한 업적 없음" && (
                  <WorkspacePremiumIcon style={{ verticalAlign: "middle", marginRight: "5px" }} />
                )}
                {msg}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      <br />
      <Link to="/mypage/achievements/detail">
        <button>업적 상세 조회</button>
      </Link>
    </div>
  );
};

export default Achievements;
