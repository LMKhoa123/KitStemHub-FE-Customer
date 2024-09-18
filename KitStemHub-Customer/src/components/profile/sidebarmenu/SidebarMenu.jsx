import {
  HeartOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Layout, Menu } from "antd";
import Sider from "antd/es/layout/Sider";

// eslint-disable-next-line react/prop-types
const MenuItem = ({ label, className }) => {
  return <span className={className}>{label}</span>;
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
      },
      {
        key: "2",
        label: <MenuItem label="Địa chỉ giao hàng" className="text-gray-500" />,
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
        label: <MenuItem label="Đơn hàng của bạn" className="text-gray-500" />,
      },
      {
        key: "4",
        label: <MenuItem label="Bài Lab đã tải" className="text-gray-500" />,
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

function SidebarMenu() {
  return (
    <Layout className="p-14 pl-16">
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

export default SidebarMenu;
