import {
  CloseCircleOutlined,
  LoginOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Space } from "antd";
import { useNavigate } from "react-router-dom";
function DropdownUser() {
  const navigate = useNavigate();

  const handleNavigate = (path) => () => {
    navigate(path);
  };
  const items = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: "Manage my account",
      onClick: handleNavigate("/profile/profileinfo"),
    },
    {
      key: "2",
      icon: <ShoppingOutlined />,

      label: "My order",
    },
    {
      key: "3",
      icon: <CloseCircleOutlined />,

      label: "My cancellations",
    },
    {
      key: "4",
      icon: <LoginOutlined />,
      label: "Logout",
      onClick: handleNavigate("/home/register"),
    },
  ];

  return (
    <Space direction="vertical">
      <Space wrap>
        <Dropdown
          menu={{
            items,
          }}
          placement="bottomRight"
          arrow={{
            pointAtCenter: true,
          }}
        >
          <UserOutlined />
        </Dropdown>
      </Space>
    </Space>
  );
}

export default DropdownUser;
