import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Rate,
  Button,
  Tooltip,
  List,
  Tag,
  message,
  Select,
  Spin,
} from "antd";
import {
  HeartOutlined,
  ShoppingCartOutlined,
  ExperimentOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import api from "../../config/axios";

const { Option } = Select;

const ProductDetail = () => {
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [kitDetail, setKitDetail] = useState(null);
  const [packageDetail, setPackageDetail] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);

  useEffect(() => {
    fetchKitDetail();
  }, []);

  const fetchKitDetail = async () => {
    setLoading(true);
    try {
      const response = await api.get(`kits/1/packages`);
      console.log(response.data);
      if (response.data && response.data.status === "success") {
        const packageData = response.data.details.data.package;
        setKitDetail(packageData[0].kit); //  the kit details are the same for all packages
        setPackageDetail(packageData[0]); // Set the first package as default
        setPackages(packageData); // Store all packages
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching kit details:", error);
      message.error("Failed to fetch kit details");
    } finally {
      setLoading(false);
    }
  };

  const handleQuantityChange = (value) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + value;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  const handleAddToCart = async () => {
    if (!packageDetail) {
      message.error("Please select a package before adding to cart");
      return;
    }
    try {
      const response = await api.post("carts", {
        "package-id": packageDetail.id,
        "package-quantity": quantity,
      });

      if (response.data && response.data.status === "success") {
        message.success(`Đã thêm ${quantity} vào giỏ hàng`);
        setQuantity(1); // Reset số lượng sau khi thêm vào giỏ hàng
      } else {
        throw new Error("Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      console.error("Lỗi khi thêm vào giỏ hàng:", error);
      message.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.");
    }
  };

  const handlePackageSelect = (packageId) => {
    const selected = packages.find((pkg) => pkg.id === packageId);
    setPackageDetail(selected);
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

  if (!kitDetail) {
    return <div>No kit details available</div>;
  }

  //test_image_click
  const images = [
    "https://nshopvn.com/wp-content/uploads/2024/08/r5xc-comboxedieukhientuxacocameragiamsat-1-1.jpg",
    "https://nshopvn.com/wp-content/uploads/2023/05/bo-kit-hoc-lap-trinh-arduino-uno-r3-pro-kit-jjcd-6.jpg",
    "https://nshopvn.com/wp-content/uploads/2024/08/r5xc-comboxedieukhientuxacocameragiamsat-3-1.jpg",
    "https://nshopvn.com/wp-content/uploads/2024/08/r5xc-comboxedieukhientuxacocameragiamsat-4-1.jpg",
  ];
  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };
  return (
    <div className="container mx-auto px-4">
      <Breadcrumb className="py-4 text-sm">
        <Breadcrumb.Item>Kits</Breadcrumb.Item>
        <Breadcrumb.Item>{kitDetail.category.name}</Breadcrumb.Item>
        <Breadcrumb.Item>{kitDetail.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          <div className="flex gap-4">
            <div className="w-1/5">
              {images.map((image, index) => (
                <img
                  key={index}
                  src={image}
                  alt={`Thumbnail ${index + 1}`}
                  className={`w-full mb-2 rounded cursor-pointer hover:opacity-75 transition ${
                    selectedImage === index ? "border-2 border-red-500" : ""
                  }`}
                  onClick={() => handleThumbnailClick(index)}
                />
              ))}
            </div>
            <div className="w-4/5">
              <TransformWrapper>
                <TransformComponent>
                  <img
                    src={images[selectedImage]}
                    alt="Selected product"
                    className="w-full rounded-lg"
                  />
                </TransformComponent>
              </TransformWrapper>
            </div>
          </div>
        </div>

        <div className="md:w-1/2">
          <h1 className="text-2xl font-semibold mb-2">{kitDetail.name}</h1>
          <div className="flex items-center mb-4">
            <Rate
              disabled
              defaultValue={4.5}
              className="text-yellow-400 text-sm"
            />
            <span className="ml-2 text-gray-600 text-sm">(100 Reviews)</span>
            <span
              className={`ml-2 text-sm ${kitDetail.status ? "text-green-500" : "text-red-500"}`}
            >
              {kitDetail.status ? "In Stock" : "Out of Stock"}
            </span>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-4">
            {kitDetail["purchase-cost"].toLocaleString("vi-VN")} ₫
          </p>
          <p className="mb-6 text-sm text-gray-600">{kitDetail.brief}</p>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Select a Package:</h3>
            <Select
              style={{ width: "100%" }}
              placeholder="Select a package"
              onChange={handlePackageSelect}
              defaultValue={packageDetail?.id}
            >
              {packages.map((pkg) => (
                <Option key={pkg.id} value={pkg.id}>
                  {pkg.name}
                </Option>
              ))}
            </Select>
          </div>

          {packageDetail && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-2">Selected Package Details:</h3>
              <p className="text-sm mb-2">Name: {packageDetail.name}</p>
              <p className="text-sm mb-2">Level: {packageDetail.level.name}</p>
              <p className="text-sm mb-2">
                Price: {packageDetail.price.toLocaleString("vi-VN")} ₫
              </p>
              <p className="text-sm">
                Status: {packageDetail.status ? "Available" : "Unavailable"}
              </p>
            </div>
          )}

          <div className="flex items-center gap-4 mb-6 mt-6">
            <div className="flex border rounded">
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-red-500 hover:text-white"
                onClick={() => handleQuantityChange(-1)}
              >
                -
              </button>
              <input
                type="text"
                value={quantity}
                className="w-12 text-center"
              />
              <button
                className="px-3 py-1 bg-gray-100 hover:bg-red-500 hover:text-white"
                onClick={() => handleQuantityChange(1)}
              >
                +
              </button>
            </div>
            <Button
              type="primary"
              size="large"
              className="bg-red-500 hover:bg-red-600 border-none"
              onClick={handleAddToCart}
            >
              Add To Cart
            </Button>
            <Tooltip title="Add to Wishlist">
              <Button
                icon={<HeartOutlined />}
                size="large"
                className="border-gray-300"
              />
            </Tooltip>
          </div>

          <div className="border-t border-gray-200 pt-4">
            <h3 className="font-semibold mb-2">Kit Description:</h3>
            <p className="text-sm mb-2">{kitDetail.description}</p>
          </div>
        </div>
      </div>

      {/* Lab Exercises Section */}
      {packageDetail && packageDetail["package-labs"] && (
        <div className="mt-16 mb-12">
          <h2 className="text-2xl font-bold mb-6 flex items-center">
            <span className="bg-blue-500 text-white px-4 py-2 rounded-l-full flex items-center">
              <ExperimentOutlined className="mr-2" /> Lab Exercises
            </span>
            <span className="flex-grow border-t-2 border-blue-500 ml-4"></span>
          </h2>
          <List
            itemLayout="horizontal"
            dataSource={packageDetail["package-labs"]}
            renderItem={(lab) => (
              <List.Item className="bg-white rounded-lg shadow-md p-4 mb-4 hover:shadow-lg transition-shadow duration-300">
                <List.Item.Meta
                  title={
                    <span className="text-lg font-semibold">{lab.name}</span>
                  }
                  description={
                    <div>
                      <p className="text-gray-600 mb-2">Author: {lab.author}</p>
                      <div className="flex items-center gap-4">
                        <Tag color="blue">{lab.level.name}</Tag>
                        <span className="text-sm text-gray-500">
                          Price: {lab.price.toLocaleString("vi-VN")} ₫
                        </span>
                        <span className="text-sm text-gray-500">
                          Max Support Times: {lab["max-support-times"]}
                        </span>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            )}
          />
        </div>
      )}

      {/* //relative item part 
      <div className="mt-16 mb-12">
        <h2 className="text-2xl font-bold mb-6 flex items-center">
          <span className="bg-red-500 text-white px-4 py-2 rounded-l-full">
            Related Item
          </span>
          <span className="flex-grow border-t-2 border-red-500 ml-4"></span>
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6">
          {relatedItems.map((item) => (
            <Link to={`/product/${item.id}`} key={item.id} className="block">
              <div className="bg-white rounded-lg shadow-md relative overflow-hidden group">
                {item.discount && (
                  <span className="absolute top-2 left-2 bg-red-500 text-white text-xs px-2 py-1 rounded-full z-10">
                    -{item.discount}%
                  </span>
                )}
                <div className="relative aspect-w-1 aspect-h-1 overflow-hidden">
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover object-center transform group-hover:scale-110 transition-transform duration-300"
                  />
                  <div className="absolute inset-0 bg-black bg-opacity-40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"></div>
                </div>
                <div className="p-4">
                  <h3 className="font-semibold mb-2 text-sm truncate">
                    {item.name}
                  </h3>
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-red-500 font-bold">
                      ${item.price}
                    </span>
                    {item.oldPrice && (
                      <span className="text-gray-400 line-through text-sm">
                        ${item.oldPrice}
                      </span>
                    )}
                  </div>
                  <div className="flex items-center">
                    <Rate
                      disabled
                      defaultValue={item.rating}
                      className="text-yellow-400 text-xs"
                    />
                    <span className="ml-2 text-gray-500 text-xs">
                      ({item.reviews})
                    </span>
                  </div>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </div> */}
    </div>
  );
};

export default ProductDetail;
