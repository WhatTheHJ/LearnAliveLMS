import { useState, useEffect } from "react";
import { getTeamActivityPostsByClassId, deleteTeamActivityPost } from "../api/teamActivityApi";
import { useAuth } from "../context/AuthContext";
import TeamActivityAddPost from "./TeamActivityAddPost";
import TeamActivityPostDetail from "./TeamActivityPostDetail";

const TeamActivity = ({ classId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // 선택한 게시글 (상세보기)
  const { user } = useAuth();

  const fetchPosts = () => {
    setLoading(true);
    getTeamActivityPostsByClassId(classId)
      .then((data) => {
        // 최신순 정렬 (최신 게시글이 위쪽에 오도록)
        const sortedPosts = data.sort(
          (a, b) => new Date(b.createdAt) - new Date(a.createdAt)
        );
        setPosts(sortedPosts);
        setLoading(false);
      })
      .catch((error) => {
        console.error("❌ 팀 활동 게시글 불러오기 오류:", error);
        setLoading(false);
      });
  };

  // 상세 화면에서 뒤로가기 시 업데이트된 게시글 정보를 반영
  const handleBackFromDetail = (updatedPost) => {
    if (updatedPost) {
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === updatedPost.postId ? updatedPost : post
        )
      );
    }
    setSelectedPost(null);
  };

  useEffect(() => {
    fetchPosts();
  }, [classId]);

  // 새 게시글 생성 후 콜백
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setShowCreatePost(false);
  };

  const handleDelete = (postId) => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      deleteTeamActivityPost(postId)
        .then(() => {
          fetchPosts();
          // 상세 화면에서 삭제된 경우 목록으로 복귀
          if (selectedPost && selectedPost.postId === postId) {
            setSelectedPost(null);
          }
        })
        .catch((error) => {
          console.error("❌ 게시글 삭제 오류:", error);
        });
    }
  };

  // 게시글 제목 클릭 시 상세 화면으로 전환 (URL 이동 없이 상태 전환)
  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  if (loading) return <p>팀 활동 게시글을 불러오는 중...</p>;

  return (
    <div>
      <h2>팀 활동 게시글</h2>
      {showCreatePost ? (
        <TeamActivityAddPost
          classId={classId}
          onCancel={() => setShowCreatePost(false)}
          onPostCreated={handlePostCreated}
        />
      ) : selectedPost ? (
        // 상세 페이지 렌더링 (목록은 그대로 유지)
        <TeamActivityPostDetail
          post={selectedPost}
          onBack={handleBackFromDetail}
          refreshPosts={fetchPosts}
        />
      ) : (
        <>
          <div style={{ marginBottom: "1rem" }}>
            <button onClick={() => setShowCreatePost(true)}>게시글 추가</button>
          </div>
          {posts.length === 0 ? (
            <p>등록된 팀 활동 게시글이 없습니다.</p>
          ) : (
            <table>
              <thead>
                <tr>
                  <th>제목</th>
                  <th>작성자</th>
                  <th>좋아요</th>
                  <th>작성일자</th>
                  {user?.role === "professor" && <th>액션</th>}
                </tr>
              </thead>
              <tbody>
                {posts.map((post) => (
                  <tr key={post.postId}>
                    <td
                      onClick={() => handleSelectPost(post)}
                      style={{ cursor: "pointer" }}
                    >
                      {post.title}
                    </td>
                    <td>{post.authorName}</td>
                    <td>{post.likes}</td>
                    <td>{new Date(post.createdAt).toLocaleString()}</td>
                    {user?.role === "professor" && (
                      <td>
                        <button onClick={() => handleDelete(post.postId)}>
                          삭제
                        </button>
                      </td>
                    )}
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
    </div>
  );
};

export default TeamActivity;
