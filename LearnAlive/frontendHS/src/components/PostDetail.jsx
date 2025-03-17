import { useEffect, useState } from "react";
import { updatePost, downloadFile, likePost } from "../api/postApi"; // likePost 추가
import { useAuth } from "../context/AuthContext";

function PostDetail({ post, onBack, onUpdate, onLikeToggle }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [likedPosts, setLikedPosts] = useState(new Set()); // 사용자가 좋아요 누른 게시글 저장
  const [isLiked, setIsLiked] = useState(false); // 좋아요 여부 상태
  const [postLikes, setPostLikes] = useState(post.likes || 0); // 좋아요 수 상태 관리

  useEffect(() => {
    if (post) {
      setEditedTitle(post.title);
      setEditedContent(post.content);
      checkIfUserLiked(post.postId); // 좋아요 상태 확인
      setPostLikes(post.likes); // 초기 좋아요 수 설정
    }
  }, [post]);

  // 사용자가 해당 게시글에 좋아요를 눌렀는지 확인하는 함수
  const checkIfUserLiked = (postId) => {
    const storedLikedPosts = JSON.parse(localStorage.getItem("likedPosts")) || [];
    setLikedPosts(new Set(storedLikedPosts));
    setIsLiked(storedLikedPosts.includes(postId));
  };

  // 좋아요 버튼 클릭시 실행
  const handleLikeClick = async (postId) => {
    try {
      // 백엔드에서 좋아요 추가 또는 취소
      await likePost(postId, user.userId);

      // 좋아요 상태 변경 (토글)
      const updatedIsLiked = !isLiked;
      setIsLiked(updatedIsLiked);

      // 좋아요 상태에 따른 좋아요 수 업데이트
      const updatedLikes = updatedIsLiked ? postLikes + 1 : postLikes - 1;
      setPostLikes(updatedLikes); // 즉시 좋아요 수 상태 업데이트

       // 로컬스토리지에 좋아요 상태 저장
    let updatedLikedPosts = Array.from(likedPosts); // Set을 배열로 변환
    updatedLikedPosts = updatedIsLiked
      ? [...updatedLikedPosts, postId] // 좋아요 추가
      : updatedLikedPosts.filter((id) => id !== postId); // 좋아요 취소

    // 업데이트된 likedPosts를 다시 Set으로 변환하여 상태에 저장
    setLikedPosts(new Set(updatedLikedPosts));
    localStorage.setItem("likedPosts", JSON.stringify(updatedLikedPosts));
      // 부모 컴포넌트에 좋아요 상태 변경 사항 전달
      const updatedPost = { ...post, likes: updatedLikes };
      onLikeToggle(updatedPost); // 최신 게시글 객체 전달

      // 알림
      alert(updatedIsLiked ? "좋아요를 눌렀습니다." : "좋아요가 취소되었습니다.");
    } catch (error) {
      console.error("좋아요 처리 중 오류:", error);
      alert("좋아요 처리 중 오류가 발생했습니다.");
    }
  };

  // 수정 버튼 클릭 시 실행
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 수정 완료 버튼 클릭 시
  const handleUpdate = async () => {
    try {
      const updatedPost = {
        title: editedTitle,
        content: editedContent,
      };
      await updatePost(post.postId, updatedPost);
      alert("게시글이 수정되었습니다.");
      setIsEditing(false);
      onUpdate(updatedPost); // 부모 컴포넌트에 수정된 내용 전달
      onBack(); // 뒤로 가기
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
      console.error("게시글 수정 오류:", error);
    }
  };

  // 파일 다운로드 클릭 시 실행
  const handleDownloadClick = async () => {
    try {
      const fileData = await downloadFile(post.postId, { responseType: 'blob' });
      const fileBlob = new Blob([fileData], { type: fileData.type });
      const fileName = post.filePath.split("/").pop();
      const link = document.createElement("a");
      link.href = URL.createObjectURL(fileBlob);
      link.download = fileName;
      link.click();
    } catch (error) {
      console.error("파일 다운로드 오류:", error);
      alert("파일 다운로드에 실패했습니다.");
    }
  };

  return (
    <div className="post-container">
      <div className="post-card">
        {isEditing ? (
          <>
            <input
              type="text"
              value={editedTitle}
              onChange={(e) => setEditedTitle(e.target.value)}
              className="edit-title"
            />
            <textarea
              value={editedContent}
              onChange={(e) => setEditedContent(e.target.value)}
              className="edit-content"
            />
            <button className="save-button" onClick={handleUpdate}>수정 완료</button>
            <button className="cancel-button" onClick={() => setIsEditing(false)}>취소</button>
          </>
        ) : (
          <>
            <h2 className="post-title">{post.title || "제목 없음"}</h2>
            <div className="post-meta">
              <p><strong>작성자:</strong> {post.author || "작성자 정보 없음"}</p>
              <p><strong>작성자 ID:</strong> {post.authorId || "ID 없음"}</p>
              <p><strong>작성일:</strong> {new Date(post.createdAt).toLocaleString() || "날짜 없음"}</p>
              <p><strong>조회수:</strong> {post.view || 0}</p>
              <p><strong>좋아요:</strong> {postLikes || 0}</p> {/* 즉시 업데이트된 좋아요 수 표시 */}
            </div>
            <hr />
            <div>
              <p className="post-content">{post.content || "내용 없음"}</p>
              <button
                onClick={() => handleLikeClick(post.postId)}
              >
                {isLiked ? "좋아요 취소" : "👍 좋아요"}
              </button>
              {post.filePath && (
                <button className="download-button" onClick={handleDownloadClick}>
                  파일 다운로드 : {post.createdAt}
                </button>
              )}
            </div>
            <button className="edit-button" onClick={handleEditClick}>수정</button>
            <button className="back-button" onClick={onBack}>뒤로 가기</button>
          </>
        )}
      </div>
    </div>
  );
}

export default PostDetail;
