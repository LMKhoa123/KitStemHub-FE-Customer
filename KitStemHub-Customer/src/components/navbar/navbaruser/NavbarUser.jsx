import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import NavbarEx from "../navbarEx/NavbarEx";
import DropdownUser from "../../dropdownUser/DropdownUser";
import { useNavigate } from "react-router-dom";
import { useCallback, useState } from "react";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../Loading";

function NavbarUser() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  // loading này được sử dụng để chỉ ra trạng thái đang xử lý logout.
  const [loading, setLoading] = useState(false);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    // Simulate an async operation
    await new Promise((resolve) => setTimeout(resolve, 1000));
    localStorage.removeItem("token");
    localStorage.removeItem("refreshToken");
    setIsLoggedIn(false);
    setLoading(false);
    navigate("/");
  }, [navigate, setIsLoggedIn]);

  const handleNavigate = (path) => () => {
    navigate(path);
  };

  if (loading) {
    return <Loading />;
  }

  return (
    <NavbarEx
      childrenItem={
        <ul className="lg:flex hidden lg:justify-between lg:items-center text-gray-400 lg:gap-4 text-md font-normal">
          <li className="hover:text-gray-800 transition p-4 text-xl">
            <a href="#" className="">
              <HeartOutlined />
            </a>
          </li>
          <li className="hover:text-gray-800 transition p-4 text-xl">
            <a href="#" className="">
              <ShoppingCartOutlined onClick={handleNavigate("/cart")} />
            </a>
          </li>
          <li className="hover:text-gray-800 transition p-4 text-xl cursor-pointer">
            <DropdownUser
              onLogout={handleLogout}
              onProfile={handleNavigate("/profile")}
            />
          </li>
        </ul>
      }
    />
  );
}

export default NavbarUser;
