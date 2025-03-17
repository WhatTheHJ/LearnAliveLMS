import { useEffect, useState } from "react";
import { updatePost, downloadFile, likePost } from "../api/postApi"; // 게시글 수정 API 추가
import { useAuth } from "../context/AuthContext";

function PostDetail({ post, onBack, onUpdate }) {
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [likedPosts, setLikedPosts] = useState(new Set()); // 사용자가 좋아요 누른 게시글 저장
  const [posts, setPosts] = useState([]); // setPosts 정의
  

  useEffect(() => {
    console.log("selectedPost 상태가 변경되었습니다:", post);
    if (post) {
      setEditedTitle(post.title);
      setEditedContent(post.content);
    }
  }, [post]);

  if (!post) {
    return <div>Loading...</div>;
  }

  //좋아요 버튼 클릭시 실행
  const handleLikeClick = async (postId) => {
    const isLiked = likedPosts.has(postId); // 현재 좋아요 상태 확인
  
    try {
      // 백엔드에서 좋아요를 추가하거나 취소
      await likePost(postId, user.userId); // toggleLike 메서드가 호출됨 (좋아요 또는 취소)
  
      // 좋아요 상태에 따른 좋아요 수 업데이트
      setPosts((prevPosts) =>
        prevPosts.map((post) =>
          post.postId === postId
            ? {
                ...post,
                likes: isLiked ? post.likes - 1 : post.likes + 1, // 좋아요 상태에 따른 likes 수 변경
              }
            : post
        )
      );
  
      // likedPosts 상태를 업데이트하는 부분
      setLikedPosts((prevLikedPosts) => {
        const updatedLikedPosts = new Set(prevLikedPosts);
  
        if (isLiked) {
          updatedLikedPosts.delete(postId); // 좋아요 취소
        } else {
          updatedLikedPosts.add(postId); // 좋아요 추가
        }
  
        return updatedLikedPosts; // 업데이트된 likedPosts 반환
      });
  
      // 좋아요 상태에 따른 알림 한 번만 띄우기
      if (isLiked) {
        alert("좋아요가 취소되었습니다.");
      } else {
        alert("좋아요를 눌렀습니다.");
      }
    } catch (error) {
      console.error('좋아요 처리 중 오류:', error);
      alert("좋아요를 처리하는 중 오류가 발생했습니다.");
    }
  };
  
  
  //   if (likedPosts.has(postId)) {
  //     alert("이미 좋아요를 눌렀습니다!");
  //     return;
  //   }
  //   try {
  //     await likePost(postId, user.userId);
  //     setPosts((prevPosts) =>
  //       prevPosts.map((post) =>
  //         post.postId === postId ? { ...post, likes: post.likes + 1 } : post
  //       )
  //     );
  //     setLikedPosts(new Set(likedPosts).add(postId)); // 상태 업데이트
  //   } catch (error) {
  //     console.error('좋아요 처리 중 오류:', error);  // 오류 메시지 출력
  //     throw error;  // 다시 오류를 throw해서 상위 함수에서 처리하도록 함
  //   }
  // };

  // 수정 버튼 클릭 시 실행
  const handleEditClick = () => {
    setIsEditing(true);
  };

  // 수정 완료 버튼 클릭 시 onclick에서 실행
  const handleUpdate = async () => {
    try {
      const updatedPost = {
        title: editedTitle,
        content: editedContent,
      };
      await updatePost(post.postId, updatedPost);
      alert("게시글이 수정되었습니다.");
      setIsEditing(false);

      // PostList에 수정된 내용을 반영하기 위해 onUpdate 호출
      onUpdate(post.postId, updatedPost);
      onBack(); // 뒤로 가면서 변경사항 반영
    } catch (error) {
      alert("게시글 수정에 실패했습니다.");
      console.error("게시글 수정 오류:", error);
    }
  };

        // 파일 다운로드 클릭 시 실행
        const handleDownloadClick = async () => {
          try {
            const fileData = await downloadFile(post.postId, { responseType: 'blob' });  // API에서 파일 다운로드 요청
            const fileBlob = new Blob([fileData], { type: fileData.type });  // Blob으로 변환

            const fileName = post.filePath.split("/").pop();  // 파일명 추출
            const link = document.createElement("a");  // 다운로드 링크 생성
            link.href = URL.createObjectURL(fileBlob);
            link.download = fileName;  // 다운로드 파일명
            link.click();  // 다운로드 실행
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
              <p><strong>좋아요:</strong> {post.likes || 0}</p>
            </div>
            <hr />

            <div>
              <p className="post-content">{post.content || "내용 없음"}</p>
              <td>
              <button
                  onClick={() => handleLikeClick(post.postId)}
                  disabled={post.likedByUser} // 이미 좋아요를 누른 유저는 버튼 비활성화
                >
                  {post.likedByUser ? "좋아요 취소" : "👍 좋아요"}
                </button>
              </td>
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
