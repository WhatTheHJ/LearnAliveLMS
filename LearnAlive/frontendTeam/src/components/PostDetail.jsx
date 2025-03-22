import { useEffect, useState } from "react";
import { updatePost, downloadFile, likePost, checkIfLiked, getPostById  } from "../api/postApi"; // likePost 추가
import { useAuth } from "../context/AuthContext";
// import { useLocation } from "react-router-dom";

function PostDetail({ post, onBack, onUpdate, onLikeToggle, fetchData }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [isLiked, setIsLiked] = useState(false); // 좋아요 여부 상태
  const [postLikes, setPostLikes] = useState(post.likes || 0); // 좋아요 수 상태 관리
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [updatedPost, setUpdatedPost] = useState(post); // 수정된 포스트 상태 관리


  const handleBackClick = () => {
    if (onBack) {
      onBack(); // 기존의 뒤로 가기 동작 실행
      if (fetchData) {
        fetchData(); // 뒤로 가기 후 데이터를 다시 가져오는 함수 호출
      }
    }
  };

  useEffect(() => {
    if (post && user) {
      const fetchLikedStatus = async () => {
        setLoading(true); // 로딩 시작
        try {
          const liked = await checkIfLiked(post.postId, user.userId);
          console.log("API에서 받은 liked 값:", liked); // 확인용 로그 추가
          setIsLiked(liked);
          
        } catch (error) {
          console.error("좋아요 상태 확인 오류:", error);
        } finally {
          setLoading(false); // 로딩 종료
        }
      };
      fetchLikedStatus();
      setEditedTitle(post.title);
      setEditedContent(post.content);
      setPostLikes(post.likes); // 초기 좋아요 수 설정
    }
  // }, [post, user]);
}, [post, user]);

  // 좋아요 버튼 클릭시 실행
  const handleLikeClick = async (postId) => {
    try {
      // 백엔드에서 좋아요 추가 또는 취소
      const updatedPost = await likePost(postId, user.userId);

      // 좋아요 상태와 좋아요 수 업데이트
      setIsLiked((prev) => !prev); // 좋아요 상태를 반전시킴
      setPostLikes(updatedPost.data.totalLikes); // 서버에서 받은 최신 좋아요 수로 업데이트

      // 서버에서 받은 최신 좋아요 수로 업데이트
      console.log("최신 좋아요 수:", updatedPost.data.totalLikes);

      onLikeToggle(postId, updatedPost.data.totalLikes); // 부모에게 전달

      // 알림
      alert(!isLiked ? "좋아요를 눌렀습니다." : "좋아요가 취소되었습니다.");
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
      
      const freshPost = await getPostById(post.postId); // 수정된 게시글 가져오기
      setUpdatedPost(freshPost); // 새로운 게시글 데이터를 상태에 반영
      // onUpdate(updatedPost); // 부모 컴포넌트에 수정된 내용 전달
      onUpdate(updatedPost);
      // onBack(); // 뒤로 가기
     
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
      console.error("게시글 수정 오류:", error);
    }
    // fetchData();
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
            <h2 className="post-title">{updatedPost.title || "제목 없음"}</h2> {/* updatedPost 사용 */}
            <div className="post-meta">
              <p><strong>작성자:</strong> {updatedPost.author || "작성자 정보 없음"}</p>
              <p><strong>작성자 ID:</strong> {updatedPost.authorId || "ID 없음"}</p>
              <p><strong>작성일:</strong> {new Date(updatedPost.createdAt).toLocaleString() || "날짜 없음"}</p>
              <p><strong>조회수:</strong> {updatedPost.view || 0}</p>
              <p><strong>좋아요:</strong> {postLikes || 0}</p> {/* 즉시 업데이트된 좋아요 수 표시 */}
            </div>
            <hr />
            <div>
              <p className="post-content">{updatedPost.content || "내용 없음"}</p>
              <button
                onClick={() => handleLikeClick(updatedPost.postId)}
              >
                {isLiked ? "좋아요 취소" : "👍 좋아요"}
              </button>

              {post.filePath && (
                <button className="download-button" onClick={handleDownloadClick}>
                  파일 다운로드 : {post.createdAt}({postLikes})
                </button>
              )}
            </div>
            <button className="edit-button" onClick={handleEditClick}>수정</button>
            <button className="back-button" onClick={handleBackClick}>뒤로 가기</button>
          </>
        )}
      </div>
    </div>
  );
}

export default PostDetail;