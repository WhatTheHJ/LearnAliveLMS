import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchAttendanceByDate,
  updateAttendanceState,
  updateAttendanceReason,
  deleteAttendance,
  addAttendance,
} from "../api/attendanceApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as XLSX from "xlsx";

const ManageAttendancePage = () => {
  const { classId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingReasonId, setEditingReasonId] = useState(null);
  const [newReason, setNewReason] = useState("");

  // ✅ 컬럼 정렬 상태
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });

  // ✅ 컬럼 순서 관리
  const [columns, setColumns] = useState([
    { id: "studentId", label: "학생 ID" },
    { id: "name", label: "이름" },
    { id: "university", label: "단과 대학" },
    { id: "department", label: "학과" },
    { id: "date", label: "날짜" },
    { id: "state", label: "출석 상태" },
    { id: "createdAt", label: "기록 시간" },
    { id: "updatedAt", label: "수정 시간" },
    { id: "reason", label: "사유" },
    { id: "actions", label: "삭제" },
  ]);

  // ✅ 드래그 상태
  const [draggedColumn, setDraggedColumn] = useState(null);
  const [dragTimer, setDragTimer] = useState(null);

  // ✅ 한국 시간(KST) 변환 함수
  const getKSTDate = (date) => {
    const localDate = new Date(date);
    localDate.setMinutes(localDate.getMinutes() - localDate.getTimezoneOffset());
    return localDate.toISOString().split("T")[0];
  };

  // ✅ 출석 데이터 불러오기
  const reloadAttendanceData = async () => {
    setIsLoading(true);
    try {
      const formattedDate = getKSTDate(selectedDate);
      const updatedData = await fetchAttendanceByDate(classId, formattedDate);
      setAttendanceData(updatedData);
    } catch (error) {
      console.error("출석 데이터를 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    reloadAttendanceData();
  }, [selectedDate, classId]);

  // ✅ 출석 상태(state) 변경
  const handleStateChange = async (attendanceId, studentId, newState) => {
    try {
      const formattedDate = getKSTDate(selectedDate);

      if (!attendanceId || attendanceId === 0) {
        await addAttendance(studentId, classId, formattedDate, newState);
      } else {
        await updateAttendanceState(attendanceId, newState);
      }

      reloadAttendanceData();
    } catch (error) {
      console.error("출석 상태 변경 실패:", error);
    }
  };

  // ✅ 사유(reason) 변경
  const handleReasonChange = async (attendanceId) => {
    if (!attendanceId || !newReason.trim()) return;
    try {
      await updateAttendanceReason(attendanceId, newReason);
      reloadAttendanceData();
      setEditingReasonId(null);
      setNewReason("");
    } catch (error) {
      console.error("출석 사유 변경 실패:", error);
    }
  };

  // ✅ 출석 데이터 삭제
  const handleDeleteAttendance = async (attendanceId) => {
    try {
      await deleteAttendance(attendanceId);
      reloadAttendanceData();
    } catch (error) {
      console.error("출석 삭제 실패:", error);
    }
  };

  // ✅ 컬럼 정렬 기능 (클릭)
  const handleSort = (key) => {
    setSortConfig((prev) => {
      if (prev.key === key) {
        return { key, direction: prev.direction === "asc" ? "desc" : "asc" };
      }
      return { key, direction: "asc" };
    });
  };

  // ✅ 정렬된 데이터 반환
  const sortedData = [...attendanceData].sort((a, b) => {
    if (!sortConfig.key) return 0;
    const aValue = a[sortConfig.key] || "";
    const bValue = b[sortConfig.key] || "";

    if (aValue < bValue) return sortConfig.direction === "asc" ? -1 : 1;
    if (aValue > bValue) return sortConfig.direction === "asc" ? 1 : -1;
    return 0;
  });

  // ✅ 드래그 시작 (1초 이상 눌렀을 때만 가능)
  const handleMouseDown = (index) => {
    setDragTimer(
      setTimeout(() => {
        setDraggedColumn(index);
      }, 1000)
    );
  };

  // ✅ 드래그 취소 (1초 안에 떼면 정렬 실행)
  const handleMouseUp = (index) => {
    clearTimeout(dragTimer);
    if (draggedColumn === null) {
      handleSort(columns[index].id);
    }
  };

  // ✅ 컬럼 드래그 중
  const handleDragOver = (e, index) => {
    e.preventDefault();
    if (draggedColumn === null || draggedColumn === index) return;
    const newColumns = [...columns];
    const movedColumn = newColumns.splice(draggedColumn, 1)[0];
    newColumns.splice(index, 0, movedColumn);
    setDraggedColumn(index);
    setColumns(newColumns);
  };

  // ✅ 엑셀 다운로드
  const handleDownloadExcel = () => {
    const exportData = sortedData.map((record) => {
      let rowData = {};
      columns.forEach(({ id, label }) => {
        rowData[label] =
          id === "state"
            ? record[id] === "present"
              ? "출석"
              : record[id] === "absent"
              ? "결석"
              : record[id] === "late"
              ? "지각"
              : record[id] === "excused"
              ? "공결"
              : "미등록"
            : record[id] || "미등록";
      });
      return rowData;
    });

    const worksheet = XLSX.utils.json_to_sheet(exportData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "출석 데이터");
    XLSX.writeFile(workbook, `출석_데이터_${getKSTDate(selectedDate)}.xlsx`);
  };

  return (
    <div>
      <h2>출석 관리</h2>
      <Calendar onChange={setSelectedDate} value={selectedDate} />

      {isLoading ? (
        <p>데이터 로딩 중...</p>
      ) : (
        <table border="1">
          <thead>
            <tr>
              {columns.map((column, index) => (
                <th
                  key={column.id}
                  draggable
                  onMouseDown={() => handleMouseDown(index)}
                  onMouseUp={() => handleMouseUp(index)}
                  onDragOver={(e) => handleDragOver(e, index)}
                  style={{
                    cursor: "pointer",
                    backgroundColor:
                      sortConfig.key === column.id ? "hotpink" : "lightgray",
                  }}
                >
                  {column.label} {sortConfig.key === column.id ? (sortConfig.direction === "asc" ? "🔼" : "🔽") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((record) => (
              <tr key={record.studentId}>
                {columns.map((column) => (
                  <td key={column.id}>{record[column.id] || "미등록"}</td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <button onClick={handleDownloadExcel}>엑셀 다운로드</button>
      <Link to="/"><button>메인으로 돌아가기</button></Link>
    </div>
  );
};

export default ManageAttendancePage;
