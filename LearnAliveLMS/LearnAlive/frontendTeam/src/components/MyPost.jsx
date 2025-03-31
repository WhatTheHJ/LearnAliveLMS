import { useState, useEffect } from "react";
import { getUsersAllPosts, deletePost } from "../api/postApi";
import { useAuth } from "../context/AuthContext";
import { Link } from "react-router-dom"; // 🔹 Link 추가

const MyPost = ({ boardId }) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const { user } = useAuth();

  // 📌 페이지네이션을 위한 상태 추가
  const [currentPage, setCurrentPage] = useState(1);
  const postsPerPage = 5; // 한 페이지당 게시물 개수

  // 📌 정렬 상태 추가
  const [sortConfig, setSortConfig] = useState({ key: "createdAt", direction: "desc" });

  useEffect(() => {
    const fetchPosts = async () => {
      try {
        if (!user?.userId) {
          console.warn("❗ API 요청 중단: boardId 또는 userId 없음", { user });
          return;
        }
        console.log("📌 API 요청 시작 - boardId:", "userId:", user.userId);
        const data = await getUsersAllPosts( user.userId);
        console.log("✅ API 응답 수신:", data);

        // 🔹 최신 게시글이 위로 오도록 작성일자 기준 정렬 (내림차순)
        const sortedData = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedData);
      } catch (err) {
        console.error("❌ API 요청 실패:", err);
        setError("게시글을 불러오는 중 오류가 발생했습니다.");
      } finally {
        setLoading(false);
      }
    };
    fetchPosts();
  }, [ user]);

  const handleDelete = async (postId) => {
    const confirmDelete = window.confirm("정말로 삭제하시겠습니까?");
    if (!confirmDelete) return; // 취소 버튼 클릭 시 종료
  
    try {
      console.log(`📌 게시물 삭제 요청 - postId: ${postId}`);
      await deletePost(postId); // 🔹 API 호출로 게시물 삭제
      console.log("✅ 게시물 삭제 성공");
      setPosts((prevPosts) => prevPosts.filter((post) => post.postId !== postId)); // 🔹 삭제된 게시물 목록 갱신
    } catch (err) {
      console.error("❌ 게시물 삭제 실패:", err);
      setError("게시물 삭제 중 오류가 발생했습니다.");
    }
  };

  if (loading) return <p>게시글 불러오는 중...</p>;
  if (error) return <p>{error}</p>;

  // 📌 정렬 함수
  const sortedPosts = [...posts].sort((a, b) => {
    if (!sortConfig.key) return 0;
    
    let aValue = a[sortConfig.key];
    let bValue = b[sortConfig.key];

    if (sortConfig.key === "createdAt") {
      aValue = new Date(aValue);
      bValue = new Date(bValue);
    }

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // 📌 정렬 상태 변경
  const handleSort = (key) => {
    setSortConfig((prev) => ({
      key,
      direction: prev.key === key && prev.direction === "asc" ? "desc" : "asc",
    }));
  };

  // 🔹 페이지네이션 로직
  const indexOfLastPost = currentPage * postsPerPage;
  const indexOfFirstPost = indexOfLastPost - postsPerPage;
  const currentPosts = sortedPosts.slice(indexOfFirstPost, indexOfLastPost);
  const totalPages = Math.ceil(posts.length / postsPerPage);

  return (
    <div style={{ marginTop: "20px" }}>
      <h2>내 게시글 목록</h2>

      {posts.length === 0 ? (
        <p>작성한 게시글이 없습니다.</p>
      ) : (
        <>
          <table style={{ width: "700px", margin: "20px auto", borderCollapse: "collapse", fontSize: "18px" }}>
            <thead>
              <tr style={{ backgroundColor: "#f2f2f2", height: "50px" }}>
                <th style={{ border: "1px solid #ddd", padding: "12px", cursor: "pointer" }} onClick={() => handleSort("postId")}>
                  번호 {sortConfig.key === "postId" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={{ border: "1px solid #ddd", padding: "12px", cursor: "pointer" }} onClick={() => handleSort("title")}>
                  제목 {sortConfig.key === "title" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={{ border: "1px solid #ddd", padding: "12px", cursor: "pointer" }} onClick={() => handleSort("view")}>
                  조회수 {sortConfig.key === "view" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={{ border: "1px solid #ddd", padding: "12px", cursor: "pointer" }} onClick={() => handleSort("createdAt")}>
                  작성일자 {sortConfig.key === "createdAt" ? (sortConfig.direction === "asc" ? "▲" : "▼") : ""}
                </th>
                <th style={{ border: "1px solid #ddd", padding: "12px" }}>관리</th>
              </tr>
            </thead>
            <tbody>
              {currentPosts.map((post, index) => (
                <tr key={post.postId} style={{ height: "50px", textAlign: "center" }}>
                  {/* 🔹 정렬된 데이터의 실제 순서대로 번호 매기기 */}
                  <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                    {sortedPosts.findIndex((p) => p.postId === post.postId) + 1}
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "12px", textAlign: "center" }}>
                    <Link to={`/mypage/post/${post.postId}`} style={{ textDecoration: "none", color: "black" }}>
                      {post.title}
                    </Link>
                  </td>
                  <td style={{ border: "1px solid #ddd", padding: "12px" }}>{post.view}</td>
                  <td style={{ border: "1px solid #ddd", padding: "12px" }}>{post.createdAt}</td>
                  <td style={{ border: "1px solid #ddd", padding: "12px" }}>
                    <button onClick={() => handleDelete(post.postId)}> 삭제 </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* 페이지네이션 버튼 */}
          <div style={{ display: "flex", justifyContent: "center", marginTop: "20px" }}>
            <button 
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))} 
              disabled={currentPage === 1}
            >
              ◀ 이전
            </button>
            <span style={{ padding: "10px 15px", fontWeight: "bold", fontSize: "18px" }}>
              {currentPage} / {totalPages}
            </span>
            <button 
              onClick={() => setCurrentPage((prev) => Math.min(prev + 1, totalPages))} 
              disabled={currentPage === totalPages}
            >
              다음 ▶
            </button>
          </div>
        </>
      )}
    </div>
  );
};

export default MyPost;