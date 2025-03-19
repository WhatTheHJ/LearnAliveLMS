import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// ✅ AuthContext 생성
export const AuthContext = createContext(null);

// ✅ AuthProvider 유지!
export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ 학생 로그인 (비밀번호 없음)
  const loginStudent = async (userId) => {
    try {
      console.log("📌 학생 로그인 시도:", userId);
      const response = await axios.get(`http://localhost:8080/api/auth/${userId}`);
      const userData = response.data;

      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ 학생 로그인 성공:", userData);
    } catch (error) {
      console.error("📌 학생 로그인 실패:", error.response?.data || error.message);
      alert("등록된 학번이 없습니다. 학번을 확인해주세요. 지속적인 문제 발생 시 관리자에게 문의하세요.(2024010085@korea.ac.kr)");
    }
  };

  // ✅ 교수자 로그인 (비밀번호 필요)
  const loginProfessor = async (userId, password) => {
    try {
      console.log("📌 교수자 로그인 요청 보냄:", { userId, password });
      const response = await axios.post("http://localhost:8080/api/auth/professor-login", {
        userId,
        password,
      });

      const userData = response.data;
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
      console.log("✅ 교수자 로그인 성공:", userData);
    } catch (error) {
      console.error("📌 교수자 로그인 실패:", error.response?.data || error.message);
      alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  // ✅ 로그인 함수 (학생 & 교수자 분리)
  const login = (userId, password = null) => {
    if (password) {
      return loginProfessor(userId, password);
    } else {
      return loginStudent(userId);
    }
  };

  // ✅ 로그아웃
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    console.log("✅ 로그아웃 완료");
  };

  console.log("📌 AuthProvider가 제공하는 값:", { user, setUser, login, loginProfessor, logout });

  return (
    <AuthContext.Provider value={{ user, setUser, login, loginProfessor, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ✅ useAuth 훅 제공
export const useAuth = () => useContext(AuthContext);







// import { createContext, useContext, useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";

// // ✅ AuthContext 생성
// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   useEffect(() => {
//     const storedUser = sessionStorage.getItem("user");
//     if (storedUser) {
//       setUser(JSON.parse(storedUser));
//     }
//   }, []);

//   // ✅ 통합 로그인 (학생, 교수, 관리자)
//   const login = async (userId, password) => {
//     try {
//       console.log("📌 로그인 요청:", { userId, password });

//       const response = await axios.post("http://localhost:8080/api/auth/login", {
//         userId,
//         password,
//       });

//       const userData = response.data;
//       setUser(userData);
//       sessionStorage.setItem("user", JSON.stringify(userData));
//       console.log("✅ 로그인 성공:", userData);
//     } catch (error) {
//       console.error("📌 로그인 실패:", error.response?.data || error.message);
//       alert(error.response?.data?.message || "로그인 실패. 아이디와 비밀번호를 확인하세요.");
//     }
//   };

//   // ✅ 로그아웃
//   const logout = () => {
//     setUser(null);
//     sessionStorage.removeItem("user");
//     console.log("✅ 로그아웃 완료");
//   };

//   console.log("📌 AuthProvider가 제공하는 값:", { user, login, logout });

//   return (
//     <AuthContext.Provider value={{ user, login, logout, setUser }}>
//       {children}
//     </AuthContext.Provider>
//   );
// };

// export default AuthProvider;

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// // ✅ useAuth 훅 제공
// export const useAuth = () => useContext(AuthContext);