import { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import { getPostById } from "../api/postApi"; // 게시글 조회 API

function PostDetail({ postId, boardId, onBack }) {
  const [post, setPost] = useState(null);

  useEffect(() => {
    async function fetchPost() {
      try {
        // postId를 확인하고 콘솔에 출력
        console.log("Fetching post with ID:", postId);
        
        const fetchedPosts = await getPostById(postId); // 게시글 가져오기
        console.log("선택된 게시글 :", fetchedPosts);

        if (fetchedPosts && fetchedPosts.length > 0) {
            setPost(fetchedPosts[0]); // 첫 번째 게시글만 설정
          } else {
            alert("게시글을 찾을 수 없습니다.");
          }
      } catch (error) {
        console.error("게시글 조회 실패:", error);
        alert("게시글을 불러오는 데 실패했습니다.");
      }
    }

    // postId가 있을 때만 실행
    if (postId) {
      fetchPost(); 
    }
  }, [postId]); // postId가 변경될 때마다 게시글을 새로 가져옴

  // post 상태가 변경되었을 때 상태 확인
  useEffect(() => {
    console.log("post 상태:", post);
  }, [post]);

  // post가 없으면 로딩 메시지 표시
  if (!post) {
    return <div>Loading...</div>;
  }

  return (
    <div className="post-container">
      {/* post가 존재하는지 체크 */}
      {post ? (
        <div className="post-card">
        <h2 className="post-title">{post.title || "제목 없음"}</h2>
        <div className="post-meta">
          <p><strong>작성자:</strong> {post.author || "작성자 정보 없음"}</p>
          <p><strong>작성자 ID:</strong> {post.authorId || "ID 없음"}</p>
          <p><strong>작성일:</strong> {new Date(post.createdAt).toLocaleString() || "날짜 없음"}</p>
          <p><strong>조회수:</strong> {post.view || 0}</p>
        </div>
        <hr />
        <p className="post-content">{post.content || "내용 없음"}</p>
        <button className="back-button" onClick={onBack}>뒤로 가기</button>
      </div>
      ) : (
        <div className="error-message">게시글을 불러오는 데 실패했습니다.</div>
      )}
    </div>
  );
}

export default PostDetail;