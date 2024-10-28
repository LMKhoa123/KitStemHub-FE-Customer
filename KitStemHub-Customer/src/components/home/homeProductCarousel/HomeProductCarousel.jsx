/* eslint-disable react/prop-types */
import { useEffect, useState, useRef } from "react";
import { Card, Button, Spin, Tooltip } from "antd";
import {
  RightOutlined,
  HeartOutlined,
  EyeOutlined,
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
    const fetchCategoriesAndProducts = async () => {
      try {
        const categoriesResponse = await api.get("categories");
        const categories = categoriesResponse.data.details.data.categories;

        const categoriesWithProductsData = await Promise.all(
          categories.map(async (category) => {
            const productsResponse = await api.get("kits", {
              params: {
                "category-name": category.name,
                page: 0,
                "per-page": 5,
              },
            });
            return {
              ...category,
              products: productsResponse.data.details.data.kits,
            };
          })
        );

        setCategoriesWithProducts(categoriesWithProductsData);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching categories and products:", error);
        setLoading(false);
      }
    };

    fetchCategoriesAndProducts();
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
    <div className="bg-white">
      <CategoryCarousel onCategoryClick={handleCategoryClick} />
      <div className="container mx-auto py-8 px-4">
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
                Xem tất cả <RightOutlined />
              </Button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
              {category.products.slice(0, 5).map((product, productIndex) => (
                <Card
                  key={product.id}
                  hoverable
                  className={`group hover:shadow-xl duration-300 bg-white overflow-hidden
                    ${productIndex >= 1 ? "hidden " : "block"}
                    ${productIndex >= 2 ? "hidden " : "sm:block"}
                    ${productIndex >= 3 ? "hidden" : " md:block"}
                    ${productIndex >= 4 ? "hidden " : "lg:block"}
                     ${productIndex >= 5 ? "hidden " : "xl:block"}
                  `}
                  cover={
                    <img
                      alt={product.name}
                      src={
                        product["kit-images"]?.[0]?.url || "default-image-url"
                      }
                      className="h-48 w-full object-cover"
                    />
                  }
                  onClick={() => handleProductClick(product.id)}
                  bodyStyle={{
                    padding: "0",
                    paddingTop: "24px",
                    paddingBottom: "24px",
                  }}
                  bordered={false}
                >
                  <Card.Meta
                    title={
                      <Tooltip title={product.name}>
                        <div className="text-lg font-semibold truncate">
                          {product.name}
                        </div>
                      </Tooltip>
                    }
                    description={
                      <>
                        <p className="text-sm text-gray-500 mb-2 truncate">
                          {product.brief}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-green-800 font-semibold">
                            {`${product["min-package-price"].toLocaleString()} - ${product["max-package-price"].toLocaleString()} VND`}
                          </span>
                          {/* <Tag color="blue">
                            {product["kits-category"].name}
                          </Tag> */}
                        </div>
                      </>
                    }
                  />
                  <div className="absolute top-2 right-2 flex flex-col space-y-2 opacity-0 group-hover:opacity-90 transition-opacity duration-300">
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
                  </div>
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
