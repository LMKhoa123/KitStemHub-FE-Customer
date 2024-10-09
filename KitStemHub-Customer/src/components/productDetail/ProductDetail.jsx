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
import { useNavigate, useParams } from "react-router-dom"; // Import useParams để lấy KitId từ URL
import { HeartOutlined, ExperimentOutlined } from "@ant-design/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import api from "../../config/axios";

const { Option } = Select;

const ProductDetail = () => {
  const { kitId } = useParams(); // Lấy KitId từ URL
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [kitDetail, setKitDetail] = useState(null);
  const [packageDetail, setPackageDetail] = useState(null);
  const [packages, setPackages] = useState([]);
  const [selectedImage, setSelectedImage] = useState(0);
  const navigate = useNavigate();

  // Fetch dữ liệu khi component mount hoặc KitId thay đổi
  useEffect(() => {
    if (kitId) {
      fetchKitDetail();
    }
  }, [kitId]); // Chạy lại khi KitId thay đổi

  // Hàm fetch chi tiết Kit từ API
  const fetchKitDetail = async () => {
    setLoading(true); // Hiển thị loading trong khi fetch
    try {
      console.log(kitId);
      const response = await api.get(`kits/${kitId}/packages`); // Gọi API với KitId
      if (response.data && response.data.status === "success") {
        const kitData = response.data.details.data.package[0].kit; // Lấy dữ liệu kit từ package đầu tiên
        setKitDetail(kitData); // Lưu chi tiết của kit vào state
        setPackages(response.data.details.data.package); // Lưu danh sách các package
        setPackageDetail(response.data.details.data.package[0]); // Mặc định chọn package đầu tiên
      } else {
        throw new Error("Unexpected response structure");
      }
    } catch (error) {
      console.error("Error fetching kit details:", error);
      message.error("Failed to fetch kit details");
    } finally {
      setLoading(false); // Tắt loading khi đã fetch xong
    }
  };

  const handleQuantityChange = (value) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + value;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    // Kiểm tra nếu không có token -> điều hướng về trang login
    if (!token) {
      message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return; // Dừng tiếp tục xử lý khi không có token
    }

    if (!packageDetail) {
      message.error("Please select a package before adding to cart");
      return;
    }

    try {
      // Gọi API để thêm vào giỏ hàng
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
      if (error.response) {
        // Trường hợp có response từ server nhưng có lỗi
        const status = error.response.status;
        console.error("Lỗi từ server:", error.response);

        if (status === 401) {
          // Bắt lỗi 401 và điều hướng đến trang login
          console.error(
            "Token đã hết hạn hoặc chưa đăng nhập, điều hướng về trang login"
          );
          localStorage.removeItem("token");
          message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
          localStorage.setItem("redirectAfterLogin", window.location.pathname);
          navigate("/login");
        } else if (status === 404) {
          message.error("Không tìm thấy package này, vui lòng thử lại.");
        } else {
          // Nếu lỗi khác ngoài 401 và 404, hiển thị chi tiết lỗi
          const errorMessage =
            error.response.data?.message || "Đã xảy ra lỗi, vui lòng thử lại.";
          message.error(`Không thể thêm vào giỏ hàng: ${errorMessage}`);
        }
      } else {
        // Trường hợp không có response (lỗi kết nối, server không phản hồi, v.v.)
        console.error("Lỗi khi thêm vào giỏ hàng:", error);
        message.error("Không thể thêm vào giỏ hàng. Vui lòng thử lại sau.");
      }
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

  // Lấy hình ảnh từ kitDetail, nếu không có thì trả về mảng rỗng
  const images = kitDetail["kit-images"]?.map((img) => img.url) || [];

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
  };

  return (
    <div className="container mx-auto px-4">
      <Breadcrumb className="py-4 text-sm">
        <Breadcrumb.Item>Kits</Breadcrumb.Item>
        <Breadcrumb.Item>{kitDetail["category"].name}</Breadcrumb.Item>
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
              className={`ml-2 text-sm ${
                kitDetail.status ? "text-green-500" : "text-red-500"
              }`}
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
                readOnly
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
    </div>
  );
};

export default ProductDetail;
