import { useState, useEffect } from "react";
import { getProjectMembers, deleteProjectMember } from "../api/teamActivityApi";
import { getStudentById } from "../api/studentApi";
import { useAuth } from "../context/AuthContext";

const ApprovedMembers = ({ postId, onBack, post }) => {
  const [members, setMembers] = useState([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    fetchMembers();
  }, [postId]);

  const fetchMembers = async () => {
    setLoading(true);
    try {
      const data = await getProjectMembers(postId);
      let updatedMembers = data;
      // 만약 post 정보가 전달되면, 작성자 정보가 목록에 포함되어 있는지 확인 후, 없으면 student 테이블에서 최신 정보를 가져와 추가합니다.
      if (post) {
        const authorExists = data.some(
          (member) => member.studentId === post.authorId
        );
        if (!authorExists) {
          // 작성자의 정보를 student 테이블에서 가져옵니다.
          const authorInfo = await getStudentById(post.authorId);
          updatedMembers = [
            {
              studentId: authorInfo.studentId,
              name: authorInfo.name,
              department: authorInfo.department,
              email: authorInfo.email,
              contact: authorInfo.phone, // student 테이블의 phone 컬럼을 연락처로 사용한다고 가정
              memberId: "author" // 임시 ID
            },
            ...data,
          ];
        }
      }
      setMembers(updatedMembers);
    } catch (error) {
      console.error("멤버 정보를 불러오는 중 오류 발생:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteMember = async (memberId) => {
    if (!window.confirm("정말 이 멤버를 삭제하시겠습니까?")) return;
    try {
      await deleteProjectMember(memberId);
      setMembers((prev) => prev.filter((member) => member.memberId !== memberId));
    } catch (error) {
      console.error("멤버 삭제 오류:", error);
    }
  };

  if (loading) return <p>멤버 정보를 불러오는 중...</p>;
  if (members.length === 0) return <p>등록된 멤버가 없습니다.</p>;

  return (
    <div>
      <h3>승인된 멤버 목록</h3>
      <button onClick={onBack}>뒤로가기</button>
      <table border="1" cellPadding="8" cellSpacing="0">
        <thead>
          <tr>
            <th>순서</th>
            <th>역할</th>
            <th>학번</th>
            <th>이름</th>
            <th>학과</th>
            <th>이메일</th>
            <th>연락처</th>
            {(user?.role === "professor" || user?.userId === post?.authorId) && (
              <th>액션</th>
            )}
          </tr>
        </thead>
        <tbody>
          {members.map((member, index) => {
            // post가 존재하고, member의 학번이 post 작성자와 일치하면 "조장", 그 외는 "조원"
            const role = post && member.studentId === post.authorId ? "조장" : "조원";
            return (
              <tr key={member.memberId || member.studentId}>
                <td>{index + 1}</td>
                <td>{role}</td>
                <td>{member.studentId}</td>
                <td>{member.name}</td>
                <td>{member.department}</td>
                <td>{member.email}</td>
                <td>{member.contact}</td>
                {(user?.role === "professor" || user?.userId === post?.authorId) && (
                  <td>
                    <button onClick={() => handleDeleteMember(member.memberId)}>
                      삭제
                    </button>
                  </td>
                )}
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
};

export default ApprovedMembers;