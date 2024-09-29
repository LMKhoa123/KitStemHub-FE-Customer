/* eslint-disable react/prop-types */
import { Pagination } from "antd";

function PaginationComponent({ currentPage, totalItems, onPageChange }) {
  return (
    <div className="flex justify-center">
      <Pagination
        current={currentPage}
        total={totalItems}
        pageSize={8} // Số sản phẩm trên mỗi trang
        onChange={onPageChange} // Gọi khi người dùng thay đổi trang
      />
    </div>
  );
}

export default PaginationComponent;
