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

  // 각 업적 조건에 따른 달성한 업적과 달성 조건을 객체로 생성
  const achievementsList = [];

  if (achievement.postCount >= 5) {
    achievementsList.push({
      title: "내가 바로 소통왕!",
      condition: "게시물 5개 이상 작성하기"
    });
  }
  if (achievement.totalLikes >= 10) {
    achievementsList.push({
      title: "이거 나한테 플러팅한거지?",
      condition: "내 게시글의 좋아요 횟수 10회 이상 달성하기"
    });
  }
  if (achievement.totalViews >= 10) {
    achievementsList.push({
      title: "조횟숴~! 영차~!",
      condition: "내 게시글의 조회수 10회 이상 달성하기"
    });
  }
  if (achievementsList.length === 0) {
    achievementsList.push({
      title: "달성한 업적 없음",
      condition: ""
    });
  }

  return (
    <div>
      <h2>내 업적</h2>
      <table border="1" cellPadding="8" style={{ borderCollapse: "collapse" }}>
        <thead>
          <tr>
            <th>달성한 업적</th>
            <th>달성 조건</th>
          </tr>
        </thead>
        <tbody>
          {achievementsList.map((item, idx) => (
            <tr key={idx}>
              <td>
                {item.title !== "달성한 업적 없음" && (
                  <WorkspacePremiumIcon style={{ verticalAlign: "middle", marginRight: "5px" }} />
                )}
                {item.title}
              </td>
              <td>{item.condition}</td>
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