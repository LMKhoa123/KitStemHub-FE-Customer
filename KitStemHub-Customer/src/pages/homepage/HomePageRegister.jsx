import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import HomeRegister from "../../components/home/HomeRegister";
import Navbar from "../../components/login/navbar/Navbar";

function HomePageRegister() {
  const navigate = useNavigate();

  useEffect(() => {
    const accessToken = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");
    console.log(accessToken);
    if (accessToken && refreshToken) {
      console.log("Tokens found - Redirecting to home");
      navigate("/home");
    } else {
      console.log("Missing tokens:", {
        hasAccessToken: !!accessToken,
        hasRefreshToken: !!refreshToken,
      });
    }
  }, [navigate]);

  return (
    <div className="shrink h-screen">
      <Navbar />
      <HomeRegister />
      <Footer />
    </div>
  );
}

export default HomePageRegister;
