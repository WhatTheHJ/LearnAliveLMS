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

// 1) 추가 import
import TeamClassMilestoneSetup from "./TeamClassMilestoneSetup";  // 교수용 마일스톤 설정
import TeamProjectMilestoneView from "./TeamProjectMilestoneView"; // 학생(조장)용 마일스톤 조회

// 유저별 storage key 생성 헬퍼 함수
const getStorageKey = (baseKey, userId) => `${baseKey}_${userId}`;

const TeamActivity = ({ classId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showCreatePost, setShowCreatePost] = useState(false);
  const [selectedPost, setSelectedPost] = useState(null);        // 게시글 상세보기
  const [selectedApprovalPost, setSelectedApprovalPost] = useState(null); // 신청 승인 관리

  const { user } = useAuth();

  // 2) 추가 상태: 마일스톤 화면 전환 (교수 설정 or 학생 조회)
  const [milestonePost, setMilestonePost] = useState(null); // "팀활동현황(설정/조회)" 버튼 눌렀을 때 선택된 게시글
  const [professorMode, setProfessorMode] = useState(false); // true = 교수 설정 화면, false = 학생 조회 화면

  // 게시글 목록 불러오기
  const fetchPosts = () => {
    setLoading(true);
    getTeamActivityPostsByClassId(classId)
      .then((data) => {
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

  // 상세보기 뒤로가기
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

  // 신청 승인 관리 뒤로가기
  const handleBackFromApproval = () => {
    setSelectedApprovalPost(null);
  };

  // 새 게시글 작성 후 콜백
  const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [newPost, ...prevPosts]);
    setShowCreatePost(false);
  };

  // 게시글 삭제
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

  // 좋아요 토글
  const handleLike = async (post) => {
    try {
      const likedPostsKey = getStorageKey("likedPosts", user.userId);
      const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey) || "{}");
      const increment = likedPosts[post.postId] ? -1 : 1;
      const updatedPost = await toggleTeamActivityLike(post.postId, increment);
      setPosts((prevPosts) =>
        prevPosts.map((p) => (p.postId === post.postId ? updatedPost : p))
      );
      likedPosts[post.postId] = !likedPosts[post.postId];
      localStorage.setItem(likedPostsKey, JSON.stringify(likedPosts));
    } catch (error) {
      console.error("좋아요 처리 오류:", error);
    }
  };

  // 게시글 제목 클릭 → 상세보기
  const handleSelectPost = (post) => {
    setSelectedPost(post);
  };

  // 3) “팀활동현황 설정” 버튼 클릭 (교수)
  const handleMilestoneSetupClick = (post) => {
    setMilestonePost(post);     // 선택된 게시글
    setProfessorMode(true);     // 교수 모드
  };

  // 4) “팀활동현황” 버튼 클릭 (학생)
  const handleMilestoneViewClick = (post) => {
    setMilestonePost(post);     // 선택된 게시글
    setProfessorMode(false);    // 학생 모드
  };

  // 5) 마일스톤 화면에서 뒤로가기
  const handleBackFromMilestone = () => {
    setMilestonePost(null);
    setProfessorMode(false);
  };

  // 아이디당 한 개 게시글 제한 (작성 여부)
  const hasUserPost = posts.some((post) => post.authorId === user?.userId);

  // ─────────────────────────────────────────────────────────────────
  // 화면 전환 우선순위
  if (loading) return <p>팀 활동 게시글을 불러오는 중...</p>;

  // (1) 새 게시글 작성
  if (showCreatePost) {
    return (
      <TeamActivityAddPost
        classId={classId}
        onCancel={() => setShowCreatePost(false)}
        onPostCreated={handlePostCreated}
      />
    );
  }

  // (2) 신청 승인 관리
  if (selectedApprovalPost) {
    return (
      <ApplicationApproval
        postId={selectedApprovalPost.postId}
        onBack={handleBackFromApproval}
      />
    );
  }



// (3) 마일스톤 화면
if (professorMode && user?.role === "professor") {
  return (
    <TeamClassMilestoneSetup
      classId={classId}
      onBack={handleBackFromMilestone}
      onSetupComplete={handleBackFromMilestone}
    />
  );
}

// 나머지 학생 모드 (milestonePost != null) 시:
if (milestonePost) {
  return (
    <TeamProjectMilestoneView
      classId={classId}
      postId={milestonePost.postId}
      post={milestonePost}
      onBack={handleBackFromMilestone}
    />
  );
}


  // (4) 게시글 상세보기
  if (selectedPost) {
    return (
      <TeamActivityPostDetail
        post={selectedPost}
        onBack={handleBackFromDetail}
        refreshPosts={fetchPosts}
      />
    );
  }

  // (5) 기본 목록 화면
  return (
    <div className="post-container">
      <h2>팀 활동 게시글</h2>
      <div style={{ marginBottom: "1rem" }}>
        {!hasUserPost && (
          <button onClick={() => setShowCreatePost(true)}>게시글 추가</button>
        )}



{/* 교수 전용: "팀활동현황설정" 버튼 */}
     {user?.role === "professor" && (
       <button
         style={{ marginLeft: "0.5rem" }}
         onClick={() => {
           // 화면 전환 로직:
           // milestonePost 없이, professorMode = true 상태로 마일스톤 설정 화면
           setProfessorMode(true);
           setMilestonePost(null); // 필요 시
         }}
       >
         팀활동현황설정
       </button>
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
                  {/* 게시글 작성자: 신청 현황 */}
                  {user?.userId === post.authorId && (
                    <button onClick={() => setSelectedApprovalPost(post)}>
                      신청 현황
                    </button>
                  )}


{/* 모든 계정: "팀활동현황" (조회) */}
 <button
   onClick={() => handleMilestoneViewClick(post)}
   style={{ marginLeft: "0.5rem" }}
 >
   팀활동현황
 </button>


                  {/* 게시글 삭제: 교수 전용 */}
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
};

export default TeamActivity;
