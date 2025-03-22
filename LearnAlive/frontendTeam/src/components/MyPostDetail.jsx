import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { getPostById, deletePost } from "../api/postApi";

const MyPostDetail = () => {
  const { postId } = useParams(); // 🔹 URL에서 postId 가져오기
  const navigate = useNavigate(); // 🔹 페이지 이동을 위한 useNavigate
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchPost = async () => {
      try {
        console.log("📌 게시글 상세 요청 - postId:", postId);
        const data = await getPostById(postId);
        console.log("✅ 게시글 상세 응답:", data);
        setPost(data[0]);
      } catch (err) {
        console.error("❌ 게시글 상세 요청 실패:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPost();
  }, [postId]);

  const handleDelete = async () => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return; // 취소 버튼 클릭 시 종료
  
    try {
      console.log(`📌 게시물 삭제 요청 - postId: ${postId}`);
      await deletePost(postId); // 🔹 게시물 삭제 API 호출
      console.log("✅ 게시물 삭제 성공");
      navigate(-1); // 🔹 삭제 후 이전 페이지로 이동
    } catch (err) {
      console.error("❌ 게시물 삭제 실패:", err);
      setError("게시물 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>게시글 불러오는 중...</p>;
  if (error) return <p>{error}</p>;
  if (!post) return <p>게시글을 찾을 수 없습니다.</p>;

  return (
    <div className="post-container">
      {/* post가 존재하는지 체크 */}
      <div className="post-card">
        <h2 className="post-title">{post.title}</h2>
        <div className="post-meta">
          <p><strong>작성자:</strong> {post.author}</p>
          <p><strong>작성자 ID:</strong> {post.authorId}</p>
          <p><strong>작성일:</strong> {new Date(post.createdAt).toLocaleString()}</p>
          <p><strong>조회수:</strong> {post.view}</p>
        </div>
        <hr />
        <p className="post-content">{post.content || "내용 없음"}</p>
        {/* 🔹 버튼들 배치 */}
        <div style={{ display: "flex", justifyContent: "flex-start", gap: "10px", marginTop: "20px" }}>
          <button onClick={() => navigate(-1)} className="back-button">뒤로가기</button> {/* 뒤로가기 버튼 */}
          
          {/* 삭제 버튼 */}
          <button onClick={handleDelete}> 삭제 </button>
        </div>
      </div>
    </div>
  );
};

export default MyPostDetail;