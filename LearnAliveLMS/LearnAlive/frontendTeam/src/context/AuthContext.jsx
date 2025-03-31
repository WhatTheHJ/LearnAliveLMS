import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";

// ✅ AuthContext 생성
export const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  // ✅ 통합 로그인 (학생, 교수, 관리자)
  const login = async (userId, password) => {
    try {
      console.log("📌 로그인 요청:", { userId, password });

      const response = await axios.post("http://localhost:8080/api/auth/login", {
        userId,
        password,
      });

      const userData = response.data;
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
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
    console.log("✅ 로그아웃 완료");
  };

  console.log("📌 AuthProvider가 제공하는 값:", { user, login, logout });

  return (
    <AuthContext.Provider value={{ user, login, logout, setUser }}>
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