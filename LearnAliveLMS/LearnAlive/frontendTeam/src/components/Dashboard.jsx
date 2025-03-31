import ClassroomList from "../components/ClassroomList";
import Notice from "../components/Notice";

const Dashboard = () => {
    return (
      <div style={styles.dashboardContainer}>
        <div style={styles.noticeSection}>
          <Notice />
        </div>
        <div style={styles.classroomSection}>
          <ClassroomList />
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
        backgroundColor: '#fff',  // 배경색을 살짝 회색으로 설정
        borderRadius: '8px',         // 모서리를 둥글게 설정
        paddingRight: '20px',
        paddingLeft: '20px',          // 클래스리스트 섹션 안의 여백
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 섹션에 약간의 그림자 추가
      },
      noticeSection: {
        flex: 1,                    // 공지사항 섹션도 화면의 50% 이상을 차지하도록 설정
        backgroundColor: '#fff',     // 배경색을 흰색으로 설정
        borderRadius: '8px',         // 모서리를 둥글게 설정
        paddingRight: '20px',
        paddingLeft: '20px',               // 공지사항 섹션 안의 여백
        boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)', // 섹션에 약간의 그림자 추가
      },
};

export default Dashboard;