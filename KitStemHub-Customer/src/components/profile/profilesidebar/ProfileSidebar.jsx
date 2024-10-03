import {
  HeartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";
import { useNavigate } from "react-router-dom";

// eslint-disable-next-line react/prop-types
const MenuItem = ({ label, className }) => {
  return <span className={className}>{label}</span>;
};

function ProfileSidebar() {
  const navigate = useNavigate();
  const handleNavigate = (path) => () => {
    navigate(path);
  };
  const items = [
    {
      key: "sub1",
      icon: <UserOutlined />,
      label: <p className="font-medium">Quản lí tài khoản</p>,
      children: [
        {
          key: "1",
          label: (
            <MenuItem label="Thông tin tài khoản" className="text-gray-500" />
          ),
          onClick: handleNavigate("/profile"),
        },
        {
          key: "2",
          label: (
            <MenuItem label="Địa chỉ giao hàng" className="text-gray-500" />
          ),
          onClick: handleNavigate("/profile/address"),
        },
      ],
    },
    {
      key: "sub2",
      icon: <ShoppingOutlined />,
      label: <p className="font-medium">Quản lí đơn hàng</p>,
      children: [
        {
          key: "3",
          label: (
            <MenuItem label="Đơn hàng của bạn" className="text-gray-500" />
          ),
          onClick: handleNavigate("/profile/cart"),
        },
        {
          key: "4",
          label: <MenuItem label="Bài Lab đã tải" className="text-gray-500" />,
          onClick: handleNavigate("/profile/lab"),
        },
      ],
    },
    {
      key: "sub3",
      icon: <HeartOutlined />,
      label: <p className="font-medium">My Wishlist</p>,
      children: [{}, {}],
    },
  ];
  return (
    <Layout className="shrink p-14 pl-14">
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultOpenKeys={["sub1"]}
          style={{ height: "100%", borderRight: 0 }}
          items={items}
        />
      </Sider>
    </Layout>
  );
}

export default ProfileSidebar;
