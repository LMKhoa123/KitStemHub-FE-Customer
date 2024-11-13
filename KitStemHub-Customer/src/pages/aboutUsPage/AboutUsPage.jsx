import AboutUs from "../../components/About";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/login/navbar/Navbar";
import NavbarEx from "../../components/navbar/navbarEx/NavbarEx";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";

function AboutUsPage() {
  const isLoggedIn = !!localStorage.getItem("token");
  console.log(isLoggedIn);
  return (
    <>
      {isLoggedIn ? <NavbarUser /> : <Navbar />}
      <AboutUs />
      <Footer />
    </>
  );
}

export default AboutUsPage;
