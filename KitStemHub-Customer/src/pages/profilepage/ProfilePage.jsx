import { Outlet } from "react-router-dom";
import Footer from "../../components/footer/Footer";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";

function ProfilePage() {
  return (
    <div className="w-full min-h-screen">
      <NavbarUser />
      <div className="flex-grow">
        <Outlet />
      </div>
      <Footer />
    </div>
  );
}

export default ProfilePage;
