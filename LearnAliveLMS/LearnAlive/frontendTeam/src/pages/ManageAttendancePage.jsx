import { useState, useEffect } from "react";
import { useParams, Link } from "react-router-dom";
import {
  fetchAttendanceByDate,
  updateAttendanceState,
  updateAttendanceReason,
  deleteAttendance,
  addAttendance
} from "../api/attendanceApi";
import Calendar from "react-calendar";
import "react-calendar/dist/Calendar.css";
import * as XLSX from "xlsx";
import "../styles.css";

const ManageAttendancePage = () => {
  const { classId } = useParams();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [attendanceData, setAttendanceData] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [editingReasonId, setEditingReasonId] = useState(null);
  const [newReason, setNewReason] = useState("");
  const [sortConfig, setSortConfig] = useState({ key: null, direction: "asc" });


  // ✅ 기존에 선택한 날짜 가져오기 (없으면 오늘 날짜)
  useEffect(() => {
    const storedDate = localStorage.getItem("selectedDate");
    if (storedDate) {
      // ✅ 슬래시 포맷으로 안전하게 파싱
      setSelectedDate(new Date(storedDate));
    } else {
      setSelectedDate(new Date());
    }
  }, []);
  

  useEffect(() => {
    if (selectedDate) {
      console.log("✅ 최종적으로 호출하는 날짜:", selectedDate);
      reloadAttendanceData();
    }
  }, [selectedDate, classId]);

  // ✅ 컬럼 리스트 (사용자가 보는 화면과 동일한 순서)
  const [columns, setColumns] = useState([
    { id: "university", label: "단과 대학" },
    { id: "department", label: "학과" },
    { id: "studentId", label: "학번" },
    { id: "name", label: "이름" },
    { id: "remarks", label: "비고" }, // ✅ 수정 불가 (정렬 전용)
    { id: "state", label: "출석 상태" },
    { id: "createdAt", label: "기록 시간" },
    { id: "updatedAt", label: "수정 시간" },
    { id: "reason", label: "사유" },
    { id: "actions", label: "삭제" },
  ]);

  const getKSTDate = (date) => {
    if (!date) return "";
    const raw = typeof date === 'string' ? date.replace(/-/g, '/') : date;
    const parsedDate = new Date(raw);
    if (isNaN(parsedDate.getTime())) {
      return "";
    }
  
    const year = parsedDate.getFullYear();
    const month = String(parsedDate.getMonth() + 1).padStart(2, '0');
    const day = String(parsedDate.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  };
  
  
  const reloadAttendanceData = async () => {
    setIsLoading(true);
    try {
      const formattedDate = getKSTDate(selectedDate);
      if (!formattedDate) {
        console.error("날짜 포맷 오류로 서버 요청 중단");
        return;
      }
      const updatedData = await fetchAttendanceByDate(classId, formattedDate);
      setAttendanceData(updatedData);
    } catch (error) {
      console.error("출석 데이터를 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleDateChange = (date) => {
    console.log("✅ 캘린더에서 선택된 date 객체:", date);
  
    // ✅ YYYY/MM/DD 형식으로 변환 (모든 브라우저 안전)
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const formattedDate = `${year}/${month}/${day}`;
  
    console.log("✅ 저장하는 날짜 (YYYY/MM/DD):", formattedDate);
  
    // ✅ localStorage에도 YYYY/MM/DD로 저장
    localStorage.setItem("selectedDate", formattedDate);
  
    // ✅ new Date(formattedDate)로 확실히 Date 객체 만들어 저장
    setSelectedDate(new Date(formattedDate));
  };
  
  
  const safeDateParse = (value) => {
    if (!value) return "미등록";
    const raw = value.includes('T') ? value : `${value}T00:00:00`;
    const parsed = new Date(raw);
    return isNaN(parsed.getTime()) ? "미등록" : parsed.toLocaleString("ko-KR");
  };
  
  

  // ✅ 컬럼 정렬 기능 추가
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

  const getKSTDateTime = (date) => {
    if (!date) return "";
    const parsedDate = new Date(date);
    if (isNaN(parsedDate.getTime())) return "";  // Invalid Date 방어
    parsedDate.setMinutes(parsedDate.getMinutes() - parsedDate.getTimezoneOffset());
    return parsedDate.toISOString().replace("T", " ").split(".")[0];
  };
  
  
  

  const handleStateChange = async (attendanceId, studentId, newState) => {
    try {
      const formattedDate = getKSTDate(selectedDate);
  
      if (!attendanceId || attendanceId === 0) {
        // ✅ 새로운 출석 데이터 추가
        await addAttendance(studentId, classId, formattedDate, newState);
  
        // ✅ 새로고침 없이 최신 데이터 반영
      await reloadAttendanceData(); 
      } else {
        // ✅ 기존 출석 데이터 업데이트
        await updateAttendanceState(attendanceId, newState);
  
        setAttendanceData((prevData) =>
          prevData.map((record) =>
            record.attendanceId === attendanceId
              ? { ...record, state: newState, updatedAt: getKSTDateTime(new Date()) }
              : record
          )
        );
      }
    } catch (error) {
      console.error("출석 상태 변경 실패:", error);
    }
  };
  
  
  const handleEditReason = (attendanceId, currentReason) => {
    setEditingReasonId(attendanceId);
    setNewReason(currentReason || ""); // 기존 값 유지
  };

  const handleReasonChange = async (attendanceId) => {
    if (!attendanceId || !newReason.trim()) {
      console.error("사유 수정 실패: attendanceId 또는 newReason 값이 없음");
      return;
    }
  
    try {
      await updateAttendanceReason(attendanceId, newReason);
  
      // ✅ 특정 행만 업데이트 (전체 새로고침 X)
      setAttendanceData((prevData) =>
        prevData.map((record) =>
          record.attendanceId === attendanceId
            ? { ...record, reason: newReason, updatedAt: getKSTDateTime(new Date()) }
            : record
        )
      );
  
      setEditingReasonId(null);
      setNewReason("");
    } catch (error) {
      console.error("사유 변경 실패:", error);
    }
  };
  
  const handleCancelReasonEdit = () => {
    setEditingReasonId(null);
    setNewReason(""); // 입력 값 초기화
  };
  
  const handleDeleteReason = async (attendanceId) => {
    try {
      await updateAttendanceReason(attendanceId, "미등록"); // "미등록"으로 초기화
  
      // ✅ 특정 행의 reason을 "미등록"으로 업데이트
      setAttendanceData((prevData) =>
        prevData.map((record) =>
          record.attendanceId === attendanceId
            ? { ...record, reason: "미등록", updatedAt: getKSTDateTime(new Date()) }
            : record
        )
      );
  
      // ✅ 입력 창도 비우기 (현재 수정 중인 attendanceId가 동일한 경우만)
      if (editingReasonId === attendanceId) {
        setNewReason("");
      }
    } catch (error) {
      console.error("사유 삭제 실패:", error);
    }
  };
  
  

  const handleDeleteAttendance = async (attendanceId, studentId) => {
    try {
      await deleteAttendance(attendanceId);
  
      // ✅ 목록에서 제거하는 것이 아니라 기본 상태로 초기화
      setAttendanceData((prevData) =>
        prevData.map((record) =>
          record.attendanceId === attendanceId
            ? {
                ...record,
                attendanceId: 0, // ID를 0으로 초기화 (새로운 출석을 기록 가능하게 함)
                state: "absent",
                reason: "미등록",
                createdAt: "",
                updatedAt: "",
              }
            : record
        )
      );
    } catch (error) {
      console.error("출석 삭제 실패:", error);
    }
  };
  
  

  const handleDownloadExcel = () => {
    const excelData = sortedData.map((record) => ({
      "단과 대학": record.university,
      "학과": record.department,
      "학번": record.studentId,
      "이름": record.name,
      "비고": record.remarks,
      "출석 상태":
        record.state === "present"
          ? "출석"
          : record.state === "absent"
          ? "결석"
          : record.state === "late"
          ? "지각"
          : "공결",
          "기록 시간": safeDateParse(record.createdAt),
          "수정 시간": safeDateParse(record.updatedAt),
      "사유": record.reason,
    }));

    const worksheet = XLSX.utils.json_to_sheet(excelData);
    const workbook = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(workbook, worksheet, "Attendance");
    XLSX.writeFile(workbook, `attendance_${getKSTDate(selectedDate)}.xlsx`);
  };

  return (
    <div className="post-container">
      <h2 className="title-bar">👨‍🏫 출석 관리</h2>
      <Calendar 
        onChange={handleDateChange} 
        value={selectedDate}
        locale="ko-KR"  // ✅ 한국어 로케일 적용
        calendarType="gregory"  // ✅ 일요일부터 시작하도록 강제 설정
        tileClassName={({ date, view }) => {
          if (view === "month") {
            const day = date.getDay();
            return [
              "calendar-tile", 
              day === 0 || day === 6 ? "weekend" : "",  // ✅ 주말 빨간색
              date.getMonth() !== selectedDate.getMonth() ? "neighboring-month" : "" // ✅ 지난달 / 다음달 날짜 회색
            ].join(" ");
          }
        }} 
      />
      <button onClick={handleDownloadExcel}>엑셀 다운로드</button>
      <Link to="/">
        <button>메인으로 돌아가기</button>
      </Link>
  
      {isLoading ? (
        <p className="loading-text">데이터 로딩 중...</p>
      ) : (
        <table>
          <thead>
            <tr>
              {columns.map((column) => (
                <th key={column.id} onClick={() => handleSort(column.id)}>
                  {column.label} {sortConfig.key === column.id ? (sortConfig.direction === "asc" ? "🔼" : "🔽") : ""}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {sortedData.map((record) => (
              <tr key={record.studentId}>
                {columns.map((column) => (
                  <td key={column.id}>
                    {column.id === "state" ? (
                      <select
                      value={record.state}
                      onChange={(e) => handleStateChange(record.attendanceId, record.studentId, e.target.value)}
                      style={{
                        color:
                          record.state === "present"
                            ? "blue"
                            : record.state === "absent"
                            ? "red"
                            : record.state === "late"
                            ? "black"
                            : "hotpink",
                        fontWeight: "bold",
                        padding: "5px",
                        borderRadius: "4px",
                        border: "1px solid #ccc",
                      }}
                    >
                      <option value="present" style={{ color: "blue" }}>출석</option>
                      <option value="absent" style={{ color: "red" }}>결석</option>
                      <option value="late" style={{ color: "black" }}>지각</option>
                      <option value="excused" style={{ color: "hotpink" }}>공결</option>
                    </select>
                                      
                    ) : column.id === "reason" ? (
                      editingReasonId === record.attendanceId ? (
                        <>
                          <input
                            type="text"
                            value={newReason}
                            onChange={(e) => setNewReason(e.target.value)}
                          />
                          <button className="button-edit" onClick={() => handleReasonChange(record.attendanceId)}>
                            저장
                          </button>
                          <button className="button-cancel" onClick={handleCancelReasonEdit}>
                            취소
                          </button>
                          <button className="button-delete" onClick={() => handleDeleteReason(record.attendanceId)}>
                            삭제
                          </button>
                        </>
                      ) : (
                        <>
                          {record.reason || "없음"}
                          <button className="button-edit" onClick={() => handleEditReason(record.attendanceId, record.reason)}>수정</button>
                          </>)
                    ) : column.id === "actions" ? (
                      <button className="button-delete" onClick={() => handleDeleteAttendance(record.attendanceId)}>삭제</button>
                    ) : (column.id === 'createdAt' || column.id === 'updatedAt' || column.id === 'date') ? (
                      (record[column.id])
                    ) : (
                      record[column.id] || "미등록"
                    )}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div> // ✅ 최종적으로 닫기
  );
}
  export default ManageAttendancePage;
  