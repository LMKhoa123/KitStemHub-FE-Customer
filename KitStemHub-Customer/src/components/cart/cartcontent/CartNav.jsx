import { Breadcrumb } from "antd";
import { Link } from "react-router-dom";

function CartNav() {
  return (
    <div>
      <div className="flex justify-between shrink p-14">
        <Breadcrumb>
          <Breadcrumb.Item>
            <Link to="/">Trang Chủ</Link>
          </Breadcrumb.Item>

          <Breadcrumb.Item>Giỏ Hàng</Breadcrumb.Item>
        </Breadcrumb>
      </div>
    </div>
  );
}

export default CartNav;
