import { useState, useEffect } from "react";
import { 
  getTeamActivityPost, 
  deleteTeamActivityPost, 
  addTeamActivityComment, 
  getTeamActivityComments,
  attendTeamActivityPost,
  toggleTeamActivityLike
} from "../api/teamActivityApi";
import { useAuth } from "../context/AuthContext";

// 유저별로 storage key를 생성하는 헬퍼 함수
const getStorageKey = (baseKey, userId) => `${baseKey}_${userId}`;

const TeamActivityPostDetail = ({ post, onBack, refreshPosts }) => {
  const { user } = useAuth();
  const [postData, setPostData] = useState(post);
  const [liked, setLiked] = useState(false);
  const [attending, setAttending] = useState(false);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loadingComments, setLoadingComments] = useState(false);

  // 컴포넌트 마운트 시 유저별 localStorage에서 좋아요 및 참석 상태 복원
  useEffect(() => {
    if (!user) return;
    const likedPostsKey = getStorageKey("likedPosts", user.userId);
    const likeCountsKey = getStorageKey("likeCounts", user.userId);
    const attendedPostsKey = getStorageKey("attendedPosts", user.userId);
    
    const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey) || "{}");
    const likeCounts = JSON.parse(localStorage.getItem(likeCountsKey) || "{}");
    const attendedPosts = JSON.parse(localStorage.getItem(attendedPostsKey) || "{}");
    
    setLiked(likedPosts[postData.postId] || false);
    if (likeCounts[postData.postId] !== undefined) {
      setPostData((prev) => ({ ...prev, likes: likeCounts[postData.postId] }));
    } else {
      likeCounts[postData.postId] = postData.likes;
      localStorage.setItem(likeCountsKey, JSON.stringify(likeCounts));
    }
    setAttending(attendedPosts[postData.postId] || false);
  }, [postData.postId, user]);

  // 댓글 불러오기
  useEffect(() => {
    const fetchComments = async () => {
      setLoadingComments(true);
      try {
        const commentsData = await getTeamActivityComments(postData.postId);
        setComments(commentsData);
      } catch (error) {
        console.error("댓글 불러오기 오류:", error);
      } finally {
        setLoadingComments(false);
      }
    };
    fetchComments();
  }, [postData.postId]);

  // 팀 멤버 기반 참석 여부 확인
  useEffect(() => {
    if (user && postData.teamMembers) {
      setAttending(postData.teamMembers.includes(user.userId));
    }
  }, [user, postData.teamMembers]);

  // 좋아요 추가 함수 (유저당 한 번만 좋아요 처리)
  const handleLike = async () => {
    // 이미 좋아요를 누른 경우 추가 호출 방지
    if (liked) {
      alert("이미 좋아요를 누르셨습니다.");
      return;
    }
    try {
      // 좋아요 추가 시에는 increment 값 1만 전달
      const updatedPost = await toggleTeamActivityLike(postData.postId, 1);
      setPostData(updatedPost);
      setLiked(true);
      // localStorage에 상태 저장 (옵션)
      const likedPostsKey = getStorageKey("likedPosts", user.userId);
      const likedPosts = JSON.parse(localStorage.getItem(likedPostsKey) || "{}");
      likedPosts[postData.postId] = true;
      localStorage.setItem(likedPostsKey, JSON.stringify(likedPosts));
    } catch (error) {
      console.error("좋아요 처리 오류:", error);
    }
  };

  // 참석 버튼 클릭 처리
  const handleAttend = async () => {
    if (!user) return;
    const attendedPostsKey = getStorageKey("attendedPosts", user.userId);
    try {
      const updatedPost = await attendTeamActivityPost(postData.postId, user.userId);
      // 만약 updatedPost.teamMembers에 참석한 사용자가 없다면 직접 추가
      let updatedTeamMembers = updatedPost.teamMembers || [];
      if (!updatedTeamMembers.includes(user.userId)) {
        updatedTeamMembers.push(user.userId);
      }
      updatedPost.teamMembers = updatedTeamMembers;
      // 참석 상태를 localStorage에 저장
      const attendedPosts = JSON.parse(localStorage.getItem(attendedPostsKey) || "{}");
      attendedPosts[postData.postId] = true;
      localStorage.setItem(attendedPostsKey, JSON.stringify(attendedPosts));
      // 서버 응답에 좋아요 값이 덮어쓰여질 수 있으므로 localStorage의 좋아요 값 복원
      const likeCountsKey = getStorageKey("likeCounts", user.userId);
      const likeCounts = JSON.parse(localStorage.getItem(likeCountsKey) || "{}");
      if (likeCounts[postData.postId] !== undefined) {
        updatedPost.likes = likeCounts[postData.postId];
      }
      setPostData(updatedPost);
      setAttending(true);
    } catch (error) {
      console.error("참석 처리 오류:", error);
    }
  };

  // 게시글 삭제 처리 (교수 전용)
  const handleDelete = async () => {
    if (window.confirm("정말 이 게시글을 삭제하시겠습니까?")) {
      try {
        await deleteTeamActivityPost(postData.postId);
        refreshPosts(); // 부모에서 게시글 목록 새로고침
        onBack(); // 목록으로 돌아가기
      } catch (error) {
        console.error("게시글 삭제 오류:", error);
      }
    }
  };

  // 댓글 추가 처리
  const handleAddComment = async (e) => {
    e.preventDefault();
    if (!newComment.trim()) return;
    try {
      const commentData = {
        commenterId: user?.userId || "",
        content: newComment,
      };
      await addTeamActivityComment(postData.postId, commentData);
      setNewComment("");
      const updatedComments = await getTeamActivityComments(postData.postId);
      setComments(updatedComments);
    } catch (error) {
      console.error("댓글 추가 오류:", error);
    }
  };

  return (
    <div>
      <h2>{postData.title}</h2>
      <p> <strong>작성자:</strong> {postData.authorName} </p>
      <p> <strong>작성일:</strong> {new Date(postData.createdAt).toLocaleString()} </p>
      <p> <strong>좋아요:</strong> {post.likes} </p>
      <div>
        <p>{postData.content}</p>
      </div>
      <div style={{ margin: "1rem 0" }}>
        <button onClick={handleLike}>
          {liked ? "좋아요 취소" : "좋아요"}
        </button>
        <button onClick={handleAttend} disabled={attending} style={{ marginLeft: "1rem" }}>
          {attending ? "참석 완료" : "참석"}
        </button>
      </div>
      {user?.role === "professor" && (
        <div style={{ marginBottom: "1rem" }}>
          <button onClick={handleDelete}>게시글 삭제</button>
        </div>
      )}
      <div style={{ marginBottom: "1rem" }}>
        <button onClick={() => onBack(postData)}>뒤로가기</button>
      </div>
      <hr />
      <div>
        <h3>댓글</h3>
        {loadingComments ? (
          <p>댓글을 불러오는 중...</p>
        ) : comments.length === 0 ? (
          <p>댓글이 없습니다.</p>
        ) : (
          <ul>
            {comments.map((comment) => (
              <li key={comment.commentId}>
                <p>
                  <strong>{comment.commenterId}</strong>{" "}
                  {new Date(comment.createdAt).toLocaleString()}
                </p>
                <p>{comment.content}</p>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div>
        <form onSubmit={handleAddComment}>
          <textarea
            value={newComment}
            onChange={(e) => setNewComment(e.target.value)}
            placeholder="댓글을 입력하세요"
            required
          ></textarea>
          <br />
          <button type="submit">댓글 추가</button>
        </form>
      </div>
    </div>
  );
};

export default TeamActivityPostDetail;
