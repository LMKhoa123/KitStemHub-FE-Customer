import { Outlet } from "react-router-dom";
import NavbarUser from "../../components/navbar/navbaruser/NavbarUser";

function ProfilePage() {
  return (
    <>
      <NavbarUser />
      <Outlet />
    </>
  );
}

export default ProfilePage;
