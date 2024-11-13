import Contact from "../../components/contact/Contact";
import Footer from "../../components/footer/Footer";
import Navbar from "../../components/login/navbar/Navbar";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";

function ContactPage() {
  const isLoggedIn = !!localStorage.getItem("token");
  return (
    <>
      {isLoggedIn ? <NavbarUser /> : <Navbar />}
      <Contact />
      <Footer />
    </>
  );
}

export default ContactPage;
