import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import HomeRegister from "../../components/home/HomeRegister";
import Navbar from "../../components/login/navbar/Navbar";
import api from "../../config/axios";
import { useAuth } from "../../context/AuthContext";

function HomePageRegister() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();

  useEffect(() => {
    const checkTokenValidity = async () => {
      const accessToken = localStorage.getItem("token");
      const refreshToken = localStorage.getItem("refreshToken");

      if (accessToken && refreshToken) {
        try {
          // Thử gọi một API để kiểm tra token có hợp lệ không
          await api.get("users/profile");
          console.log("Token valid - Redirecting to home");
          navigate("/home");
        } catch (error) {
          console.log("Invalid token - Staying on register page");
          // Nếu token không hợp lệ, xóa token và ở lại trang register
          localStorage.removeItem("token");
          localStorage.removeItem("refreshToken");
          setIsLoggedIn(false);
        }
      } else {
        console.log("No tokens found - Staying on register page");
      }
    };

    checkTokenValidity();
  }, [navigate, setIsLoggedIn]);

  return (
    <div className="shrink h-screen">
      <Navbar />
      <HomeRegister />
      <Footer />
    </div>
  );
}

export default HomePageRegister;
