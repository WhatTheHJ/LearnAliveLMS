import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { createPost } from "../api/postApi"; // 게시글 추가 API
import { useAuth } from "../context/AuthContext"; // AuthContext

function AddPostPage() {
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const { boardId, classId } = useParams(); // URL에서 boardId 가져오기
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅
  const [title, setTitle] = useState(""); // 게시글 제목 상태
  const [content, setContent] = useState(""); // 게시글 내용 상태
  const [authorId, setAuthorId] = useState(""); // 예시: 로그인한 유저의 ID (실제 사용 시 세션/토큰에서 가져오기)
  const [authorRole, setAuthorRole] = useState(""); // 예시: 유저 역할 (실제 사용 시 세션/토큰에서 가져오기)
  const [author, setAuthor] = useState("홍길동"); // 예시: 작성자 이름 (실제 사용 시 세션에서 가져오기)

  // console.log("boardId:", boardId); // 디버깅: boardId 값 확인

  // useEffect(() => {
  //   세션에서 로그인된 사용자 정보 가져오기
  //   const userInfo = sessionStorage.getItem("userInfo");//sessionStorage의 데이터는 페이지 세션이 끝날 때 제거
  //   if (userInfo) {
  //     const { id, role } = JSON.parse(userInfo); // userInfo에서 id와 role 추출
  //     setAuthorId(id); // 상태에 id 저장
  //     setAuthorRole(role); // 상태에 role 저장
  //   }
  // }, []);

  // 게시글 추가 함수
  const handleAddPost = async (e) => {
    e.preventDefault(); // 폼 제출 시 페이지 리로드 방지
    if (!boardId) {
      alert("boardId가 없습니다.");
      return;
      
    }
    const postData = {
      board_id: boardId, // URL에서 가져온 boardId 
      // author_id: user.userId, // 로그인된 사용자의 ID  <원본>
      // author_role: user.role, // === "professor" ? "professor" : "student",  <원본>
      

      authorId: user.userId, // 세션에서 받아온 userId
      authorRole: user.role, // 세션에서 받아온 role
      author: user.name, // 로그인된 사용자의 이름
      title: title, // 게시글 제목
      content: content, // 게시글 내용
    };

    console.log(postData); // 값이 제대로 전달되는지 <확인완!!>,
    

    try {
      await createPost(boardId, postData); // 게시글 추가 API 호출
      navigate(`/classroom/${classId}/boards`); // 게시글 추가 후 게시판 페이지로 이동
    } catch (error) {
      console.error("게시글 추가 실패:", error);
      alert("게시글 추가에 실패했습니다.");
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
          <label>작성자 이름</label>
          <input
            type="text"
            value={author}
            onChange={(e) => setAuthor(e.target.value)}
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
        <button type="submit">게시글 추가</button>
        {/* //<button className="btn btn-danger" onClick={() => deleteBoard(postId)}>삭제</button> */}
      </form>
    </div>
  );
}

export default AddPostPage;
