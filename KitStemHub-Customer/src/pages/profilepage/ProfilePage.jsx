import { Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";

function ProfilePage() {
  return (
    <>
      <NavbarUser />
      <Outlet />
      <Footer />
    </>
  );
}

export default ProfilePage;
