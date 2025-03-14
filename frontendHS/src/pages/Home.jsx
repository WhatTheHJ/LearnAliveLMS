import { useAuth } from "../context/AuthContext";

function Home() {
  const { user } = useAuth();

  // 강의실 목록 (임시 데이터, 실제로는 API에서 가져와야 함)
  const classes = [
    { id: 1, name: "종교와 영화", students: ["2017110293"] },
    { id: 2, name: "컴퓨터 네트워크", students: ["2018110234"] },
  ];

  // 로그인한 사용자의 강의실 필터링
  const userClasses = user ? classes.filter(cls => cls.students.includes(user.id)) : [];

  return (
    <div style={{ padding: "20px" }}>
      <h2>내 강의실</h2>
      {!user ? (
        <p>먼저 로그인이 필요합니다.</p>
      ) : userClasses.length > 0 ? (
        <ul>
          {userClasses.map(cls => (
            <li key={cls.id}>{cls.name}</li>
          ))}
        </ul>
      ) : (
        <p>등록된 강의실이 없습니다.</p>
      )}
    </div>
  );
}

export default Home;
