/* eslint-disable react/prop-types */
import { useEffect, useState } from "react";
import { Card, Button, Spin } from "antd";
import { RightOutlined, HeartOutlined, EyeOutlined } from "@ant-design/icons";
import api from "../../../config/axios";
import { useNavigate } from "react-router-dom";
import AOS from "aos";
import "aos/dist/aos.css";

function HomeProductCarousel() {
  const navigate = useNavigate();
  const [categoriesWithProducts, setCategoriesWithProducts] = useState([]);
  const [loading, setLoading] = useState(true);

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

  const handleProductClick = (kitId) => {
    navigate(`/productdetail/${kitId}`);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <Spin size="large" />
      </div>
    );
  }

  return (
    <div className="container mx-auto py-8 px-4 bg-white">
      {categoriesWithProducts.map((category, index) => (
        <div
          key={category.id}
          className="mb-16"
          data-aos="fade-up"
          data-aos-delay={index * 50}
        >
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold text-gray-800 relative">
              {category.name}
              <span className="absolute bottom-0 left-0 w-4/5 h-1 bg-blue-600"></span>
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
                className={`group shadow-lg hover:shadow-2xl transition-shadow duration-300 rounded-lg border border-gray-200 bg-white overflow-hidden
                  ${productIndex >= 1 ? "hidden " : "block"}
                  ${productIndex >= 2 ? "hidden " : "sm:block"}
                  ${productIndex >= 3 ? "hidden" : " md:block"}
                  ${productIndex >= 4 ? "hidden " : "lg:block"}
                   ${productIndex >= 5 ? "hidden " : "xl:block"}
                `}
                cover={
                  <img
                    alt={product.name}
                    src={product["kit-images"]?.[0]?.url || "default-image-url"}
                    className="h-48 w-full object-cover"
                  />
                }
                onClick={() => handleProductClick(product.id)}
                bodyStyle={{
                  padding: "0",
                  paddingTop: "24px",
                  paddingBottom: "24px",
                }}
              >
                <Card.Meta
                  title={
                    <div className="text-center font-semibold truncate px-2">
                      {product.name}
                    </div>
                  }
                  description={
                    <div className="text-center text-gray-600 px-2 pb-2">
                      {`${product["min-package-price"].toLocaleString()} - ${product["max-package-price"].toLocaleString()} VND`}
                    </div>
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
  );
}

export default HomeProductCarousel;
