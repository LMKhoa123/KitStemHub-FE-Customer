/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import {
  Spin,
  Card,
  Pagination,
  Menu,
  Slider,
  Button,
  Input,
  Dropdown,
  Space,
} from "antd";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import { EyeOutlined, HeartOutlined, DownOutlined } from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";

function HomeProductCarousel({ initialSearchTerm }) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [categories, setCategories] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);
  const [priceRange, setPriceRange] = useState([0, 1000000]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const navigate = useNavigate();
  const [priceFilter, setPriceFilter] = useState("all");
  const [customPriceRange, setCustomPriceRange] = useState([0, 1000000]);

  useEffect(() => {
    AOS.init({
      duration: 1000,
      once: true,
      mirror: false,
    });
  }, []);

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
          page: currentPage,
          "kit-name": searchTerm,
          "category-name": selectedCategory ? selectedCategory.name : "",
          "from-price": priceRange[0],
          "to-price": priceRange[1],
        },
      });
      const {
        kits,
        "total-pages": totalPages,
        "current-page": currentPageFromApi,
      } = response.data.details.data;
      setDataSource(kits);
      setTotalPages(totalPages);
      setCurrentPage(currentPageFromApi - 1);
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu kit:", error);
      setDataSource([]);
      setTotalPages(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, selectedCategory, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  const handleProductClick = (kitId) => {
    navigate(`/productdetail/${kitId}`);
  };

  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const handleCategoryClick = (category) => {
    setSelectedCategory(category);
    setCurrentPage(0);
    fetchProducts();
  };

  const handlePriceChange = (value) => {
    setPriceRange(value);
  };

  const handleSearch = (value) => {
    setSearchTerm(value);
    setCurrentPage(0);
    fetchProducts();
  };

  const handleApplyFilter = () => {
    setCurrentPage(0);
    fetchProducts();
  };

  const handlePriceFilterChange = (value) => {
    setPriceFilter(value);
    if (value === "custom") {
      setPriceRange(customPriceRange);
    } else if (value === "all") {
      setPriceRange([0, 1000000]);
    } else {
      const [min, max] = value.split("-").map(Number);
      setPriceRange([min, max]);
    }
    setCurrentPage(0);
    fetchProducts();
  };

  const handleCustomPriceChange = (value) => {
    setCustomPriceRange(value);
    if (priceFilter === "custom") {
      setPriceRange(value);
      setCurrentPage(0);
      fetchProducts();
    }
  };

  const priceFilterMenu = (
    <Menu onClick={({ key }) => handlePriceFilterChange(key)}>
      <Menu.Item key="all">Tất cả giá</Menu.Item>
      <Menu.Item key="0-100000">0 - 100,000 VND</Menu.Item>
      <Menu.Item key="100000-500000">100,000 - 500,000 VND</Menu.Item>
      <Menu.Item key="500000-1000000">500,000 - 1,000,000 VND</Menu.Item>
      <Menu.Item key="custom">Tùy chỉnh</Menu.Item>
    </Menu>
  );

  return (
    <div className="flex flex-col">
      <div className="mb-8 flex items-center justify-between">
        <Space>
          <Dropdown overlay={priceFilterMenu}>
            <Button>
              Lọc theo giá <DownOutlined />
            </Button>
          </Dropdown>
          {priceFilter === "custom" && (
            <Slider
              range
              min={0}
              max={1000000}
              step={10000}
              value={customPriceRange}
              onChange={handleCustomPriceChange}
              style={{ width: 200 }}
            />
          )}
          <span>
            {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}{" "}
            VND
          </span>
        </Space>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          onSearch={handleSearch}
          style={{ width: 300 }}
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
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
                {selectedCategory
                  ? `${selectedCategory.name} Kits`
                  : "All Kits"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4 sm:gap-6 md:gap-8 lg:gap-10 w-full">
                {dataSource.length > 0 ? (
                  dataSource.map((item, index) => (
                    <div
                      key={item.id}
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
                            {/* {item["purchase-cost"].toLocaleString()} VND */}
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
              {totalPages > 0 && (
                <Pagination
                  total={totalPages * 20}
                  current={currentPage + 1}
                  pageSize={20}
                  onChange={handlePageChange}
                  className="mt-8"
                />
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HomeProductCarousel;
