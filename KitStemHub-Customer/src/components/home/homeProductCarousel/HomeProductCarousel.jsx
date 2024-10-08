/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { Spin, Card, Pagination, Skeleton, notification } from "antd";
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

  // Prefetch dữ liệu khi trang kế tiếp gần được cuộn tới
  const prefetchNextPage = useCallback(
    async (page) => {
      try {
        const response = await api.get("kits", {
          params: {
            page: page - 1,
            pageSize: pageSize,
          },
        });
        const products = response.data.details.data.kits;
        setDataSource((prev) => [...prev, ...products]); // Thêm vào danh sách hiện tại
      } catch (error) {
        console.error("Error prefetching kits:", error);
      }
    },
    [pageSize]
  );

  const handleProductClick = (kitId) => {
    navigate(`/productdetail/${kitId}`); // Điều hướng đúng đến URL
  };

  const openNotificationWithIcon = (type, message) => {
    notification[type]({
      message: message,
    });
  };

  const fetchProducts = async (page = 1) => {
    setLoading(true); // Bật trạng thái loading
    try {
      const response = await api.get("kits", {
        params: {
          page: page - 1,
          pageSize: pageSize,
        },
      });
      const products = response.data.details.data.kits;
      const totalPages = response.data.details.data["total-pages"];
      const currentPage = response.data.details.data["current-page"];

      setDataSource(products); // Cập nhật sản phẩm
      setFilteredData(products); // Khởi tạo filteredData ban đầu
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (error) {
      console.error("Error fetching kits:", error);
    } finally {
      setLoading(false); // Tắt loading sau khi fetch xong
    }
  };

  // Tải sản phẩm khi component mount
  useEffect(() => {
    fetchProducts(currentPage);
  }, [currentPage]);

  // Lọc sản phẩm dựa trên từ khóa tìm kiếm
  useEffect(() => {
    if (searchTerm) {
      const filtered = dataSource.filter((product) =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredData(filtered);

      // Thông báo nếu không tìm thấy sản phẩm
      if (filtered.length === 0) {
        openNotificationWithIcon("info", "Không tìm thấy sản phẩm nào.");
      }
    } else {
      setFilteredData(dataSource);
    }
  }, [searchTerm, dataSource]);

  // Xử lý thay đổi trang và prefetch dữ liệu trang kế tiếp
  const handlePageChange = (page) => {
    setCurrentPage(page);
    if (page < totalPages) {
      prefetchNextPage(page + 1); // Prefetch trang kế tiếp nếu có
    }
  };

  return (
    <>
      {loading ? (
        <div className="flex justify-center items-center h-64">
          <Spin size="large" />
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
                  onClick={() => handleProductClick(item.id)}
                >
                  {/* Lazy loading cho ảnh */}
                  <img
                    className="object-cover w-full h-auto lazy"
                    height={200}
                    src={item["kit-images"]?.[0]?.url || "default-image-url"}
                    alt={item.name || "Product Image"}
                    loading="lazy" // Lazy loading
                    onError={(e) => {
                      e.target.src = "default-image-url";
                    }}
                  />
                  <div className="text-center font-semibold mt-2">
                    {item.name}
                  </div>
                  <div className="text-center text-gray-600 mt-1">
                    {item["purchase-cost"].toLocaleString()} VND
                  </div>
                  <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                    <div
                      className="p-2 transition-all duration-300 ease-in-out bg-black/50 hover:bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 rounded-full flex items-center justify-center w-10 h-10"
                      onClick={() => console.log("Heart Clicked")}
                    >
                      <HeartOutlined className="text-white" />
                    </div>
                    <div
                      className="p-2 transition-all duration-300 ease-in-out bg-black/50 hover:bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 rounded-full flex items-center justify-center w-10 h-10"
                      onClick={() => console.log("Eye Clicked")}
                    >
                      <EyeOutlined className="text-white" />
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
            total={totalPages * pageSize}
            current={currentPage}
            pageSize={pageSize}
            onChange={handlePageChange}
            className="mt-4"
          />
        </div>
      )}
    </>
  );
}

export default HomeProductCarousel;
