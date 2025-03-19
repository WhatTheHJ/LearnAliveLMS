// import { useState } from "react";
// import axios from "axios";

// const FindAccountModal = ({ onClose }) => {
//   const [name, setName] = useState("");
//   const [email, setEmail] = useState("");
//   const [userId, setUserId] = useState("");
//   const [phone, setPhone] = useState("");
//   const [idInput, setIdInput] = useState("");
//   const [newPassword, setNewPassword] = useState("");
//   const [resetMessage, setResetMessage] = useState("");
//   const [findIdMessage, setFindIdMessage] = useState("");

//   // 아이디 찾기 기능 수정: 실패 시 모달 내에 메시지 출력
//   const handleFindId = async () => {
//     if (!name || !email) {
//       setFindIdMessage("이름과 이메일을 입력하세요.");
//       return;
//     }
//     try {
//       const response = await axios.post("http://localhost:8080/api/professors/find-id", {
//         name,
//         email,
//       });
//       const { success, userId } = response.data;
//       if (success) {
//         setUserId(userId);
//         setFindIdMessage(""); // 성공 시 메시지 초기화
//       } else {
//         setFindIdMessage("일치하는 ID가 없습니다, 올바른 정보를 입력해주세요.");
//       }
//     } catch (error) {
//       if (error.response && error.response.status === 404) {
//         setFindIdMessage("일치하는 ID가 없습니다, 올바른 정보를 입력해주세요.");
//       } else {
//         setFindIdMessage("아이디 찾기 중 오류가 발생했습니다.");
//       }
//       // console.error 호출 제거해서 콘솔에 에러가 출력되지 않도록 함.
//     }
//   };
  

//   // 비밀번호 재설정 기능
//   const handleResetPassword = async () => {
//     if (!idInput || !name || !phone || !newPassword) {
//       alert("아이디, 이름, 전화번호와 새 비밀번호를 입력하세요.");
//       return;
//     }
//     try {
//       const response = await axios.post("http://localhost:8080/api/professors/reset-password", {
//         userId: idInput,
//         name,
//         phone,
//         newPassword,
//       });
//       const { success } = response.data;
//       if (success) {
//         setResetMessage("비밀번호가 성공적으로 재설정되었습니다.");
//       } else {
//         alert("해당 정보로 비밀번호 재설정에 실패했습니다.");
//       }
//     } catch (error) {
//       console.error("비밀번호 재설정 오류:", error);
//     }
//   };

//   return (
//     <div style={styles.modalOverlay}>
//       <div style={styles.modalContent}>
//         <button onClick={onClose} style={styles.closeButton}>✖</button>
//         <h2>회원정보 찾기</h2>

//         {/* 아이디 찾기 섹션 */}
//         <div style={styles.section}>
//           <h3>아이디 찾기</h3>
//           <input
//             type="text"
//             placeholder="이름"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="email"
//             placeholder="이메일"
//             value={email}
//             onChange={(e) => setEmail(e.target.value)}
//             style={styles.input}
//           />
//           <button onClick={handleFindId} style={styles.button}>아이디 찾기</button>
//           {userId && <p>찾은 아이디: <strong>{userId}</strong></p>}
//           {/* 아이디가 없고, 오류 메시지가 있을 경우 표시 */}
//           {!userId && findIdMessage && <p style={{ color: "red" }}>{findIdMessage}</p>}
//         </div>

//         {/* 비밀번호 재설정 섹션 */}
//         <div style={styles.section}>
//           <h3>비밀번호 재설정</h3>
//           <input
//             type="text"
//             placeholder="아이디"
//             value={idInput}
//             onChange={(e) => setIdInput(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="text"
//             placeholder="이름"
//             value={name}
//             onChange={(e) => setName(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="text"
//             placeholder="전화번호"
//             value={phone}
//             onChange={(e) => setPhone(e.target.value)}
//             style={styles.input}
//           />
//           <input
//             type="password"
//             placeholder="새 비밀번호"
//             value={newPassword}
//             onChange={(e) => setNewPassword(e.target.value)}
//             style={styles.input}
//           />
//           <button onClick={handleResetPassword} style={styles.button}>비밀번호 재설정</button>
//           {resetMessage && <p>{resetMessage}</p>}
//         </div>
//       </div>
//     </div>
//   );
// };

// export default FindAccountModal;

// const styles = {
//   modalOverlay: {
//     position: "fixed",
//     top: 0,
//     left: 0,
//     width: "100%",
//     height: "100%",
//     backgroundColor: "rgba(0, 0, 0, 0.5)",
//     display: "flex",
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   modalContent: {
//     backgroundColor: "#fff",
//     padding: "15px",
//     borderRadius: "8px",
//     width: "320px",
//     textAlign: "center",
//     position: "relative",
//   },
//   closeButton: {
//     position: "absolute",
//     top: "5px",
//     right: "5px",
//     background: "none",
//     border: "none",
//     fontSize: "16px",
//     cursor: "pointer",
//   },
//   section: {
//     marginBottom: "12px",
//   },
//   input: {
//     width: "100%",
//     padding: "6px",
//     margin: "4px 0",
//   },
//   button: {
//     width: "100%",
//     padding: "8px",
//     marginTop: "8px",
//     backgroundColor: "#007bff",
//     color: "#fff",
//     border: "none",
//     cursor: "pointer",
//   },
// };