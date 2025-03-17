
// Search 컴포넌트
const Search = ({ searchQuery, handleSearchChange, handleSearchClick }) => {
  return (
    <div>
      <input
        type="text"
        placeholder="검색어 입력"
        value={searchQuery}
        onChange={handleSearchChange}
      />
      <button onClick={handleSearchClick}>검색</button>
    </div>
  );
};

export default Search;
