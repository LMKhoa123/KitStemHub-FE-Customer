import { Breadcrumb } from "antd";

function CartNav() {
  return (
    <div>
      <div className="flex justify-between shrink p-14">
        <Breadcrumb>
          <Breadcrumb.Item>Home</Breadcrumb.Item>
          <Breadcrumb.Item>My Account</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    </div>
  );
}

export default CartNav;
