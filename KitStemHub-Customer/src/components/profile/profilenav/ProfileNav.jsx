import { Breadcrumb } from "antd";

function ProfileNav() {
  return (
    <div className="flex justify-between shrink p-14 pl-64">
      <Breadcrumb>
        <Breadcrumb.Item>Trang chủ</Breadcrumb.Item>
        <Breadcrumb.Item>Quản lý tài khoản</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}

export default ProfileNav;
