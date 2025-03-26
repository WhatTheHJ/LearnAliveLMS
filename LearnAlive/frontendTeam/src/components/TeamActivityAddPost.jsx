import { useState } from "react";
import { useParams } from "react-router-dom";
import { createTeamActivityPost } from "../api/teamActivityApi";
import { useAuth } from "../context/AuthContext";

const TeamActivityAddPost = ({ onCancel, onPostCreated }) => {
  const { classId } = useParams();
  const { user } = useAuth();
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const newPost = {
        classId: parseInt(classId, 10),
        title,
        content,
        authorId: user?.userId || "",       // AuthProvider에서 제공하는 userId 사용
        authorName: user?.username || "",         // 'name' 필드를 사용하여 작성자 이름 저장
        department: "",                       // 별도 관리하거나 빈 문자열로 설정
        email: "",                            // 별도 관리하거나 빈 문자열로 설정
        contact: "",                          // 별도 관리하거나 빈 문자열로 설정
        likes: 0,
        teamMembers: []                       // 초기값은 빈 배열
      };
      const createdPost = await createTeamActivityPost(newPost);
      onPostCreated(createdPost);
    } catch (error) {
      console.error("❌ 팀 활동 게시글 추가 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div>
      <h2>팀 활동 게시글 작성</h2>
      <form onSubmit={handleSubmit}>
        <div>
          <label>제목:</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>
        <div>
          <label>내용:</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          ></textarea>
        </div>
        <div>
          <button type="submit" disabled={loading}>
            {loading ? "추가 중..." : "추가"}
          </button>
          <button type="button" onClick={onCancel}>
            취소
          </button>
        </div>
      </form>
    </div>
  );
};

export default TeamActivityAddPost;