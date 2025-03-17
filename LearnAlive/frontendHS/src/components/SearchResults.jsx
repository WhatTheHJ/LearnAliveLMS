import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router-dom';

const SearchResults = ({ posts }) => {
  const [filteredPosts, setFilteredPosts] = useState([]);
  const location = useLocation();

  useEffect(() => {
    const query = new URLSearchParams(location.search).get('query');

    if (query) {
      // 검색어를 기준으로 게시글 필터링
      const filtered = posts.filter(
        (post) =>
          post.title.toLowerCase().includes(query.toLowerCase()) ||
          post.content.toLowerCase().includes(query.toLowerCase())
      );
      setFilteredPosts(filtered);
    }
  }, [location.search, posts]);

  return (
    <div>
      <h2>검색 결과</h2>
      <ul>
        {filteredPosts.length > 0 ? (
          filteredPosts.map((post) => (
            <li key={post.postId}>{post.title}</li>
          ))
        ) : (
          <li>검색 결과가 없습니다.</li>
        )}
      </ul>
    </div>
  );
};

export default SearchResults;
