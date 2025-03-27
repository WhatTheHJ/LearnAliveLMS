import { useState, useEffect } from "react";
import {
  getTeamActivityPostsByClassId,
  deleteTeamActivityPost,
  toggleTeamActivityLike
} from "../api/teamActivityApi";
import { useAuth } from "../context/AuthContext";
import TeamActivityAddPost from "./TeamActivityAddPost";
import TeamActivityPostDetail from "./TeamActivityPostDetail";
import ApplicationApproval from "./ApplicationApproval";

// 유저별 storage key 생성 헬퍼 함수
const getStorageKey = (baseKey, userId) => `${baseKey}_${userId}`;

const TeamActivity = ({ classId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null); // 게시글 상세보기 상태
  const [selectedApprovalPost, setSelectedApprovalPost] = useState(null); // 신청 승인 관리 상태
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

  useEffect(() => {
    fetchPosts();
  }, [classId]);

  // 게시글 상세 화면에서 뒤로가기 시 업데이트된 게시글 정보를 반영
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

  // 신청 승인 관리 화면에서 뒤로가기
  const handleBackFromApproval = () => {
    setSelectedApprovalPost(null);
  };

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
          if (selectedPost && selectedPost.postId === postId) {
            setSelectedPost(null);
          }
        })
        .catch((error) => {
          console.error("❌ 게시글 삭제 오류:", error);
        });
    }
  };

  // 팀 활동 목록 화면의 좋아요 토글 함수
  const handleLike = async (post) => {
    try {
      const likedPostsKey = getStorageKey("likedPosts", user.userId);
      const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey) || "{}");
      const increment = likedPosts[post.postId] ? -1 : 1;
      const updatedPost = await toggleTeamActivityLike(post.postId, increment);
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.postId === post.postId ? updatedPost : p
        )
      );
      likedPosts[post.postId] = !likedPosts[post.postId];
      localStorage.setItem(likedPostsKey, JSON.stringify(likedPosts));
    } catch (error) {
      console.error("좋아요 처리 오류:", error);
    }
  };

  // 게시글 제목 클릭 시 상세 화면으로 전환
  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  // 아이디당 한 개 게시글 제한: 현재 로그인한 사용자가 이미 게시글을 작성한 경우를 확인
  const hasUserPost = posts.some((post) => post.authorId === user?.userId);

  if (loading) return <p>팀 활동 게시글을 불러오는 중...</p>;

  if (showCreatePost) {
    return (
      <TeamActivityAddPost
        classId={classId}
        onCancel={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
    );
  } else if (selectedApprovalPost) {
    return (
      <ApplicationApproval
        postId={selectedApprovalPost.postId}
        onBack={handleBackFromApproval}
      />
    );
  } else if (selectedPost) {
    return (
      <TeamActivityPostDetail
        post={selectedPost}
        onBack={handleBackFromDetail}
        refreshPosts={fetchPosts}
      />
    );
  } else {
    return (
      <div>
        <h2>팀 활동 게시글</h2>
        <div style={{ marginBottom: "1rem" }}>
          {!hasUserPost && (
            <button onClick={() => setShowCreatePost(true)}>게시글 추가</button>
          )}
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
                <th>액션</th>
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
                  <td>
                    {user?.userId === post.authorId && (
                      <button onClick={() => setSelectedApprovalPost(post)}>
                        신청 현황
                      </button>
                    )}
                    {user?.role === "professor" && (
                      <button
                        onClick={() => handleDelete(post.postId)}
                        style={{ marginLeft: "0.5rem" }}
                      >
                        삭제
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    );
  }
};

export default TeamActivity;