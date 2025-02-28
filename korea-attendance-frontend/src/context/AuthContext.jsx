import { createContext, useContext, useState, useEffect } from "react";
import PropTypes from "prop-types";

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

  const login = async (userId) => {
    try {
      // ✅ 서버에서 역할(role) 가져오기
      const response = await fetch(`http://localhost:8080/api/auth/${userId}`);
      if (!response.ok) throw new Error("로그인 실패");

      const userData = await response.json();
      setUser(userData);
      sessionStorage.setItem("user", JSON.stringify(userData));
    } catch (error) {
      alert("로그인 실패: " + error.message);
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

AuthProvider.propTypes = {
  children: PropTypes.node.isRequired,
};

// ✅ useAuth 훅 제공
export const useAuth = () => useContext(AuthContext);
