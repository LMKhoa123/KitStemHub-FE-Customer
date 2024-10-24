import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import NavbarEx from "../navbarEx/NavbarEx";
import DropdownUser from "../../dropdownUser/DropdownUser";
import { useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../Loading";
import { Badge } from "antd";

function NavbarUser() {
  const navigate = useNavigate();
  const { setIsLoggedIn } = useAuth();
  // State cho trạng thái loading khi đăng xuất
  const [loading, setLoading] = useState(false);
  // State cho số lượng sản phẩm trong giỏ hàng
  const [cartItemCount, setCartItemCount] = useState(0);

  const handleLogout = useCallback(async () => {
    setLoading(true);
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

  // Hàm tính tổng số lượng sản phẩm trong giỏ hàng
  const calculateCartItemCount = () => {
    const cartData = JSON.parse(localStorage.getItem("cart")) || [];
    // Tính tổng số lượng tất cả các sản phẩm (bao gồm cả các sản phẩm giống nhau)

    setCartItemCount(cartData.length);
  };

  useEffect(() => {
    // Tính toán số lượng sản phẩm khi trang được render
    calculateCartItemCount();

    // Lắng nghe sự kiện khi có thay đổi giỏ hàng
    const handleCartUpdate = () => {
      calculateCartItemCount();
    };

    // Lắng nghe sự kiện cập nhật giỏ hàng
    window.addEventListener("cartUpdate", handleCartUpdate);

    // Cleanup khi component bị hủy
    return () => {
      window.removeEventListener("cartUpdate", handleCartUpdate);
    };
  }, []);

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
            <Badge
              count={cartItemCount} // Hiển thị tổng số lượng sản phẩm trong giỏ hàng
              overflowCount={99} // Hiển thị 99+ nếu vượt quá 99 sản phẩm
              className="scale-75" // Giảm kích thước của Badge
            >
              <ShoppingCartOutlined
                onClick={handleNavigate("/cart")}
                className="text-3xl" // Điều chỉnh kích thước biểu tượng giỏ hàng
              />
            </Badge>
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
