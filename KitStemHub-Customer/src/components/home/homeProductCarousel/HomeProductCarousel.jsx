/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Spin, Card, Pagination, notification } from "antd";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, HeartOutlined } from "@ant-design/icons";

function HomeProductCarousel({ searchTerm }) {
  const [dataSource, setDataSource] = useState([]); // Dữ liệu sản phẩm
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi lọc
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [pageSize, setPageSize] = useState(20); // Số lượng sản phẩm trên mỗi trang
  const navigate = useNavigate(); // Khởi tạo navigate để điều hướng

  // Hàm mở notification
  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  // Hàm fetch dữ liệu sản phẩm từ API
  const fetchProducts = async (page = 1) => {
    try {
      setLoading(true); // Bật trạng thái loading
      const response = await api.get("kits", {
        params: {
          page: page - 1, // Nếu API bắt đầu từ 0
          pageSize: pageSize, // Số lượng sản phẩm mỗi trang
        },
      });

      const products = response.data.details.data.kits;
      const totalPages = response.data.details.data["total-pages"];
      const currentPage = response.data.details.data["current-page"];

      // Cập nhật dữ liệu sản phẩm và trạng thái
      setDataSource(products);
      setFilteredData(products); // Khởi tạo filteredData ban đầu
      setTotalPages(totalPages); // Cập nhật tổng số trang
      setCurrentPage(currentPage); // Cập nhật trang hiện tại
      setLoading(false); // Tắt trạng thái loading
    } catch (error) {
      console.error("Error fetching kits:", error);
      setLoading(false); // Tắt trạng thái loading nếu có lỗi
    }
  };

  useEffect(() => {
    fetchProducts(currentPage); // Gọi API khi component mount hoặc trang thay đổi
  }, [currentPage]);

  // Lọc sản phẩm dựa trên từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm) {
      const filtered = dataSource.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);

      // Hiển thị thông báo và khôi phục lại danh sách nếu không có sản phẩm phù hợp
      if (filtered.length === 0) {
        openNotificationWithIcon("info", "Không tìm thấy sản phẩm nào.");
      }
    } else {
      setFilteredData(dataSource); // Nếu không có từ khóa, hiển thị tất cả sản phẩm
    }
  }, [searchTerm, dataSource]);

  // Hàm xử lý thay đổi trang
  const handlePageChange = (page) => {
    setCurrentPage(page); // Cập nhật trang hiện tại
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" /> {/* Thêm hiệu ứng loading xoay */}
        </div>
      ) : (
        <div className="flex flex-col items-center">
          {/* Hiển thị các sản phẩm */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-14 mb-10">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <Card
                  key={index}
                  className="shadow-xl cursor-pointer w-64 transform transition-all duration-300 hover:shadow-2xl hover:scale-105 relative group rounded-xl overflow-hidden"
                  onClick={() => navigate(`/productdetail/${item.id}`)} // Điều hướng đến trang chi tiết sản phẩm
                >
                  {/* Hiển thị ảnh sản phẩm */}
                  <img
                    className="object-cover w-full h-auto"
                    height={200}
                    src={
                      item["kit-images"]?.[0]?.url
                        ? item["kit-images"][0].url
                        : "default-image-url" // Sử dụng ảnh mặc định nếu không có ảnh
                    }
                    alt={item.name || "Product Image"}
                    onError={(e) => {
                      e.target.src = "default-image-url"; // Hiển thị ảnh mặc định nếu không load được
                    }}
                  />

                  {/* Hiển thị tên sản phẩm */}
                  <div className="text-center font-semibold mt-2">
                    {item.name}
                  </div>

                  {/* Hiển thị giá sản phẩm */}
                  <div className="text-center text-gray-600 mt-1">
                    {item["purchase-cost"].toLocaleString()} VND
                  </div>

                  {/* Biểu tượng Heart và Eye */}
                  <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div
                      className="p-2 transition-all duration-300 ease-in-out bg-black/50 hover:bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 rounded-full flex items-center justify-center w-10 h-10"
                      onClick={() => console.log("Heart Clicked")}
                    >
                      <HeartOutlined
                        className="text-white"
                        style={{ fontSize: "18px" }}
                      />
                    </div>
                    <div
                      className="p-2 transition-all duration-300 ease-in-out bg-black/50 hover:bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 rounded-full flex items-center justify-center w-10 h-10"
                      onClick={() => console.log("Eye Clicked")}
                    >
                      <EyeOutlined
                        className="text-white"
                        style={{ fontSize: "18px" }}
                      />
                    </div>
                  </div>
                </Card>
              ))
            ) : (
              <div className="text-center text-gray-500">
                No products found.
              </div>
            )}
          </div>

          {/* Phân trang */}
          <Pagination
            total={totalPages * pageSize} // Tổng số sản phẩm (tổng số trang * số lượng trên mỗi trang)
            current={currentPage} // Trang hiện tại
            pageSize={pageSize} // Số sản phẩm mỗi trang
            onChange={handlePageChange} // Hàm xử lý khi thay đổi trang
            className="mt-4"
          />
        </div>
      )}
    </>
  );
}

export default HomeProductCarousel;
