import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { getAllPosts } from "../api/postApi"; // 게시글 API 호출
import BoardPage from "../pages/BoardPage";

function Post({ boardId }) {
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const [selectedBoardId, setSelectedBoardId] = useState(null);

  // 게시글 목록 불러오기
  useEffect(() => {
    if (!boardId) return; // boardId가 없으면 실행하지 않음
    console.log("boardId:", boardId);

    const fetchPosts = async () => {
      try {
        setLoading(true); // 로딩 시작
        const postsData = await getAllPosts(boardId); // 게시글 목록 가져오기
        setPosts(postsData); // 상태 업데이트
      } catch (error) {
        console.error("게시글을 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false); // 로딩 완료
      }
    };

    fetchPosts();
  }, [boardId]); // boardId가 변경될 때마다 게시글을 다시 불러옵니다.

  // 로딩 중일 때 메시지 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  {selectedBoardId ? (
    <Post boardId={selectedBoardId} />
  ) : (
    <p>게시판을 선택해주세요.</p>
  )}
  

  return (
      <div className="content">
        <h4>게시글 목록</h4><br></br>
        {boardId ? (
          posts.length > 0 ? (
            posts.map((post) => (
              <div key={post.postId} className="post-item">
                <h5 className="post-title">{post.title}</h5>
                <p className="post-author">작성자: {post.author}</p>
              </div>
            ))
          ) : (
            <p>게시글이 없습니다.</p>
          )
        ) : (
          <p>게시판을 선택해주세요.</p>
        )}
      </div>
  );
}

export default Post;
