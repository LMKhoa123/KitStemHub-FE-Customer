/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import {
  Spin,
  Card,
  Pagination,
  Button,
  Input,
  Tag,
  Tooltip,
  Radio,
} from "antd";

import api from "./../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  AppstoreOutlined,
  DollarOutlined,
  EyeOutlined,
  HeartOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import AOS from "aos";
import "aos/dist/aos.css";

function KitCategory({ initialSearchTerm }) {
  const [dataSource, setDataSource] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(0);
  const [totalPages, setTotalPages] = useState(0);
  const [priceRange, setPriceRange] = useState([0, 5000000]);
  const [searchTerm, setSearchTerm] = useState(initialSearchTerm || "");
  const [tempSearchTerm, setTempSearchTerm] = useState(initialSearchTerm || "");
  const [categories, setCategories] = useState([]);
  const navigate = useNavigate();
  const { categoryName } = useParams();

  // const [priceFilter, setPriceFilter] = useState("all");
  const [showScrollTop, setShowScrollTop] = useState(false);

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
    });
  }, []);

  const fetchProducts = useCallback(async () => {
    setLoading(true);
    try {
      // Ensure currentPage is never negative
      const pageToFetch = Math.max(0, currentPage);

      const params = {
        page: pageToFetch,
        "kit-name": searchTerm,
      };

      // Chỉ thêm category-name nếu categoryName không phải "all"
      if (categoryName && categoryName !== "Tất Cả") {
        params["category-name"] = categoryName;
      }

      // Chỉ thêm price range params khi có giá trị
      if (priceRange.length === 2) {
        params["from-price"] = priceRange[0];
        params["to-price"] = priceRange[1];
      }

      const response = await api.get("kits", { params });

      const {
        kits,
        "total-pages": totalPages,
        "current-page": currentPageFromApi,
      } = response.data.details.data;

      setDataSource(kits || []);
      setTotalPages(totalPages || 0);
      setCurrentPage(Math.max(0, (currentPageFromApi || 1) - 1));
    } catch (error) {
      console.error("Lỗi khi tải dữ liệu kit:", error);
      setDataSource([]);
      setTotalPages(0);
      setCurrentPage(0);
    } finally {
      setLoading(false);
    }
  }, [currentPage, searchTerm, categoryName, priceRange]);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  useEffect(() => {
    // Gọi API để lấy danh sách danh mục
    const fetchCategories = async () => {
      try {
        const categoriesResponse = await api.get("categories");
        setCategories(categoriesResponse.data.details.data.categories);
      } catch (error) {
        console.error("Lỗi khi tải danh mục:", error);
      }
    };
    fetchCategories();
  }, []);
  useEffect(() => {
    const handleScroll = () => {
      // Hiện nút khi scroll xuống 300px
      setShowScrollTop(window.scrollY > 300);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);
  const handleProductClick = (kitId) => {
    navigate(`/productdetail/${kitId}`);
  };
  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };
  const handlePageChange = (page) => {
    setCurrentPage(page - 1);
  };

  const handleSearch = () => {
    setSearchTerm(tempSearchTerm);
    setCurrentPage(0);
    fetchProducts();
  };

  const handlePriceFilterChange = (e) => {
    const value = e.target.value;

    if (value === "all") {
      setPriceRange([]);
    } else {
      const [min, max] = value.split("-").map(Number);
      setPriceRange([min, max]);
    }

    setCurrentPage(0); // Reset to first page when filter changes
  };

  const handleSearchInputChange = (e) => {
    setTempSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto py-20 px-4">
      {/* Tiêu đề */}
      <h2 className="text-2xl mb-14 font-bold font-sans">
        {categoryName || "Tất cả sản phẩm"} (
        {loading ? "Đang tải..." : dataSource.length} sản phẩm)
      </h2>

      {/* Container cho sidebar và content */}
      <div className="flex flex-col md:flex-row gap-6">
        {/* Sidebar - Fixed on the left */}
        <div className="w-full md:w-64 shrink-0">
          <div className="bg-white p-4 rounded-lg shadow-md">
            <div className="mb-6">
              <h3 className="text-lg font-semibold mb-4">Tìm kiếm</h3>
              <Input.Search
                placeholder="Nhập tên kit"
                onSearch={handleSearch}
                value={tempSearchTerm}
                onChange={handleSearchInputChange}
                className="mb-4"
              />
            </div>

            <div className="space-y-4">
              {/* Price Filter Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  <DollarOutlined className="mr-2" />
                  Lọc theo giá
                </h3>
                <Radio.Group
                  onChange={handlePriceFilterChange}
                  className="flex flex-col gap-2"
                >
                  <Radio value="all">Tất cả giá</Radio>
                  <Radio value="0-100000">0 - 100,000 VND</Radio>
                  <Radio value="100000-500000">100,000 - 500,000 VND</Radio>
                  <Radio value="500000-1000000">500,000 - 1,000,000 VND</Radio>
                  <Radio value="1000000-2000000">
                    1,000,000 - 2,000,000 VND
                  </Radio>
                  <Radio value="2000000-5000000">
                    2,000,000 - 5,000,000 VND
                  </Radio>
                </Radio.Group>
              </div>

              {/* Categories Section */}
              <div>
                <h3 className="text-lg font-semibold mb-3">
                  <AppstoreOutlined className="mr-2" />
                  Danh mục
                </h3>
                <div className="flex flex-col gap-2">
                  {/* Thêm nút Tất Cả */}
                  <Button
                    type={
                      !categoryName || categoryName === "Tất Cả"
                        ? "primary"
                        : "text"
                    }
                    onClick={() => navigate(`/category/Tất Cả`)}
                    className="text-left"
                  >
                    Tất Cả
                  </Button>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      type={categoryName === category.name ? "primary" : "text"}
                      onClick={() => navigate(`/category/${category.name}`)}
                      className="text-left"
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="flex-1">
          {loading ? (
            <div className="flex justify-center items-center h-64">
              <Spin size="large" />
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {dataSource.length > 0 ? (
                dataSource.map((item) => (
                  <div
                    key={item.id}
                    data-aos="fade-up"
                    data-aos-anchor-placement="top-bottom"
                  >
                    <Card
                      hoverable
                      className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                      cover={
                        <img
                          alt={item.name || "Hình ảnh sản phẩm"}
                          src={
                            item["kit-images"]?.[0]?.url || "default-image-url"
                          }
                          className="h-60 object-cover"
                        />
                      }
                      onClick={() => handleProductClick(item.id)}
                    >
                      <Card.Meta
                        title={
                          <Tooltip title={item.name}>
                            <div className="text-lg font-semibold truncate">
                              {item.name}
                            </div>
                          </Tooltip>
                        }
                        description={
                          <>
                            <p className="text-sm text-gray-500 mb-2 truncate">
                              {item.brief}
                            </p>
                            <div className="flex flex-col gap-3">
                              <span className="text-green-800 font-semibold">
                                {`${item["min-package-price"].toLocaleString()} - ${item["max-package-price"].toLocaleString()} VND`}
                              </span>
                              <div className="flex justify-end">
                                <Tag
                                  color="blue"
                                  className="inline-block max-w-[200px] truncate px-2 py-1 text-center font-medium"
                                >
                                  {item["kits-category"].name}
                                </Tag>
                              </div>
                            </div>
                          </>
                        }
                      />
                      <div className="absolute top-2 right-2 flex flex-col space-y-2">
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
          )}

          {/* Pagination */}
          {totalPages > 0 && (
            <Pagination
              total={totalPages * 20}
              current={currentPage + 1}
              pageSize={20}
              onChange={handlePageChange}
              showSizeChanger={false}
              className="mt-8 text-center"
            />
          )}
        </div>
      </div>

      {/* Scroll to top button */}
      {showScrollTop && (
        <Button
          type="primary"
          shape="circle"
          icon={<ArrowUpOutlined />}
          size="large"
          onClick={scrollToTop}
          className=" fixed bottom-8 right-8 z-50 shadow-lg hover:scale-110 transition-transform duration-300"
          style={{
            backgroundColor: "red",
            height: "50px",
            width: "50px",
          }}
        />
      )}
    </div>
  );
}

export default KitCategory;
