import { useState, useEffect } from "react";
import { getAllPosts, deletePost, getPostById } from "../api/postApi"; // 게시글 조회 API
import { fetchBoardsByClassId } from "../api/boardsApi";
import { useParams } from "react-router-dom";
import AddPostPage from "./AddPostPage";
import PostDetail from "./PostDetail";
import { useAuth } from "../context/AuthContext";
import FilteredPostList from "./FilteredPostList";


function PostList({ boardId }) {
  const { classId } = useParams();
  const [posts, setPosts] = useState([]); // 게시글 목록 상태
  const [selectedPost, setSelectedPost] = useState(null); // 선택된 게시글 상태
  const [board, setBoard] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태
  const [showCreatePost, setShowCreatePost] = useState(false); // 게시글 작성 폼을 보일지 말지에 대한 상태
  const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
  const [refresh, setRefresh] = useState(false); // ✅ 새로고침 트리거 추가
 //---------------------------------------------------------------------------
  const [currentPage, setCurrentPage] = useState(1); // 현재 페이지
  const postsPerPage = 10; // 한 페이지당 게시글 개수
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = posts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage); // 전체 페이지 개수
  //---------------------------------------------------------------------------
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredPosts, setFilteredPosts] = useState(posts);
  const [showFiltered, setShowFiltered] = useState(false);
  // const navigate = useNavigate();


  // 검색어 변경 시 호출
  const handleSearchChange = (e) => {
  setSearchQuery(e.target.value);
  };

  // 검색 버튼 클릭 시 호출
  const handleSearchClick = () => {
    // 검색어가 있을 경우 필터링
    if (searchQuery) {
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(searchQuery.toLowerCase()) 
        // ||
          // post.content.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredPosts(filtered);
      setShowFiltered(true);
    } else {
      // 검색어가 없으면 모든 게시글을 표시
      setFilteredPosts(posts);
      setShowFiltered(false);
    }
  };
  

  useEffect(() => {
    // 게시글 목록 및 게시판 정보 불러오기
    const fetchData = async () => {
      if (!boardId) return; // boardId가 없으면 실행하지 않음
  
      try {
        // 게시판 목록 불러오기
        setLoading(true);
        setPosts([]);  // 새 게시판을 불러오기 전에 이전 게시판의 내용을 초기화
        // setFilteredPosts([]);  // 필터링된 게시글 목록도 초기화
        setShowFiltered(false);
        const postsData = await getAllPosts(boardId);
        // 게시글을 createdAt 기준으로 내림차순 정렬
        const sortedPosts = postsData.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
        setFilteredPosts([sortedPosts]);  // 필터링된 게시글 목록 초기화
  
        // 게시판 정보 불러오기
        const fetchedBoard = await fetchBoardsByClassId(classId);
        setBoard(fetchedBoard.isDefault);  // 기본 게시판 여부 설정
  
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
  
    // 게시판을 변경할 때마다 검색어와 필터링된 게시글 목록 초기화
    setSearchQuery("");  // 검색어 초기화
    setFilteredPosts([]);  // 필터링된 게시글 목록 초기화
  
  }, [boardId, refresh]);
  
  
  if (loading) {
    return <div>로딩 중...</div>;
  }

  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
  };

  const handleTitleClick = async (post) => {
    try {
      // postId를 사용하여 해당 게시글을 가져옴
      const selectedPostData = await getPostById(post.postId);
      console.log("가져온 게시글:", selectedPostData); // 가져온 게시글 출력
      setSelectedPost(selectedPostData);
  console.log("가져온 게시글:", selectedPostData);
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
  
  //게시글 수정시 업데이트
  const handleUpdatePost = (postId, updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === postId
          ? { ...post, title: updatedPost.title, content: updatedPost.content }
          : post
      )
    );
  };

   // 📌 새 게시글 추가 시 리스트 업데이트
   const handlePostCreated = (newPost) => {
    setPosts((prevPosts) => [...prevPosts, newPost]); // 새 게시글 추가
    setRefresh((prev) => !prev); // ✅ refresh 값을 반대로 변경 (트리거 역할)
    setShowCreatePost(false); // 게시글 작성 후 목록으로 돌아가기
  
    // 게시글 작성 후 선택된 게시글 초기화
    setSelectedPost(null); // 새 게시글 작성 후에 이전에 선택된 게시글이 있으면 해제
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

  const handleLikeToggle = (updatedPost) => {
    setPosts((prevPosts) =>
      prevPosts.map((post) =>
        post.postId === updatedPost.postId ? { ...post, ...updatedPost } : post
      )
    );
  };

  // 페이징 핸들러
  const paginate = (pageNumber) => setCurrentPage(pageNumber);

  return (
    <div className="post-container">
      {showCreatePost ? (
        <AddPostPage
          boardId={boardId}
          onCancle={() => setShowCreatePost(false)}
          onPostCreated={(newPost) => {
            setPosts((prevPosts) => [...prevPosts, newPost]);
            setRefresh((prev) => !prev); // 새로고침
            setShowCreatePost(false);
            setSelectedPost(null);
          }}
        />
      ) : (
        <>
          <div>
            {/* 게시글 추가 버튼 로직 */}
            {board?.isDefault === 0 && user?.author_role === "professor" && (
              <button className="add-post-button" onClick={() => setShowCreatePost(true)}>
                게시글 추가
              </button>
            )}
            {board?.isDefault === 1 && (
              <button className="add-post-button" onClick={() => setShowCreatePost(true)}>
                게시글 추가
              </button>
            )}
          </div>

          {selectedPost ? (
            <PostDetail post={selectedPost} onBack={() => setSelectedPost(null)}  onLikeToggle={handleLikeToggle} />
          ) : (
            <>
              <div>
                <input
                  type="text"
                  placeholder="검색어 입력"
                  value={searchQuery}
                  onChange={handleSearchChange}
                />
                <button onClick={handleSearchClick}>검색</button>
              </div>

              {showFiltered ? (
                 <FilteredPostList
                filteredPosts={filteredPosts}  // 필터링된 게시글을 전달
                // onPostClick={handleTitleClick}  // 게시글 클릭 핸들러 전달
                // user={user}  // 사용자 정보 전달
                handleDelete={handleDelete}  // 삭제 함수 전달
                // filteredPosts={currentPosts} 
                onPostClick={handleTitleClick} 
                paginate={paginate} 
                currentPage={currentPage} 
                totalPages={totalPages} 
                
              />
              ) : (
                <div>
                  <h2>게시글 목록</h2>
                  <table>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>제목</th>
                        <th>작성자</th>
                        <th>조회수</th>
                        <th>좋아요</th>
                        <th>작성일</th>
                        {user?.author_role === "professor" && <th>관리</th>}
                      </tr>
                    </thead>
                    <tbody>
                      {currentPosts.length > 0 ? (
                        currentPosts.map((post) => (
                          <tr key={post.postId}>
                            <td>{post.postId}</td>
                            <td className="post-title" onClick={() => handleTitleClick(post)}>
                              {post.title}
                            </td>
                            <td>{post.author}</td>
                            <td>{post.view}</td>
                            <td>{post.likes}</td>
                            <td>{post.createdAt}</td>
                            {user?.author_role === "professor" && (
                              <td>
                                <button onClick={() => handleDelete(post.postId)}>삭제</button>
                              </td>
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

                  {/* 페이지 버튼 */}
                  <div>
                    {Array.from({ length: totalPages }, (_, index) => (
                      <button key={index + 1} onClick={() => handlePageChange(index + 1)}>
                        {index + 1}
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </>
      )}
    </div>
  );
}

export default PostList;
