import { useState, useEffect } from "react";
import { 
  getTeamActivityApplications, 
  approveTeamActivityApplication, 
  rejectTeamActivityApplication 
} from "../api/teamActivityApi";

const ApplicationApproval = ({ postId, onBack }) => {
  const [applications, setApplications] = useState([]);
  const [loading, setLoading] = useState(true);

  // 상태값을 한글로 매핑
  const statusMapping = {
    PENDING: "대기",
    APPROVED: "승인",
    REJECTED: "거절"
  };

  useEffect(() => {
    fetchApplications();
  }, [postId]);

  const fetchApplications = async () => {
    setLoading(true);
    try {
      const data = await getTeamActivityApplications(postId);
      setApplications(data);
    } catch (error) {
      console.error("신청 목록 조회 오류:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleApprove = async (applicationId) => {
    try {
      await approveTeamActivityApplication(applicationId);
      alert("신청이 승인되었습니다.");
      fetchApplications();
    } catch (error) {
      console.error("승인 오류:", error);
    }
  };

  const handleReject = async (applicationId) => {
    try {
      await rejectTeamActivityApplication(applicationId);
      alert("신청이 거절되었습니다.");
      fetchApplications();
    } catch (error) {
      console.error("거절 오류:", error);
    }
  };

  if (loading) return <p>신청 목록을 불러오는 중...</p>;

  return (
    <div>
      <h3>참가 신청 목록</h3>
      <button onClick={onBack}>목록으로 돌아가기</button>
      {applications.length === 0 ? (
        <p>신청된 참가자가 없습니다.</p>
      ) : (
        <ul>
          {applications.map((app) => (
            <li key={app.applicationId}>
              <p>
                신청자: {app.applicantStudentId} | 상태: {statusMapping[app.status] || app.status}
              </p>
              {app.status === "PENDING" && (
                <>
                  <button onClick={() => handleApprove(app.applicationId)}>
                    승인
                  </button>
                  <button onClick={() => handleReject(app.applicationId)}>
                    거절
                  </button>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default ApplicationApproval;