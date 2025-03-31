import { useState } from "react";
// import { useParams, useNavigate } from "react-router-dom";
import { createPost } from "../api/postApi"; // 게시글 추가 API
import { useAuth } from "../context/AuthContext"; // AuthContext

function AddPostPage({ boardId,  onCancle, onPostCreated }) {
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [title, setTitle] = useState(""); // 게시글 제목 상태
  const [content, setContent] = useState(""); // 게시글 내용 상태
  const [file, setFile] = useState(null);


  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
    // setFilePath(e.target.files[0]);
  };

  const handleAddPost = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지

    if (!boardId) {
      alert("boardId가 없습니다.");
      return; 
    }

    const postData = {
        boardId: boardId, // URL에서 가져온 boardId 
        authorId: user.userId, // 세션에서 받아온 userId
        authorRole: user.role, // 세션에서 받아온 role
        author: user.username, // 로그인된 사용자의 이름
        title: title, // 게시글 제목
        content: content, // 게시글 내용
        // filePath: filePath,
        // postId: postId,
    };

    const formData = new FormData();
    if (file) {
      formData.append("file", file);
    }
    // formData.append("file", file);  // 파일 추가
    formData.append("post", JSON.stringify(postData));  // 다른 데이터 추가 (Post 객체)

    try {
      // 게시글 추가 API 호출 - formData X, postData와 file로 호출
      console.log("보내는 postData:", postData);
      console.log("보내는 file:", file);
      const response = await createPost(boardId, postData, file);
      console.log("Response 객체:", response);
  
      if (response) {
        console.log("게시글 작성 성공");
        onPostCreated(response);  // 게시글 작성 후 리스트 갱신
      } else {
        console.error("게시글 작성 실패", response);
      }
      
    } catch (error) {
      console.error("파일 업로드 오류:", error);
      if (error.response) {
          console.error("서버 응답 상태:", error.response.status);
          console.error("서버 응답 데이터:", error.response.data);
      } else if (error.request) {
          console.error("요청은 갔으나 응답 없음:", error.request);
      } else {
          console.error("요청 설정 중 오류:", error.message);
      }
    }
  };


  return (
    
    <div>
      <h2>게시글 추가</h2>
      <form onSubmit={handleAddPost}>
        <div>
          <label>제목</label>
          <input
            type="text"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            required
          />
        </div>

        <div>
          <label>내용</label>
          <textarea
            value={content}
            onChange={(e) => setContent(e.target.value)}
            required
          />
        </div>
        <div>
          <label>파일</label>
          <input type="file" onChange={handleFileChange} />
        </div>
        <button type="submit">게시글 작성</button>
        {/* <button onClick={() => onPostCreated()}>게시글 작성</button>  */}
        
        <button onClick={() => onCancle()}>취소</button>
      </form>
    </div>
  );
}

export default AddPostPage;