
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
    <Dropdown
      overlay={menu}
      placement="bottomRight"
      arrow={{ pointAtCenter: true }}
    >
      <a className="ant-dropdown-link" onClick={(e) => e.preventDefault()}>
        <UserOutlined />
      </a>
    </Dropdown>
  );
}

DropdownUser.propTypes = {
  onLogout: PropTypes.func.isRequired,
};

export default DropdownUser;
