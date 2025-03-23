import { useState, useEffect, useMemo } from "react";
import { useAuth } from "../context/AuthContext";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as XLSX from "xlsx";
import { fetchAttendanceByStudent, fetchMonthlyAttendance } from "../api/attendanceApi";

// Chart.js 관련 import
import { Bar } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend);

const MyAttendance = () => {
  const { user } = useAuth();
  const userId = user?.userId;
  
  // 일별 테이블 관련 상태
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [dailyAttendanceData, setDailyAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  
  // 테이블 정렬 상태 (강의실, 출석 상태 정렬)
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "ascending" });
  
  // 월별 차트 관련 상태
  // 초기 chartMonth를 현재 달의 1일로 고정 (useMemo로 단 한 번 계산)
  const initialChartMonth = useMemo(() => {
    const d = new Date();
    d.setDate(1);
    return d;
  }, []);
  const [chartMonth, setChartMonth] = useState(initialChartMonth);
  const [monthlyStats, setMonthlyStats] = useState({
    present: 0,
    absent: 0,
    late: 0,
    excused: 0,
  });
  
  // 헬퍼 함수들
  const getFormattedDate = (date) => {
    const offset = date.getTimezoneOffset();
    const localDate = new Date(date.getTime() - offset * 60000);
    return localDate.toISOString().split("T")[0];
  };

  const getFormattedMonth = (date) => {
    return date.toISOString().substring(0, 7);
  };

  const getKoreanState = (state) => {
    const stateMap = {
      present: "출석",
      absent: "결석",
      late: "지각",
      excused: "공결",
    };
    return stateMap[state] || state;
  };

  // [일별 테이블] 선택한 날짜의 출석 데이터를 로드
  useEffect(() => {
    if (!userId) return;
    const loadDailyAttendance = async () => {
      setIsLoading(true);
      try {
        const formattedDate = getFormattedDate(selectedDate);
        const data = await fetchAttendanceByStudent(userId, formattedDate);
        setDailyAttendanceData(data || []);
      } catch (error) {
        console.error("일별 출석 데이터를 불러오는 중 오류 발생:", error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDailyAttendance();
  }, [userId, selectedDate]);

  // [월별 차트] 선택한 달(chartMonth)의 출석 데이터를 로드
  useEffect(() => {
    if (!userId) return;
    const loadMonthlyStats = async () => {
      try {
        const month = getFormattedMonth(chartMonth);
        const responseData = await fetchMonthlyAttendance(userId, month);
        console.log("월별 API 응답:", responseData);
        // 응답이 배열이면 그대로, 아니면 attendance 프로퍼티 또는 빈 배열 사용
        const data = Array.isArray(responseData)
          ? responseData
          : (responseData.attendance ? responseData.attendance : []);
        const stats = data.reduce(
          (acc, record) => {
            if (record.state === "present") acc.present++;
            else if (record.state === "absent") acc.absent++;
            else if (record.state === "late") acc.late++;
            else if (record.state === "excused") acc.excused++;
            return acc;
          },
          { present: 0, absent: 0, late: 0, excused: 0 }
        );
        setMonthlyStats(stats);
      } catch (error) {
        console.error("월별 출석 데이터를 불러오는 중 오류 발생:", error);
      }
    };
    loadMonthlyStats();
  }, [userId, chartMonth]);

  // 이전 달, 다음 달 이동 함수 (현재 chartMonth의 1일 기준으로 이동)
  const handlePrevMonth = () => {
    setChartMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() - 1, 1));
  };
  const handleNextMonth = () => {
    setChartMonth((prev) => new Date(prev.getFullYear(), prev.getMonth() + 1, 1));
  };

  // 테이블 정렬 핸들러
  const handleSort = (key) => {
    if (sortConfig.key === key) {
      setSortConfig({
        key,
        direction: sortConfig.direction === "ascending" ? "descending" : "ascending",
      });
    } else {
      setSortConfig({ key, direction: "ascending" });
    }
  };

  const sortedDailyData = [...dailyAttendanceData];
  if (sortConfig.key !== null) {
    sortedDailyData.sort((a, b) => {
      const aVal = a[sortConfig.key] ? a[sortConfig.key].toString() : "";
      const bVal = b[sortConfig.key] ? b[sortConfig.key].toString() : "";
      const comparison = aVal.localeCompare(bVal, "ko", { numeric: true });
      return sortConfig.direction === "ascending" ? comparison : -comparison;
    });
  }

  // 월별 차트 데이터 생성 (출석, 결석, 지각, 공결)
  const monthlyChartData = {
    labels: ["출석", "결석", "지각", "공결"],
    datasets: [
      {
        label: "출결 통계",
        data: [monthlyStats.present, monthlyStats.absent, monthlyStats.late, monthlyStats.excused],
        backgroundColor: [
          "rgba(75, 192, 192, 0.5)",
          "rgba(255, 99, 132, 0.5)",
          "rgba(255, 206, 86, 0.5)",
          "rgba(255, 150, 86, 0.5)",
        ],
        borderColor: [
          "rgba(75, 192, 192, 1)",
          "rgba(255, 99, 132, 1)",
          "rgba(255, 206, 86, 1)",
          "rgba(255, 150, 86, 1)",
        ],
        borderWidth: 1,
      },
    ],
  };

  // 차트 옵션: 범례에 각 항목과 값을 표시하며, 제목에 현재 chartMonth(YYYY-MM) 표시
  const chartOptions = {
    responsive: true,
    plugins: {
      legend: {
        position: "right",
        labels: {
          generateLabels: (chart) => {
            const dataset = chart.data.datasets[0];
            return chart.data.labels.map((label, index) => ({
              text: `${label}: ${dataset.data[index]}`,
              fillStyle: dataset.backgroundColor[index],
              strokeStyle: dataset.borderColor[index],
              hidden: false,
              index: index,
            }));
          },
        },
      },
      title: {
        display: true,
        text: `월별 출결 통계 (${getFormattedMonth(chartMonth)})`,
      },
    },
    scales: {
      y: {
        beginAtZero: true,
        ticks: { precision: 0 },
      },
    },
  };

  // 엑셀 다운로드 (일별 테이블 데이터를 기준)
  const handleDownloadExcel = () => {
    const excelData = dailyAttendanceData.map((record) => ({
      "학번": record.studentId,
      "이름": record.name,
      "강의실": record.className,
      "날짜": record.date,
      "출석 상태": getKoreanState(record.state),
      "기록 시간": record.createdAt,
    }));
    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `attendance_${getFormattedDate(selectedDate)}.xlsx`);
  };

  return (
    <div className="container">
      <h2>내 출석 현황</h2>
      
      {/* 상단 영역: 캘린더와 월별 차트 */}
      <div>
        <Calendar onChange={setSelectedDate} value={selectedDate} locale="ko-KR" />
      </div>
      <div>
        <h3>월별 출결 통계</h3>
        <div style={{ display: "flex", justifyContent: "center", alignItems: "center", marginBottom: "20px" }}>
          <button onClick={handlePrevMonth} style={{ marginRight: "10px", padding: "8px 16px", cursor: "pointer" }}>
            이전 달
          </button>
          <span style={{ margin: "0 10px" }}>{getFormattedMonth(chartMonth)}</span>
          <button onClick={handleNextMonth} style={{ padding: "8px 16px", cursor: "pointer" }}>
            다음 달
          </button>
        </div>
        <div style={{ width: "600px", margin: "20px auto" }}>
          <Bar data={monthlyChartData} options={chartOptions} />
        </div>
      </div>
      
      {/* 하단 영역: 일별 테이블 및 엑셀 다운로드 */}
      <div>
        <h3>출석 내역 (일별)</h3>
        {isLoading ? (
          <p>데이터를 불러오는 중...</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>학번</th>
                <th>이름</th>
                <th onClick={() => handleSort("className")} style={{ cursor: "pointer" }}>
                  강의실 {sortConfig.key === "className" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
                <th>날짜</th>
                <th onClick={() => handleSort("state")} style={{ cursor: "pointer" }}>
                  출석 상태 {sortConfig.key === "state" && (sortConfig.direction === "ascending" ? "▲" : "▼")}
                </th>
              </tr>
            </thead>
            <tbody>
              {sortedDailyData.length > 0 ? (
                sortedDailyData.map((record, index) => (
                  <tr key={record.classId || `${record.studentId}_${index}`}>
                    <td>{record.studentId}</td>
                    <td>{record.name}</td>
                    <td>{record.className}</td>
                    <td>{record.date}</td>
                    <td>{getKoreanState(record.state)}</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5">출석 정보가 없습니다.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
        <button onClick={handleDownloadExcel} style={{ marginTop: "20px", padding: "8px 16px", cursor: "pointer" }}>
          엑셀 다운로드
        </button>
      </div>
    </div>
  );
};

export default MyAttendance;