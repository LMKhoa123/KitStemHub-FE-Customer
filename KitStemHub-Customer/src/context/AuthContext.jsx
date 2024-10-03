import { createContext, useState, useContext, useEffect } from "react";

const AuthContext = createContext(null);
// AuthProvider bao bọc toàn bộ ứng dụng trong App.jsx để kiểm tra token
export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  // loading này được sử dụng để chỉ ra trạng thái kiểm tra ban đầu của token.
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const checkLoginStatus = async () => {
      const token = localStorage.getItem("token");
      setIsLoggedIn(!!token);
      setLoading(false);
    };
    checkLoginStatus();
  }, []);

  return (
    <AuthContext.Provider
      value={{ isLoggedIn, setIsLoggedIn, loading, setLoading }}
    >
      {children}
    </AuthContext.Provider>
  );
};
// useAuth để đơn giản hóa việc sử dụng AuthContext trong các components khác
export const useAuth = () => useContext(AuthContext);

export default AuthContext;
