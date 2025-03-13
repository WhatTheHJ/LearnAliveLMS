import { useEffect } from "react";

function PostDetail({ post, onBack }) {
  // 배열이 들어온다면 첫 번째 요소를 사용
  const currentPost = post && post.length > 0 ? post[0] : null;

  useEffect(() => {
    console.log("selectedPost 상태가 변경되었습니다:", currentPost);
  }, [currentPost]);

  if (!currentPost) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-container">
      <div className="post-card">
        <h2 className="post-title">{currentPost.title || "제목 없음"}</h2>
        <div className="post-meta">
          <p><strong>작성자:</strong> {currentPost.author || "작성자 정보 없음"}</p>
          <p><strong>작성자 ID:</strong> {currentPost.authorId || "ID 없음"}</p>
          <p><strong>작성일:</strong> {new Date(currentPost.createdAt).toLocaleString() || "날짜 없음"}</p>
          <p><strong>조회수:</strong> {currentPost.view || 0}</p>
        </div>
        <hr />
        <p className="post-content">{currentPost.content || "내용 없음"}</p>
        <button className="back-button" onClick={onBack}>뒤로 가기</button>
      </div>
    </div>
  );
}

export default PostDetail;
