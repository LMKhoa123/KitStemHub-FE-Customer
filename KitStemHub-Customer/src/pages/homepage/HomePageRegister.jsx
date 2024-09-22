import Footer from "../../components/footer/Footer";
import HomeRegister from "../../components/home/HomeRegister";
import Navbar from "../../components/login/navbar/Navbar";

function HomePageRegister() {
  return (
    <div className="container mx-auto shrink h-screen">
      <Navbar />
      <HomeRegister />
      <Footer />
    </div>
  );
}

export default HomePageRegister;
