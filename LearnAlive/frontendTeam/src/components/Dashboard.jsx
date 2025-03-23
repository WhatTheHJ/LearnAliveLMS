import ClassroomList from "../components/ClassroomList";
import Notice from "../components/Notice";

const Dashboard = () => {
    return (
      <div style={styles.dashboardContainer}>
        <div style={styles.classroomSection}>
          <ClassroomList />
        </div>
        <div style={styles.noticeSection}>
          <Notice />
        </div>
      </div>
    );
  };

  const styles ={
    dashboardContainer: {
        display: 'flex',              // 두 섹션을 나란히 배치하기 위해 flexbox 사용
        justifyContent: 'space-between', // 각 섹션 사이에 여백을 추가
        gap: '20px',                  // 섹션 간 간격을 설정
        padding: '20px',              // 대시보드 전체 여백
      },
      classroomSection: {
        flex: 1,                    // 클래스리스트 섹션이 화면의 50% 이상을 차지하도록 설정
        backgroundColor: '#f4f4f4',  // 배경색을 살짝 회색으로 설정
        borderRadius: '8px',         // 모서리를 둥글게 설정
        padding: '20px',              // 클래스리스트 섹션 안의 여백
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 섹션에 약간의 그림자 추가
      },
      noticeSection: {
        flex: 1,                    // 공지사항 섹션도 화면의 50% 이상을 차지하도록 설정
        backgroundColor: '#fff',     // 배경색을 흰색으로 설정
        borderRadius: '8px',         // 모서리를 둥글게 설정
        padding: '20px',              // 공지사항 섹션 안의 여백
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 섹션에 약간의 그림자 추가
      },
      classroomTitle: {
        fontSize: '1.5rem',          // 제목 크기 조정
        fontWeight: 'bold',          // 제목을 굵게
        marginBottom: '20px',        // 제목 아래에 여백 추가
      },
      noticeTitle: {
        fontSize: '1.5rem',          // 제목 크기 조정
        fontWeight: 'bold',          // 제목을 굵게
        marginBottom: '20px',        // 제목 아래에 여백 추가
      },
      classroomList: {
        listStyleType: 'none',      // 목록 스타일 제거
        padding: 0,                 // 목록 내 기본 패딩 제거
      },
      noticeList: {
        listStyleType: 'none',      // 목록 스타일 제거
        padding: 0,                 // 목록 내 기본 패딩 제거
      },
      classroomItem: {
        padding: '10px',              // 목록 항목의 여백
        borderBottom: '1px solid #ddd', /* 항목 아래에 구분선 추가 */
      },
      noticeItem: {
        padding: '10px',              // 목록 항목의 여백
        borderBottom: '1px solid #ddd', /* 항목 아래에 구분선 추가 */
      },
      buttonGroup: {
        display: 'flex',              // 버튼을 나란히 배치
        gap: '10px',                  // 버튼 간 간격 추가
        marginTop: '20px',           // 버튼 그룹 위에 여백 추가
      },
      button: {
        padding: '10px 15px',         // 버튼 여백
        backgroundColor: '#007bff',  // 파란색 버튼 배경
        color: 'white',               // 버튼 글자색을 흰색으로 설정
        border: 'none',               // 버튼 테두리 제거
        borderRadius: '4px',         // 버튼 모서리 둥글게 설정
        cursor: 'pointer',           // 버튼 클릭 시 커서 손 모양
        transition: 'background-color 0.3s ease', /* 버튼 배경색 전환 효과 */
      },
      buttonHover: {
        backgroundColor: '#0056b3',  // 버튼에 마우스를 올렸을 때 색상 변경
      },
      noticeDate: {
        fontSize: '0.9rem',           // 날짜 크기 조정
        color: 'gray',                 // 날짜 텍스트 색상
      },

};

export default Dashboard;