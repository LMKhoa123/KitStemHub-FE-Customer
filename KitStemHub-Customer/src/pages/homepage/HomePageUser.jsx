import Footer from "../../components/footer/Footer";
import HomeUser from "../../components/home/HomeUser";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";

function HomePageUser() {
  return (
    <div className="h-screen">
      <NavbarUser />
      <HomeUser />
      <Footer />
    </div>
  );
}

export default HomePageUser;
