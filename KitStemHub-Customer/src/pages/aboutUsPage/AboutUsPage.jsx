import AboutUs from "../../components/About";
import Footer from "../../components/footer/Footer";
import NavbarEx from "../../components/navbar/navbarEx/NavbarEx";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";

function AboutUsPage() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <>
      {isLoggedIn ? <NavbarUser /> : <NavbarEx />}
      <AboutUs />
      <Footer />
    </>
  );
}

export default AboutUsPage;
