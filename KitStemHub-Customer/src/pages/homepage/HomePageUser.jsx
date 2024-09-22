import Footer from "../../components/footer/Footer";
import HomeUser from "../../components/home/HomeUser";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";

function HomePageUser() {
  return (
    <div className="container mx-auto shrink h-screen">
      <NavbarUser />
      <HomeUser />
      <Footer />
    </div>
  );
}

export default HomePageUser;
