import { useAuth } from "../context/AuthContext";

const FilteredPostList = ({ filteredPosts, onPostClick, handleDelete, paginate, currentPage, totalPages }) => {
    const totalFilteredPosts = filteredPosts.length;
     const totalPagesToShow = totalFilteredPosts > 0 ? Math.ceil(totalFilteredPosts / 10) : 1;  // 10개씩 페이지 나누기
    const { user } = useAuth(); // 로그인된 사용자 정보 가져오기
   
    return (
        <div className="post-container">
            
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>제목</th>
                <th>작성자</th>
                <th>조회수</th>
                <th>좋아요</th>
                <th>작성일</th>
                {user?.author_role === "professor" && 
                <th>관리</th>}
              </tr>
            </thead>
            <tbody>
              {filteredPosts.length > 0 ? (
                filteredPosts.map((post) => (
                  <tr key={post.postId}>
                    <td>{post.postId}</td>
                    <td className="post-title" onClick={() => onPostClick(post)}>
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
                  <td colSpan="6">검색된 게시글이 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
    
          {/* 페이지 네비게이션 */}
      {totalFilteredPosts > 10 && (
        <div className="pagination">
          {currentPage > 1 && (
            <button onClick={() => paginate(currentPage - 1)}>이전</button>
          )}
          {Array.from({ length: totalPagesToShow }, (_, index) => (
            <button
              key={index + 1}
              onClick={() => paginate(index + 1)}
              className={index + 1 === currentPage ? 'active' : ''}
            >
              {index + 1}
            </button>
          ))}
          {currentPage < totalPagesToShow && (
            <button onClick={() => paginate(currentPage + 1)}>다음</button>
          )}
        </div>
      )}
    </div>
        
      );
    };
    
    export default FilteredPostList;