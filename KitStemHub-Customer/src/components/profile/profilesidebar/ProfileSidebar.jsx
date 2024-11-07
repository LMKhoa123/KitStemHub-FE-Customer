import { ShoppingOutlined, UserOutlined } from "@ant-design/icons";
import { Tabs } from "antd";
import { useNavigate, useLocation } from "react-router-dom";

function ProfileSidebar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Xác định `activeKey` dựa trên `location.pathname`
  const activeKey = location.pathname.includes("/profile/lab")
    ? "3"
    : location.pathname.includes("/profile/cart")
      ? "2"
      : "1";

  // Hàm xử lý khi nhấn vào tab
  const onChange = (key) => {
    // Điều hướng sang route tương ứng với tab mà không thay đổi `activeKey` trực tiếp
    if (key === "1") {
      navigate("/profile");
    } else if (key === "2") {
      navigate("/profile/cart");
    } else if (key === "3") {
      navigate("/profile/lab");
    }
  };

  // Danh sách các tab
  const items = [
    {
      label: (
        <span>
          <UserOutlined /> Quản lí tài khoản
        </span>
      ),
      key: "1",
    },
    {
      label: (
        <span>
          <ShoppingOutlined /> Quản lí đơn hàng
        </span>
      ),
      key: "2",
    },
    {
      label: (
        <span>
          <ShoppingOutlined /> Lịch sử hỗ trợ
        </span>
      ),
      key: "3",
    },
  ];

  return (
    <Tabs activeKey={activeKey} onChange={onChange} type="card" items={items} />
  );
}

export default ProfileSidebar;
