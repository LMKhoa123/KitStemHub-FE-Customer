/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { Spin, Card, Pagination, notification } from "antd";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, HeartOutlined } from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";

function HomeProductCarousel({ searchTerm }) {
  const [dataSource, setDataSource] = useState([]); // Dữ liệu sản phẩm
  const [filteredData, setFilteredData] = useState([]); // Dữ liệu sau khi lọc
  const [loading, setLoading] = useState(true); // Trạng thái loading
  const [currentPage, setCurrentPage] = useState(1); // Trạng thái trang hiện tại
  const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [pageSize, setPageSize] = useState(20); // Số lượng sản phẩm trên mỗi trang
  const navigate = useNavigate(); // Khởi tạo navigate để điều hướng

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

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
        const products = response.data.details.data.kits.filter(
          (kit) => kit.status === true // Lọc chỉ lấy các kit available
        );
        setDataSource((prev) => [...prev, ...products]); // Thêm vào danh sách hiện tại
      } catch (error) {
        console.error("Lỗi khi tải trước dữ liệu kit:", error);
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
      const products = response.data.details.data.kits.filter(
        (kit) => kit.status === true // Chỉ giữ lại các kit có status = true (Available)
      );
      const totalPages = response.data.details.data["total-pages"];
      const currentPage = response.data.details.data["current-page"];

      setDataSource(products); // Cập nhật sản phẩm
      setFilteredData(products); // Khởi tạo filteredData ban đầu
      setTotalPages(totalPages);
      setCurrentPage(currentPage);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu kit:", error);
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
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full">
            {filteredData.length > 0 ? (
              filteredData.map((item, index) => (
                <div
                  key={index}
                  data-aos="fade-up"
                  data-aos-delay={index * 100}
                  data-aos-anchor-placement="top-bottom"
                >
                  <Card
                    className="shadow-md hover:shadow-xl cursor-pointer transform transition-all duration-300 hover:scale-105 relative group rounded-xl overflow-hidden"
                    onClick={() => handleProductClick(item.id)}
                  >
                    {/* Lazy loading cho ảnh */}
                    <img
                      className="object-cover w-full h-48 lazy"
                      src={item["kit-images"]?.[0]?.url || "default-image-url"}
                      alt={item.name || "Hình ảnh sản phẩm"}
                      loading="lazy" // Lazy loading
                      onError={(e) => {
                        e.target.src = "default-image-url";
                      }}
                    />
                    <div className="p-4">
                      <div className="text-center font-semibold mb-2 truncate">
                        {item.name}
                      </div>
                      <div className="text-center text-gray-600">
                        {item["purchase-cost"].toLocaleString()} VND
                      </div>
                    </div>
                    <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300 z-10">
                      <div
                        className="p-2 transition-all duration-300 ease-in-out bg-black/50 hover:bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 rounded-full flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Đã nhấn vào biểu tượng tim");
                        }}
                      >
                        <HeartOutlined className="text-white text-sm sm:text-base" />
                      </div>
                      <div
                        className="p-2 transition-all duration-300 ease-in-out bg-black/50 hover:bg-gradient-to-r from-pink-500 to-red-500 hover:scale-110 rounded-full flex items-center justify-center w-8 h-8 sm:w-10 sm:h-10"
                        onClick={(e) => {
                          e.stopPropagation();
                          console.log("Đã nhấn vào biểu tượng mắt");
                        }}
                      >
                        <EyeOutlined className="text-white text-sm sm:text-base" />
                      </div>
                    </div>
                  </Card>
                </div>
              ))
            ) : (
              <div className="col-span-full text-center text-gray-500">
                Không tìm thấy sản phẩm nào.
              </div>
            )}
          </div>

          {/* Phân trang */}
          <Pagination
            total={totalPages * pageSize}
            current={currentPage}
            pageSize={pageSize}
            onChange={handlePageChange}
            className="mt-8"
          />
        </div>
      )}
    </>
  );
}

export default HomeProductCarousel;
