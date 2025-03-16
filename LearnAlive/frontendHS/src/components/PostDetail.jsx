import { useEffect, useState } from "react";
import { updatePost, downloadFile } from "../api/postApi"; // 게시글 수정 API 추가
import axios from "axios";

function PostDetail({ post, onBack, onUpdate }) {
  // post는 이제 객체로 전달되므로 바로 사용
  const [isEditing, setIsEditing] = useState(false);
  const [editedTitle, setEditedTitle] = useState("");
  const [editedContent, setEditedContent] = useState("");

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
            </div>
            <hr />

            <div>
              <p className="post-content">{post.content || "내용 없음"}</p>

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
