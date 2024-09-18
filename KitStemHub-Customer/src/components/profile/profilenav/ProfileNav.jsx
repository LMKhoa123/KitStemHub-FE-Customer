import { Breadcrumb } from "antd";
import { Content } from "antd/es/layout/layout";

function ProfileNav() {
  return (
    <div className="flex justify-between items-center p-14">
      <Breadcrumb>
        <Breadcrumb.Item>Home</Breadcrumb.Item>
        <Breadcrumb.Item>My Account</Breadcrumb.Item>
      </Breadcrumb>
      <div className="">
        <Content>
          Welcome!
          <a href="#" className="text-red-500">
            Md Rimel
          </a>
        </Content>
      </div>
    </div>
  );
}

export default ProfileNav;
