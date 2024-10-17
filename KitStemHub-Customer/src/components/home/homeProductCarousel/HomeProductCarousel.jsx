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
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const navigate = useNavigate();
  const [priceFilter, setPriceFilter] = useState("all");
  const [customPriceRange, setCustomPriceRange] = useState([0, 5000000]);

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
      setPriceRange([0, 5000000]);
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
      <Menu.Item key="1000000-2000000">1,000,000 - 2,000,000 VND</Menu.Item>
      <Menu.Item key="2000000-5000000">2,000,000 - 5,000,000 VND</Menu.Item>
      <Menu.Item key="custom">Tùy chỉnh</Menu.Item>
    </Menu>
  );

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="mb-8 flex flex-col md:flex-row items-center justify-between gap-4">
        <Space direction="vertical" className="w-full md:w-auto">
          <Dropdown overlay={priceFilterMenu}>
            <Button className="w-full md:w-auto">
              Lọc theo giá <DownOutlined />
            </Button>
          </Dropdown>
          {priceFilter === "custom" && (
            <Slider
              range
              min={0}
              max={5000000}
              step={10000}
              value={customPriceRange}
              onChange={handleCustomPriceChange}
              className="w-full md:w-64"
            />
          )}
          <span className="text-sm text-gray-600">
            {priceRange[0].toLocaleString()} - {priceRange[1].toLocaleString()}{" "}
            VND
          </span>
        </Space>
        <Input.Search
          placeholder="Tìm kiếm sản phẩm"
          onSearch={handleSearch}
          className="w-full md:w-64"
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
        />
      </div>
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-64">
          <h2 className="text-xl font-bold mb-4">Danh mục</h2>
          <Menu mode="vertical" className="bg-gray-50 rounded-lg">
            <Menu.Item key="all" onClick={() => handleCategoryClick(null)}>
              Tất cả sản phẩm
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
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6">
                {selectedCategory
                  ? `${selectedCategory.name}`
                  : "Tất cả sản phẩm"}
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                {dataSource.length > 0 ? (
                  dataSource.map((item, index) => (
                    <div
                      key={item.id}
                      data-aos="fade-up"
                      data-aos-delay={index * 100}
                      data-aos-anchor-placement="top-bottom"
                    >
                      <Card
                        hoverable
                        className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                        cover={
                          <img
                            alt={item.name || "Hình ảnh sản phẩm"}
                            src={
                              item["kit-images"]?.[0]?.url ||
                              "default-image-url"
                            }
                            className="h-48 object-cover"
                          />
                        }
                        onClick={() => handleProductClick(item.id)}
                      >
                        <Card.Meta
                          title={
                            <div className="text-center font-semibold truncate">
                              {item.name}
                            </div>
                          }
                          description={
                            <div className="text-center text-gray-600">
                              {`${item["min-package-price"].toLocaleString()} - ${item["max-package-price"].toLocaleString()}`}{" "}
                              VND
                            </div>
                          }
                        />
                        <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                          <Button
                            shape="circle"
                            icon={<HeartOutlined />}
                            className="bg-white/80 hover:bg-red-500 hover:text-white transition-colors duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Đã nhấn vào biểu tượng tim");
                            }}
                          />
                          <Button
                            shape="circle"
                            icon={<EyeOutlined />}
                            className="bg-white/80 hover:bg-blue-500 hover:text-white transition-colors duration-300"
                            onClick={(e) => {
                              e.stopPropagation();
                              console.log("Đã nhấn vào biểu tượng mắt");
                            }}
                          />
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
