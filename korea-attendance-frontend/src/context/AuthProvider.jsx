import { useState, useEffect } from "react";
import PropTypes from "prop-types";
import axios from "axios";
import { AuthContext } from "./AuthContext";

const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);

  useEffect(() => {
    const storedUser = sessionStorage.getItem("user");
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
  }, []);

  const login = async (userId, password) => {
    try {
      const response = await axios.post("http://localhost:8080/api/auth/login", {
        userId,
        password,
      });

      const userData = response.data;
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      console.error("📌 로그인 실패:", error.response?.data || error.message);
      alert("로그인 실패: 아이디 또는 비밀번호를 확인하세요.");
    }
  };

  const logout = () => {
    setUser(null);
    sessionStorage.removeItem("user");
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

// ✅ default export 추가
export default AuthProvider;

// ✅ PropTypes 검증
AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};
