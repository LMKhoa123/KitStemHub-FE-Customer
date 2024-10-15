/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import { Spin, Card, Pagination, Menu } from "antd";
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
  // const [totalPages, setTotalPages] = useState(0); // Tổng số trang
  const [pageSize] = useState(20); // Số lượng sản phẩm trên mỗi trang
  const [categories, setCategories] = useState([]); // Danh sách categories
  const [selectedCategory, setSelectedCategory] = useState(null); // Category được chọn
  const navigate = useNavigate(); // Khởi tạo navigate để điều hướng

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

  // Fetch categories
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("categories");
        setCategories(response.data.details.data.categories);
      } catch (error) {
        console.error("Lỗi khi tải danh sách categories:", error);
      }
    };
    fetchCategories();
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      const response = await api.get("kits", {
        params: {
          page: 0,
          pageSize: 1000, // Lấy tất cả kit để có thể lọc ở phía client
        },
      });
      const products = response.data.details.data.kits.filter(
        (kit) => kit.status === true
      );
      setDataSource(products);
      filterProducts(products, selectedCategory, searchTerm);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu kit:", error);
    } finally {
      setLoading(false);
    }
  }, [selectedCategory, searchTerm]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const filterProducts = (products, category, search) => {
    let filtered = products;
    if (category) {
      filtered = filtered.filter(
        (product) => product["kits-category"].name === category.name
      );
    }
    if (search) {
      filtered = filtered.filter((product) =>
        product.name.toLowerCase().includes(search.toLowerCase())
      );
    }
    setFilteredData(filtered);
    setCurrentPage(1);
  };

  useEffect(() => {
    filterProducts(dataSource, selectedCategory, searchTerm);
  }, [searchTerm, dataSource, selectedCategory]);

  const handleProductClick = (kitId) => {
    navigate(`/productdetail/${kitId}`); // Điều hướng đúng đến URL
  };

  const handlePageChange = (page) => {
    setCurrentPage(page);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    filterProducts(dataSource, category, searchTerm);
  };

  const paginatedData = filteredData.slice(
    (currentPage - 1) * pageSize,
    currentPage * pageSize
  );

  return (
    <div className="flex">
      <div className="w-60 pr-4 mr-28">
        <h2 className="text-xl font-bold mb-4">Categories</h2>
        <Menu mode="vertical">
          <Menu.Item key="all" onClick={() => handleCategoryClick(null)}>
            All Kits
          </Menu.Item>
          {categories.map((category) => (
            <Menu.Item
              key={category.id}
              onClick={() => handleCategoryClick(category)}
            >
              {category.name}
            </Menu.Item>
          ))}
        </Menu>
      </div>
      <div className="w-3/4">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div className="flex flex-col items-center">
            <h2 className="text-2xl font-bold mb-5">
              {selectedCategory ? `${selectedCategory.name} Kits` : "All Kits"}
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full">
              {paginatedData.length > 0 ? (
                paginatedData.map((item, index) => (
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
                      <img
                        className="object-cover w-full h-48 lazy"
                        src={
                          item["kit-images"]?.[0]?.url || "default-image-url"
                        }
                        alt={item.name || "Hình ảnh sản phẩm"}
                        loading="lazy"
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
            <Pagination
              total={filteredData.length}
              current={currentPage}
              pageSize={pageSize}
              onChange={handlePageChange}
              className="mt-8"
            />
          </div>
        )}
      </div>
    </div>
  );
}

export default HomeProductCarousel;
