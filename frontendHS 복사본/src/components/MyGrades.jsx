// import { useState, useEffect } from "react";
// import { useAuth } from "../context/AuthContext";
// import { fetchClassrooms } from "../api/classroomApi";

// const MyGrades = () => {
//   const { user } = useAuth();
//   const userId = user?.userId; // 로그인한 사용자의 아이디

//   const [classrooms, setClassrooms] = useState([]);
//   const [isLoading, setIsLoading] = useState(false);
//   const [error, setError] = useState("");

//   // 강의실 목록 데이터 로드 (사용자에 해당하는 강의실)
//   useEffect(() => {
//     if (!userId) return;

//     const loadClassrooms = async () => {
//       setIsLoading(true);
//       try {
//         const data = await fetchClassrooms(userId);
//         setClassrooms(data);
//       } catch (err) {
//         console.error("강의실 목록을 불러오는 중 오류 발생:", err);
//         setError("강의실 목록을 불러오는 중 오류가 발생했습니다.");
//       } finally {
//         setIsLoading(false);
//       }
//     };

//     loadClassrooms();
//   }, [userId]);

//   return (
//     <div className="container">
//       <h2>성적 조회</h2>
//       {isLoading ? (
//         <p>데이터를 불러오는 중...</p>
//       ) : error ? (
//         <p>{error}</p>
//       ) : classrooms && classrooms.length > 0 ? (
//         <table>
//           <thead>
//             <tr>
//               <th>강의실 이름</th>
//               <th>점수</th>
//               <th>등급</th>
//             </tr>
//           </thead>
//           <tbody>
//             {classrooms.map((classroom, index) => (
//               <tr key={index}>
//                 <td>{classroom.className}</td>
//                 <td>{classroom.className}</td>
//                 <td>{classroom.className}</td>
//               </tr>
//             ))}
//           </tbody>
//         </table>
//       ) : (
//         <p>조회된 강의실 정보가 없습니다.</p>
//       )}
//     </div>
//   );
// };

// export default MyGrades;
