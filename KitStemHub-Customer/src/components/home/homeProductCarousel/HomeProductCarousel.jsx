/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Card, Button, Spin, Tooltip, Tag } from "antd";
import {
  RightOutlined,
  // HeartOutlined,
  // EyeOutlined,
  ArrowUpOutlined,
} from "@ant-design/icons";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";
import CategoryCarousel from "../CategoryCarousel";

function HomeProductCarousel() {
  const navigate = useNavigate();
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [allKits, setAllKits] = useState([]); // Thêm state mới
  const [loading, setLoading] = useState(true);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const categoryRefs = useRef({});

  useEffect(() => {
    AOS.init({
      duration: 800,
      once: true,
      mirror: false,
    });
  }, []);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch categories và products theo categories như cũ
        const categoriesResponse = await api.get("categories");
        const categories = categoriesResponse.data.details.data.categories;

        const categoriesWithProductsData = await Promise.all(
          categories.map(async (category) => {
            const productsResponse = await api.get("kits", {
              params: {
                "category-name": category.name,
                page: 0,
                status: true,
              },
            });
            return {
              ...category,
              products: productsResponse.data.details.data.kits,
            };
          })
        );

        // Thêm fetch all kits
        const allKitsResponse = await api.get("kits", {
          params: {
            page: 0,
            status: true,
          },
        });

        setCategoriesWithProducts(categoriesWithProductsData);
        setAllKits(allKitsResponse.data.details.data.kits);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching data:", error);
        setLoading(false);
      }
    };

    fetchData();
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

  const handleCategoryClick = (categoryName) => {
    const element = categoryRefs.current[categoryName];
    if (element) {
      element.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: "smooth",
    });
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="bg-gradient-to-b from-gray-50 to-white p-4">
      <CategoryCarousel onCategoryClick={handleCategoryClick} />
      <div className="container mx-auto py-12 px-4">
        {/* Thêm phần hiển thị All Kits ở đầu */}
        <div className="mb-16" data-aos="fade-up">
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-4xl font-bold text-gray-800 relative font-sans">
              Tất Cả Sản Phẩm
            </h2>
            <Button
              type="link"
              className="text-blue-600 hover:text-blue-800 transition-colors duration-300 text-lg font-semibold"
              onClick={() => navigate("/category/Tất Cả")}
            >
              Xem Thêm <RightOutlined />
            </Button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4  gap-6">
            {allKits.map((product, productIndex) => (
              <Card
                key={product.id}
                hoverable
                className={` relative group hover:shadow-xl duration-300 bg-white overflow-hidden
                  ${productIndex >= 1 ? "hidden " : "block"}
                  ${productIndex >= 2 ? "hidden " : "md:block"}
                  ${productIndex >= 3 ? "hidden" : " lg:block"}
                  ${productIndex >= 4 ? "hidden " : "xl:block"}
                 
                `}
                cover={
                  <img
                    alt={product.name}
                    src={product["kit-images"]?.[0]?.url || "default-image-url"}
                    className="h-60 w-full object-cover"
                  />
                }
                onClick={() => handleProductClick(product.id)}
                bodyStyle={{
                  padding: "22px",
                  paddingTop: "24px",
                  paddingBottom: "24px",
                }}
                bordered={false}
              >
                <Card.Meta
                  title={
                    <Tooltip title={product.name}>
                      <div className="text-lg font-semibold ">
                        {product.name}
                      </div>
                    </Tooltip>
                  }
                  description={
                    <>
                      <p className="text-sm text-gray-500 mb-3 ">
                        {product.brief}
                      </p>
                      <div className="flex flex-col gap-3">
                        <span className="text-green-800 font-semibold pb-4">
                          {product["min-package-price"] ===
                          product["max-package-price"]
                            ? `${product["min-package-price"].toLocaleString()} VND`
                            : `${product["min-package-price"].toLocaleString()} - ${product["max-package-price"].toLocaleString()} VND`}
                        </span>
                        <div className="flex justify-end">
                          <Tag
                            color="blue"
                            className="absolute bottom-2 right-2 truncate px-2 py-1  font-medium"
                          >
                            {product["kits-category"].name}
                          </Tag>
                        </div>
                      </div>
                    </>
                  }
                />
                {/* <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-90 transition-opacity duration-300">
                  <Button
                    shape="circle"
                    icon={<HeartOutlined />}
                    className="bg-white hover:!bg-red-500 hover:!text-white transition-colors duration-300 border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Đã nhấn vào biểu tượng tim");
                    }}
                  />
                  <Button
                    shape="circle"
                    icon={<EyeOutlined />}
                    className="bg-white hover:!bg-red-500 hover:!text-white transition-colors duration-300 border-none"
                    onClick={(e) => {
                      e.stopPropagation();
                      console.log("Đã nhấn vào biểu tượng mắt");
                    }}
                  />
                </div> */}
              </Card>
            ))}
          </div>
        </div>

        {/* Phần hiển thị theo categories giữ nguyên */}
        {categoriesWithProducts.map((category, index) => (
          <div
            key={category.id}
            className="mb-16"
            data-aos="fade-up"
            data-aos-delay={index * 10}
            ref={(el) => (categoryRefs.current[category.name] = el)}
          >
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl font-bold text-gray-800 relative">
                {category.name}
              </h2>
              <Button
                type="link"
                className="text-blue-600 hover:text-blue-800 transition-colors duration-300 text-lg font-semibold"
                onClick={() => navigate(`/category/${category.name}`)}
              >
                Xem Thêm <RightOutlined />
              </Button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {category.products.slice(0, 5).map((product, productIndex) => (
                <Card
                  key={product.id}
                  hoverable
                  className={`group hover:shadow-xl duration-300 bg-white overflow-hidden
                    ${productIndex >= 1 ? "hidden " : "block"}
                    ${productIndex >= 2 ? "hidden " : "md:block"}
                    ${productIndex >= 3 ? "hidden" : " lg:block"}
                    ${productIndex >= 4 ? "hidden " : "xl:block"}

                  `}
                  cover={
                    <img
                      alt={product.name}
                      src={
                        product["kit-images"]?.[0]?.url || "default-image-url"
                      }
                      className="h-60 w-full object-cover"
                    />
                  }
                  onClick={() => handleProductClick(product.id)}
                  bodyStyle={{
                    padding: "22px",
                    paddingTop: "24px",
                    paddingBottom: "24px",
                  }}
                  bordered={false}
                >
                  <Card.Meta
                    title={
                      <Tooltip title={product.name}>
                        <div className="text-lg font-semibold text-pretty ">
                          {product.name}
                        </div>
                      </Tooltip>
                    }
                    description={
                      <>
                        <p className="text-sm text-gray-500 mb-2 text-pretty">
                          {product.brief}
                        </p>
                        <div className="flex flex-col gap-3">
                          <span className="text-green-800 font-semibold pb-4 text-pretty">
                            {product["min-package-price"] ===
                            product["max-package-price"]
                              ? `${product["min-package-price"].toLocaleString()} VND`
                              : `${product["min-package-price"].toLocaleString()} - ${product["max-package-price"].toLocaleString()} VND`}
                          </span>
                          <div className="flex justify-end">
                            <Tag
                              color="blue"
                              className="absolute bottom-2 right-2 truncate px-2 py-1  font-medium"
                            >
                              {product["kits-category"].name}
                            </Tag>
                          </div>
                        </div>
                      </>
                    }
                  />
                  {/* <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-90 transition-opacity duration-300">
                    <Button
                      shape="circle"
                      icon={<HeartOutlined />}
                      className="bg-white hover:!bg-red-500 hover:!text-white transition-colors duration-300 border-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Đã nhấn vào biểu tượng tim");
                      }}
                    />
                    <Button
                      shape="circle"
                      icon={<EyeOutlined />}
                      className="bg-white hover:!bg-red-500 hover:!text-white transition-colors duration-300 border-none"
                      onClick={(e) => {
                        e.stopPropagation();
                        console.log("Đã nhấn vào biểu tượng mắt");
                      }}
                    />
                  </div> */}
                </Card>
              ))}
            </div>
          </div>
        ))}
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

export default HomeProductCarousel;
