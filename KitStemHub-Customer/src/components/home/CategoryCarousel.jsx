import { useEffect, useState, useRef } from "react";
import { Button, Carousel } from "antd";
import { RightOutlined, LeftOutlined } from "@ant-design/icons";
import { useNavigate } from "react-router-dom";
import api from "../../config/axios";

function CategoryCarousel({ onCategoryClick }) {
  const navigate = useNavigate();
  const [categories, setCategories] = useState([]);
  const carouselRef = useRef();

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await api.get("categories");
        setCategories(response.data.details.data.categories);
      } catch (error) {
        console.error("Error fetching categories:", error);
      }
    };

    fetchCategories();
  }, []);

  const settings = {
    dots: false,
    infinite: false,
    speed: 500,
    slidesToShow: 8,
    slidesToScroll: 4,
    responsive: [
      {
        breakpoint: 1280,
        settings: {
          slidesToShow: 6,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 5,
          slidesToScroll: 3,
        },
      },
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 2,
        },
      },
      {
        breakpoint: 640,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 1,
        },
      },
    ],
  };

  return (
    <div className="bg-gradient-to-r from-blue-300 to-indigo-300 py-10 px-4 sm:px-6 lg:px-8 shadow-lg rounded-lg ">
      <div className="max-w-7xl mx-auto">
        <h2 className="text-2xl font-bold text-center text-indigo-700 mb-6">
          Explore Categories
        </h2>
        <div className="relative group">
          <Carousel ref={carouselRef} {...settings} className="overflow-hidden">
            {categories.map((category) => (
              <div key={category.id} className="px-2">
                <Button
                  onClick={() => onCategoryClick(category.name)}
                  className="w-full h-20 bg-white hover:bg-indigo-100 text-indigo-700 font-semibold hover:text-indigo-800 border border-indigo-200 hover:border-indigo-300 rounded-lg shadow-md hover:shadow-lg transition-all duration-300 flex items-center justify-center"
                >
                  <span className="text-md font-medium truncate">
                    {category.name}
                  </span>
                </Button>
              </div>
            ))}
          </Carousel>
          <Button
            className="absolute top-1/2 -left-6 transform -translate-y-1/2 z-10 bg-white hover:bg-indigo-100 text-indigo-700 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-left-8"
            icon={<LeftOutlined />}
            onClick={() => carouselRef.current.prev()}
            shape="circle"
          />
          <Button
            className="absolute top-1/2 -right-6 transform -translate-y-1/2 z-10 bg-white hover:bg-indigo-100 text-indigo-700 shadow-md transition-all duration-300 opacity-0 group-hover:opacity-100 group-hover:-right-8"
            icon={<RightOutlined />}
            onClick={() => carouselRef.current.next()}
            shape="circle"
          />
        </div>
      </div>
    </div>
  );
}

export default CategoryCarousel;
