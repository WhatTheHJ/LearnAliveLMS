import { useState, useEffect } from "react";
import { getAllPosts, deletePost } from "../api/postApi"; // 게시글 조회 API
import PostDetail from "./PostDetail";
// import { useParams } from "react-router-dom";
import AddPostPage from "./AddPostPage";
import { useAuth } from "../context/AuthContext";

function PostList({ boardId }) {
  
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [showCreatePost, setShowCreatePost] = useState(false); // 게시글 작성 폼을 보일지 말지에 대한 상태
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기

  // 게시글 목록 불러오는 함수
  const fetchPosts = async () => {
    if (!boardId) return; // boardId가 없으면 실행하지 않음
    try {
      setLoading(true);
      const postsData = await getAllPosts(boardId);
      setPosts(postsData);
    } catch (error) {
      console.error("게시글을 불러오는 데 실패했습니다:", error);
    } finally {
      setLoading(false);
    }
  };

   // 게시글 목록 불러오기 (최초 렌더링 시 실행)
   useEffect(() => {
    fetchPosts();
    console.log("현재 게시글 목록:", posts);
  }, [boardId]);

  // 게시글 추가 후 목록에 반영하기
  const handlePostCreated = async () => {
    await fetchPosts(); // 새로운 게시글을 불러오기
    setShowCreatePost(false); // 게시글 작성 폼 닫기
  };

  // 로딩 중일 때 메시지 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  // 제목 클릭 시 게시글 상세 데이터 가져오기
  const handleTitleClick = (postId) => {
    const foundPost = posts.find((post) => post.postId === postId);
    if (foundPost) {
      setSelectedPost(foundPost); // 선택된 게시글 상태 업데이트
    }
  };

  // 게시글 삭제하기
  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
  
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.postId !== postId)); // 삭제된 게시글을 상태에서 제거
      alert("게시글이 삭제되었습니다.");
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  return (
    <div className="content">
      {showCreatePost ? (
        // 게시글 작성 화면만 보이도록 설정
        <AddPostPage
          boardId={boardId}
          onCancel={() => setShowCreatePost(false)} // 취소 버튼을 누르면 목록으로 돌아가기
          onPostCreated={handlePostCreated} // 게시글 작성 후 상태 갱신
        />
      ) : (
        // 게시글 목록 화면만 보이도록 설정
        <>
          <button
            className="button"
            onClick={() => setShowCreatePost(true)}
          >
            게시글 추가
          </button>
          {selectedPost ? (
            <PostDetail
              postId={selectedPost.postId}
              boardId={boardId}
              onBack={() => setSelectedPost(null)} // 뒤로 가기 버튼 처리
            />
          ) : (
            <div className="post-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    <th>작성일</th>
                    {user?.role === "professor" && (
                      <th>관리</th>
                    )}
                   
                  </tr>
                </thead>
                <tbody>
                  {posts.length > 0 ? (
                    posts
                    .filter((post) => post !== null && post.postId) // 🛠 null 방지 필터 추가
                    .map((post) => (
                      <tr key={post.postId}>
                        <td>{post.postId}</td>
                        <td>
                          <button onClick={() => setSelectedPost(post)}>
                            {post.title}
                          </button>
                        </td>
                        <td>{post.author}</td>
                        <td>{post.view}</td>
                        <td>{post.createdAt}</td>
                        
                          
                        {user?.role === "professor" && (
                        <td> <button onClick={() => handleDelete(post.postId)}>삭제</button></td>
                        )}
                        
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">게시글이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
  
}

export default PostList;