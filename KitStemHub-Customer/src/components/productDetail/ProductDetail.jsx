import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Rate,
  Button,
  Tooltip,
  List,
  Tag,
  message,
  Spin,
  Radio,
  Image,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import { HeartOutlined, ExperimentOutlined } from "@ant-design/icons";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";
import api from "../../config/axios";

const ProductDetail = () => {
  const { kitId } = useParams();
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [kitDetail, setKitDetail] = useState(null);
  const [kitImage, setKitImage] = useState("");
  const [packageDetail, setPackageDetail] = useState(null);
  const [packages, setPackages] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (kitId) {
      fetchKitDetail();
    }
  }, [kitId]);

  const fetchKitDetail = async () => {
    setLoading(true);
    try {
      const kitResponse = await api.get(`kits/${kitId}`);
      // console.log(kitResponse);
      const kitData = kitResponse.data.details.data.kit;
      // console.log(kitData);
      setKitDetail(kitData);
      setKitImage(kitData["kit-images"][0].url);
      // console.log("check:" + kitData["kit-images"][0].url);
      const packageResponse = await api.get(`kits/${kitId}/packages`);
      const packageData = packageResponse.data.details.data.packages;
      setPackages(packageData);
      setPackageDetail(packageData[0]);

      setLoading(false);
    } catch (error) {
      console.error("Lỗi khi tải thông tin kit:", error);
      message.error("Không thể tải thông tin kit: " + error.message);
      setKitDetail(null);
      setPackages([]);
      setPackageDetail(null);
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
    const token = localStorage.getItem("token");

    // Kiểm tra nếu không có token -> điều hướng về trang login
    if (!token) {
      message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return; // Dừng tiếp tục xử lý khi không có token
    }

    if (!packageDetail) {
      message.error("Vui lòng chọn một gói trước khi thêm vào giỏ hàng");
      return;
    }

    try {
      const response = await api.post("carts", {
        "package-id": packageDetail.id,
        "package-quantity": quantity,
      });

      if (response.data && response.data.status === "success") {
        message.success(`Đã thêm ${quantity} vào giỏ hàng`);
        setQuantity(1);
      } else {
        throw new Error("Không thể thêm vào giỏ hàng");
      }
    } catch (error) {
      if (error.response) {
        const status = error.response.status;
        console.error("Lỗi từ server:", error.response);

        if (status === 401) {
          console.error(
            "Token đã hết hạn hoặc chưa đăng nhập, điều hướng về trang đăng nhập"
          );
          localStorage.removeItem("token");
          message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
          localStorage.setItem("redirectAfterLogin", window.location.pathname);
          navigate("/login");
        } else if (status === 404) {
          message.error("Không tìm thấy gói này, vui lòng thử lại.");
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
    return <div>Không có thông tin chi tiết về kit</div>;
  }

  // Lấy hình ảnh từ kitDetail, nếu không có thì trả về mảng rỗng
  // const images = kitDetail["kit-images"]?.map((img) => img.url) || [];

  // const handleThumbnailClick = (index) => {
  //   setSelectedImage(index);
  // };

  return (
    <div className="container mx-auto px-4">
      <Breadcrumb className="py-4 text-sm">
        <Breadcrumb.Item>
          <Link to="/">Trang Chủ</Link>
        </Breadcrumb.Item>
        <Breadcrumb.Item>{kitDetail.name}</Breadcrumb.Item>
      </Breadcrumb>

      <div className="flex flex-col md:flex-row gap-8">
        <div className="md:w-1/2">
          {/* dung xoa */}
          {/* <div className="w-1/5">
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
            </div> */}
          <TransformWrapper>
            <TransformComponent>
              <Image
                src={kitImage}
                alt="Sản phẩm đã chọn"
                className="w-full rounded-lg"
              />
            </TransformComponent>
          </TransformWrapper>
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
              {kitDetail.status ? "Còn hàng" : "Hết hàng"}
            </span>
          </div>

          <div className="mb-6">
            <h3 className="font-semibold mb-2">Chọn gói:</h3>
            <Radio.Group
              onChange={(e) => handlePackageSelect(e.target.value)}
              value={packageDetail?.id}
              className="w-full space-y-2"
            >
              {packages.map((pkg) => (
                <Radio
                  key={pkg.id}
                  value={pkg.id}
                  className="flex items-center p-1 rounded-lg transition-shadow duration-300 cursor-pointer"
                >
                  <div className="flex flex-col">
                    <span className="text-base font-medium">{pkg.name}</span>
                    <span className="text-sm text-gray-500">
                      {pkg.description}
                    </span>
                  </div>
                </Radio>
              ))}
            </Radio.Group>
          </div>
          <p className="text-2xl font-bold text-red-600 mb-4">
            {packageDetail.price.toLocaleString("vi-VN")} ₫
          </p>
          <p className="mb-6 text-sm text-gray-600">{kitDetail.brief}</p>
          {packageDetail && (
            <div className="border-t border-gray-200 pt-4">
              <h3 className="font-semibold mb-2">Chi tiết gói đã chọn:</h3>
              <p className="text-sm mb-2">Tên: {packageDetail.name}</p>
              <p className="text-sm mb-2">Cấp độ: {packageDetail.level.name}</p>
              <p className="text-sm">
                Trạng thái: {packageDetail.status ? "Có sẵn" : "Không có sẵn"}
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
              Thêm vào giỏ hàng
            </Button>
            <Tooltip title="Thêm vào danh sách yêu thích">
              <Button
                icon={<HeartOutlined />}
                size="large"
                className="border-gray-300"
              />
            </Tooltip>
          </div>
          {/* Lab Exercises Section */}
          {packageDetail && packageDetail["package-labs"] && (
            <div className="mt-16 mb-12">
              <h2 className="text-2xl font-bold mb-6 flex items-center">
                <span className="bg-blue-600 text-white px-4 py-2 rounded-l-full flex items-center">
                  <ExperimentOutlined className="mr-2" /> Bài thực hành
                </span>
                <span className="flex-grow border-t-2 border-blue-600 ml-4"></span>
              </h2>
              <List
                itemLayout="horizontal"
                dataSource={packageDetail["package-labs"]}
                renderItem={(lab) => (
                  <List.Item className="bg-white rounded-lg shadow-md p-6 mb-4 hover:shadow-lg transition-shadow duration-300 border border-gray-200">
                    <List.Item.Meta
                      className="ml-4"
                      title={
                        <span className="text-xl font-semibold text-blue-700">
                          {lab.name}
                        </span>
                      }
                      description={
                        <div className="mt-2">
                          <p className="text-gray-700 mb-3">
                            <span className="font-medium">Tác giả:</span>{" "}
                            {lab.author}
                          </p>
                          <div className="flex flex-wrap items-center gap-4">
                            <Tag color="blue" className="px-3 py-1 text-sm">
                              {lab.level.name}
                            </Tag>
                            <span className="text-sm text-gray-600">
                              <span className="font-medium">Giá:</span>{" "}
                              {lab.price.toLocaleString("vi-VN")} ₫
                            </span>
                            <span className="text-sm text-gray-600">
                              <span className="font-medium">
                                Số lần hỗ trợ tối đa:
                              </span>{" "}
                              {lab["max-support-times"]}
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
      </div>
      {/* Kit Description Section */}
      <div className="border-t border-gray-200 pt-8 my-8">
        <h3 className="text-2xl font-bold mb-4 text-blue-700">Mô tả Kit</h3>
        <div className="bg-blue-50 border-l-4 border-blue-500 p-8 rounded-r-lg">
          <p className="text-gray-700 leading-relaxed">
            {kitDetail.description}
          </p>
        </div>
      </div>
    </div>
  );
};

export default ProductDetail;
