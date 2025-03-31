// import { createContext, useContext, useState, useEffect } from "react";
// import PropTypes from "prop-types";
// import axios from "axios";

// // ✅ AuthContext 생성
// export const AuthContext = createContext(null);

// export const AuthProvider = ({ children }) => {
//   const [user, setUser] = useState(null);

//   // 페이지 로드 시 세션스토리지에 저장된 사용자 정보를 가져오기
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
//       // 만약 백엔드 응답에 'id'가 있다면 'userId'로 변환합니다.
//       if (!userData.userId && userData.id) {
//         userData.userId = userData.id;
//       }
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

// AuthProvider.propTypes = {
//   children: PropTypes.node.isRequired,
// };

// export const useAuth = () => useContext(AuthContext);

// export default AuthProvider;








import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  // ✅ 페이지 로드 시 세션에서 사용자 + 토큰 로딩
  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    const storedToken = sessionStorage.getItem("token");

    if (storedUser && storedToken) {
      setUser(JSON.parse(storedUser));
      // ✅ 토큰이 있다면 axios에 자동 설정
      axios.defaults.headers.common["Authorization"] = `Bearer ${storedToken}`;
    }
  }, []);

  // ✅ 로그인
  const login = async (userId, password) => {
    try {
      console.log("📌 로그인 요청:", { userId, password });

      const response = await axios.post("http://localhost:8080/api/auth/login", {
        userId,
        password,
      });

      const userData = response.data;

      // ✅ 토큰이 있는 경우에만 설정
    if (userData.token) {
      sessionStorage.setItem("token", userData.token);
      axios.defaults.headers.common["Authorization"] = `Bearer ${userData.token}`;
    } else {
      console.warn("⚠️ JWT 토큰이 응답에 없습니다!");
    }
      // ✅ 사용자 정보 저장
      sessionStorage.setItem("user", JSON.stringify(userData));
      setUser(userData);

      console.log("✅ 로그인 성공:", userData);
    } catch (error) {
      console.error("📌 로그인 실패:", error.response?.data || error.message);
      alert(error.response?.data?.message || "로그인 실패. 아이디와 비밀번호를 확인하세요.");
    }
  };

  // ✅ 로그아웃
  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
    sessionStorage.removeItem("token");
    delete axios.defaults.headers.common["Authorization"];
    console.log("✅ 로그아웃 완료");
  };

  console.log("📌 AuthProvider가 제공하는 값:", { user, login, logout });

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

export const useAuth = () => useContext(AuthContext);

export default AuthProvider;
