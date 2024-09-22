import {
  CloseCircleOutlined,
  LoginOutlined,
  ShoppingOutlined,
  UserOutlined,
} from "@ant-design/icons";
import { Dropdown, Space } from "antd";
function DropdownUser() {
  const items = [
    {
      key: "1",
      icon: <UserOutlined />,
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.antgroup.com"
        >
          Manage my account
        </a>
      ),
    },
    {
      key: "2",
      icon: <ShoppingOutlined />,

      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.aliyun.com"
        >
          My order
        </a>
      ),
    },
    {
      key: "3",
      icon: <CloseCircleOutlined />,

      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          My cancellations
        </a>
      ),
    },
    {
      key: "4",
      icon: <LoginOutlined />,
      label: (
        <a
          target="_blank"
          rel="noopener noreferrer"
          href="https://www.luohanacademy.com"
        >
          Logout
        </a>
      ),
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
