// PostList 컴포넌트
import { useState, useEffect } from "react";
import { useNavigate, Link } from "react-router-dom";
import { getAllPosts } from "../api/postApi"; // 게시글 API 호출
import "bootstrap/dist/css/bootstrap.min.css";
import "bootstrap/dist/css/bootstrap.min.css";

function PostList({ boardId, classId }) {
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [loading, setLoading] = useState(true); // 로딩 상태
  const navigate = useNavigate(); // 페이지 이동을 위한 navigate 훅

  // 게시글 목록 불러오기
  useEffect(() => {
    const fetchPosts = async () => {
      try {
        setLoading(true); // 로딩 시작
        const postsData = await getAllPosts(boardId); // 게시글 목록 가져오기 (1. PostsData에 데이터 저장(getAllPosts(boardId)의 결과값 (비동기 데이터)))
        setPosts(postsData); // 상태 업데이트 (2. setPosts호출하여 보드 업데이트)
      } catch (error) {
        console.error("게시글을 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false); // 로딩 완료
        const postsData = await getAllPosts(boardId);
        console.log("Fetched posts:", postsData); // 데이터 확인

      }
    };

    fetchPosts();
  }, [boardId]); // boardId가 변경될 때마다 게시글을 다시 불러옵니다.

  // 로딩 중일 때 메시지 표시
  if (loading) {
    return <div>로딩 중...</div>;
  }

  //리턴 부분에서 postId를 받지 못하는 문제. 아래 부분 추가.
  


  return (
    <div className="content">
      <Link to={`addpost/${boardId}`} className="btn btn-primary mb-4">
        게시글 추가
      </Link>

{/* <button className="btn btn-primary mb-4" onClick={() => navigate(`/addpost/${boardId}`)}>게시글 추가</button> */}

      <table className="post-container">
        <thead className="post-container">
          <tr>
            <th>ID</th>
            <th>제목</th>
            <th>작성자 ID</th>
            <th>작성자</th>
            <th>조회수</th>
            <th>작성일</th>
            <th>관리</th>
          </tr>
        </thead>

        <tbody>
        
          {posts.length > 0 ? (
            posts.map((post) => {
              console.log(post.postId); // 실제 postId가 출력되는지 확인
              return (
                <tr key={post.postId}>
                  <td>{post.postId}</td>
                  <td className="post-title">{post.title}</td>
                  <td>{post.authorId}</td>
                  <td className="post-author">{post.author}</td>
                  <td>{post.views}</td>
                  <td>{post.createdAt}</td>
                  <td>
                    <button className="btn btn-secondary me-2" onClick={() => navigate(`/edit/${post.postId}`)}>수정</button>
                  </td>
                </tr>
              );
            })
          ) : (
            <tr>
              <td colSpan="5">게시글이 없습니다.</td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
}

export default PostList;
