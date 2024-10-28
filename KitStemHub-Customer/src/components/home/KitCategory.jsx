/* eslint-disable react/prop-types */
import { useEffect, useState, useCallback } from "react";
import {
  Spin,
  Card,
  Pagination,
  Button,
  Input,
  Checkbox,
  Tag,
  Tooltip,
  Menu,
  Dropdown,
  Slider,
  Radio,
  Space,
} from "antd";
import api from "./../../config/axios";
import { useNavigate, useParams } from "react-router-dom";
import {
  EyeOutlined,
  HeartOutlined,
  CloseOutlined,
  DownOutlined,
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
  const [sidebarVisible, setSidebarVisible] = useState(false);
  const [priceFilter, setPriceFilter] = useState("all");
  const [customPriceRange, setCustomPriceRange] = useState([0, 5000000]);
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
      const response = await api.get("kits", {
        params: {
          page: currentPage,
          "kit-name": searchTerm,
          "category-name": categoryName,
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

  const handleApplyFilter = () => {
    setCurrentPage(0);
    fetchProducts();
  };

  const handlePriceFilterChange = (e) => {
    const value = e.target.value;
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
  // const priceFilterMenu = (
  //   <Menu onClick={({ key }) => handlePriceFilterChange(key)}>
  //     <Menu.Item key="all">Tất cả giá</Menu.Item>
  //     <Menu.Item key="0-100000">0 - 100,000 VND</Menu.Item>
  //     <Menu.Item key="100000-500000">100,000 - 500,000 VND</Menu.Item>
  //     <Menu.Item key="500000-1000000">500,000 - 1,000,000 VND</Menu.Item>
  //     <Menu.Item key="1000000-2000000">1,000,000 - 2,000,000 VND</Menu.Item>
  //     <Menu.Item key="2000000-5000000">2,000,000 - 5,000,000 VND</Menu.Item>
  //     <Menu.Item key="custom">Tùy chỉnh</Menu.Item>
  //   </Menu>
  // );

  const toggleSidebar = () => {
    setSidebarVisible(!sidebarVisible);
  };

  const handleSearchInputChange = (e) => {
    setTempSearchTerm(e.target.value);
  };

  return (
    <div className="container mx-auto py-8 px-4">
      {/* Tiêu đề và nút lọc */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold">
          {categoryName || "Tất cả sản phẩm"} (
          {loading ? "Đang tải..." : dataSource.length} sản phẩm)
        </h2>
        <div className="flex items-center space-x-4">
          <Button onClick={toggleSidebar}>
            {sidebarVisible ? "Ẩn bộ lọc" : "Hiện bộ lọc"}
          </Button>
        </div>
      </div>

      {/* Khu vực nội dung chính */}
      <div className="flex">
        {/* Lưới sản phẩm */}
        <div
          className={`w-full ${sidebarVisible ? "pr-[300px]" : ""} transition-all duration-300`}
        >
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
                            <div className="flex justify-between items-center">
                              <span className="text-green-800 font-semibold">
                                {`${item["min-package-price"].toLocaleString()} - ${item["max-package-price"].toLocaleString()} VND`}
                              </span>
                              <Tag color="blue">
                                {item["kits-category"].name}
                              </Tag>
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

        {/* Thanh bên */}
        <div
          className={`fixed top-0 right-0 h-screen w-[300px] bg-white shadow-lg transform transition-transform duration-300 ease-in-out ${
            sidebarVisible ? "translate-x-0" : "translate-x-full"
          } overflow-hidden`}
        >
          <div className="h-full flex flex-col">
            <div className="p-6 flex-grow overflow-y-auto">
              <div className="flex justify-between items-center mb-6">
                <h3 className="text-xl font-semibold">Bộ lọc</h3>
                <Button
                  icon={<CloseOutlined />}
                  onClick={toggleSidebar}
                  type="text"
                />
              </div>
              <div className="space-y-6">
                <div>
                  <h4 className="font-medium mb-2">Tìm kiếm theo tên Kit</h4>
                  <Input.Search
                    placeholder="Nhập tên kit"
                    onSearch={handleSearch}
                    value={tempSearchTerm}
                    onChange={handleSearchInputChange} // cập nhật giá trị tạm thời khi người dùng nhập
                  />
                </div>
                <div>
                  <h4 className="font-medium mb-2">Lọc theo giá</h4>
                  <Radio.Group
                    onChange={handlePriceFilterChange}
                    value={priceFilter}
                  >
                    <Space direction="vertical">
                      <Radio value="all">Tất cả giá</Radio>
                      <Radio value="0-100000">0 - 100,000 VND</Radio>
                      <Radio value="100000-500000">100,000 - 500,000 VND</Radio>
                      <Radio value="500000-1000000">
                        500,000 - 1,000,000 VND
                      </Radio>
                      <Radio value="1000000-2000000">
                        1,000,000 - 2,000,000 VND
                      </Radio>
                      <Radio value="2000000-5000000">
                        2,000,000 - 5,000,000 VND
                      </Radio>
                    </Space>
                  </Radio.Group>
                  <h4 className="mt-6 font-medium">Danh mục</h4>
                  {categories.map((category) => (
                    <Button
                      key={category.id}
                      type="link"
                      onClick={() => navigate(`/category/${category.name}`)}
                    >
                      {category.name}
                    </Button>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
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
