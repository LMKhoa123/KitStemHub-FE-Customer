import { HeartOutlined, ShoppingCartOutlined } from "@ant-design/icons";
import NavbarEx from "../navbarEx/NavbarEx";
import DropdownUser from "../../dropdownUser/DropdownUser";
import { useNavigate } from "react-router-dom";
import { useCallback, useState, useEffect } from "react";
import { useAuth } from "../../../context/AuthContext";
import Loading from "../../Loading";
import { Badge } from "antd";
import api from "../../../config/axios";

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
  const calculateCartItemCount = async () => {
    try {
      const response = await api.get("carts");
      const cartData = response.data.details.data.carts;
      // const totalItems = cartData.reduce(
      //   (total, item) => total + item["package-quantity"],
      //   0
      // );
      setCartItemCount(cartData.length);
    } catch (error) {
      console.error("Error fetching cart data:", error);
    }
  };

  useEffect(() => {
    const fetchCartCount = async () => {
      try {
        const response = await api.get("/carts");
        setCartItemCount(response.data.details.data.carts.length);
      } catch (error) {
        console.error("Error fetching cart count:", error);
      }
    };

    fetchCartCount(); // Lấy số lượng khi component được render lần đầu

    const handleCartUpdate = (event) => {
      setCartItemCount(event.detail); // Cập nhật số lượng từ event detail
    };

    // Thêm event listener
    window.addEventListener("cartUpdate", handleCartUpdate);

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
