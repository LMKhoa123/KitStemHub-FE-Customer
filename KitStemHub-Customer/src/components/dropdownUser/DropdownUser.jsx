import { LogoutOutlined, UserOutlined } from "@ant-design/icons";
import { Dropdown, Menu } from "antd";
// import PropTypes from "prop-types";

function DropdownUser({ onLogout }) {
  const menu = (
    <Menu>
      <Menu.Item key="profile" icon={<UserOutlined />}>
        Hồ sơ
      </Menu.Item>
      <Menu.Item key="logout" icon={<LogoutOutlined />} onClick={onLogout}>
        Đăng xuất
      </Menu.Item>
    </Menu>
  );
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
//không cần thiết
// DropdownUser.propTypes = {
//   onLogout: PropTypes.func.isRequired,
// };

export default DropdownUser;
