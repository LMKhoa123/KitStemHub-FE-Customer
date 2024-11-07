/* eslint-disable react/prop-types */
// ProfileNav.js
import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

function ProfileNav({ currentTab }) {
  return (
    <div>
      <Breadcrumb className="text-base">
        <Breadcrumb.Item>
          <Link to="/">Trang Chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{currentTab}</Breadcrumb.Item>
      </Breadcrumb>
    </div>
  );
}

export default ProfileNav;
