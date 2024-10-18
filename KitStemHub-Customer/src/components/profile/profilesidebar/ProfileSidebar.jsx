import { ShoppingOutlined, UserOutlined } from "@ant-design/icons";
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
          label: <MenuItem label="Lịch sử hỗ trợ" className="text-gray-500" />,
          onClick: handleNavigate("/profile/lab"),
        },
      ],
    },
  ];
  return (
    <Layout className="shrink p-14 pl-14">
      <Sider width={200}>
        <Menu
          mode="inline"
          defaultOpenKeys={["sub1", "sub2", "sub3"]}
          style={{ height: "100%", borderRight: 0 }}
          items={items}
        />
      </Sider>
    </Layout>
  );
}

export default ProfileSidebar;
