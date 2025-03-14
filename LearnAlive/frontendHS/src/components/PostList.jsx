import { useState, useEffect } from "react";
import { getAllPosts, deletePost, getPostById } from "../api/postApi"; // 게시글 조회 API
import { fetchBoardsByClassId } from "../api/boardsApi";
import PostDetail from "./PostDetail";
import { useParams } from "react-router-dom";
import AddPostPage from "./AddPostPage";
import { useAuth } from "../context/AuthContext";


function PostList({ boardId }) {
  const { classId } = useParams();
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 상태
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [showCreatePost, setShowCreatePost] = useState(false); // 게시글 작성 폼을 보일지 말지에 대한 상태
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기

  useEffect(() => {
    // 게시글 목록 및 게시판 정보 불러오기
    const fetchData = async () => {
      if (!boardId) return; // boardId가 없으면 실행하지 않음
  
      try {
        // 게시판 목록 불러오기
        setLoading(true);
        const postsData = await getAllPosts(boardId);
        setPosts(postsData);
  
        // 게시판 정보 불러오기
        const fetchedBoard = await fetchBoardsByClassId(classId);
        // console.log(fetchedBoard); <확인완>
        setBoard(fetchedBoard.isDefault);
        // console.log(fetchedBoard.isDefault); ,확인완>

        const selectedBoard = fetchedBoard.find(board => board.boardId === boardId);
        if (selectedBoard) {
          setBoard(selectedBoard); // 찾은 보드를 상태에 저장
          console.log(selectedBoard.isDefault); // isDefault 값 확인
        } else {
          console.log("해당 boardId에 대한 게시판을 찾을 수 없습니다.");
        }
  
      } catch (error) {
        console.error("게시글이나 게시판 정보를 불러오는 데 실패했습니다:", error);
      } finally {
        setLoading(false);
      }
    };
  
    fetchData();
  }, [boardId]); // boardId가 변경될 때마다 실행
  
 
  if (loading) {
    return <div>로딩 중...</div>;
  }

  const handleTitleClick = async (post) => {
    try {
      // postId를 사용하여 해당 게시글을 가져옴
      const selectedPostData = await getPostById(post.postId);
      console.log("가져온 게시글:", selectedPostData); // 가져온 게시글 출력
  
      // 상태에 가져온 게시글 설정
      setSelectedPost(selectedPostData);
  
      // 클릭한 게시글의 조회수만 업데이트하여 UI에 반영
      setPosts((prevPosts) =>
        prevPosts.map((p) =>
          p.postId === post.postId ? { ...p, view: p.view + 1 } : p // 해당 게시글의 조회수만 증가
        )
      );
    } catch (error) {
      console.error("게시글을 가져오는 데 실패했습니다:", error);
      alert("게시글을 불러오는 데 실패했습니다.");
    }
  };
  
  

  // 게시글 삭제하기
  const handleDelete = async (postId) => {
    if (!window.confirm("정말 삭제하시겠습니까?")) return;
  
    try {
      await deletePost(postId);
      setPosts(posts.filter((post) => post.postId !== postId)); // 삭제된 게시글을 상태에서 제거
      alert("게시글이 삭제되었습니다.");
    } catch (error) {
      console.error("게시글 삭제 중 오류 발생:", error);
      alert("게시글 삭제에 실패했습니다.");
    }
  };

  if (loading) {
    return <div>로딩 중...</div>;
  }


  return (
    <div className="post-container">
      {showCreatePost ? (
        // 게시글 작성 화면만 보이도록 설정
        <AddPostPage
          boardId={boardId}
          onCancel={() => setShowCreatePost(false)} // 취소 버튼을 누르면 목록으로 돌아가기
          onPostCreated={handlePostCreated} // 게시글 작성 후 상태 갱신
        />
      ) : (
        // 게시글 목록 화면만 보이도록 설정
        <>
        <div>{/* 게시글 추가 버튼 로직 */}
            {
            // board?.is_default 값이 0이고 user?.author_role이 "professor"일 경우에만 버튼을 표시
            board?.isDefault === 0 && user?.author_role === "professor" ? (
              <button className="add-post-button" onClick={() => setShowCreatePost(true)}>
                게시글 추가
              </button>
            ) : board?.isDefault === 1 ? (
              // is_default가 1일 때는 누구나 버튼을 볼 수 있음
              <button className="add-post-button" onClick={() => setShowCreatePost(true)}>
                게시글 추가
              </button>
            ) : null
          }</div>
            

          {selectedPost ? (
            <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)} />
          ) : (
            <div className="post-container">
              <table>
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>제목</th>
                    <th>작성자</th>
                    <th>조회수</th>
                    <th>작성일</th>
                    {user?.author_role === "professor" && (
                      <th>관리</th>
                    )}
                   
                  </tr>
                </thead>
                <tbody>
                  {posts.length > 0 ? (
                    posts.map((post) => (
                      <tr key={post.postId}>
                        <td>{post.postId}</td>
                        
                          <td className="post-title" onClick={() => handleTitleClick(post)}>
                            {post.title}
                          </td>
                        
                        <td>{post.author}</td>
                        <td>{post.view}</td>
                        <td>{post.createdAt}</td>
                        
                          
                        {user?.author_role === "professor" && (
                        <td> <button onClick={() => handleDelete(post.postId)}>삭제</button></td>
                        )}
                        
                      </tr>
                    ))
                  ) : (
                    <tr>
                      <td colSpan="6">게시글이 없습니다.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            </div>
          )}
        </>
      )}
    </div>
  );
  
}

export default PostList;
