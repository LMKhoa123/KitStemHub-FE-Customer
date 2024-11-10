import { useEffect, useState } from "react";
import {
  Breadcrumb,
  Button,
  Tooltip,
  List,
  Tag,
  message,
  Spin,
  Radio,
  Image,
  Tabs,
  Row,
  Col,
  Modal,
  Card,
  Carousel,
} from "antd";
import { Link, useNavigate, useParams } from "react-router-dom";
import {
  ExperimentOutlined,
  InfoCircleOutlined,
  ControlOutlined,
} from "@ant-design/icons";
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
  const [labs, setLabs] = useState([]); // lưu danh sách bài lab của kit
  const [components, setComponents] = useState([]); //lưu các linh kiện của kit
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null); // Lưu package chi tiết trong modal
  const [relatedProducts, setRelatedProducts] = useState([]); // Lưu trữ sản phẩm cùng loại
  const [kitImages, setKitImages] = useState([]); // Lưu trữ tất cả ảnh
  const [selectedImage, setSelectedImage] = useState(0); // Index của ảnh đang được chọn
  const [autoPlayInterval, setAutoPlayInterval] = useState(null);
  const [isPreviewVisible, setIsPreviewVisible] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    if (kitId) {
      Promise.all([fetchKitDetail(), fetchLabsByKit()]).catch((error) => {
        console.error("Lỗi khi tải dữ liệu:", error);
      });
    }
  }, [kitId]);

  useEffect(() => {
    if (kitImages.length > 0) {
      setKitImage(kitImages[selectedImage]);
    }
  }, [selectedImage, kitImages]);

  useEffect(() => {
    if (isPreviewVisible) {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
      return;
    }

    if (kitImages.length > 1 && !isPreviewVisible) {
      const interval = setInterval(() => {
        setSelectedImage((current) => (current + 1) % kitImages.length);
      }, 10000);
      setAutoPlayInterval(interval);
    }

    return () => {
      if (autoPlayInterval) {
        clearInterval(autoPlayInterval);
        setAutoPlayInterval(null);
      }
    };
  }, [kitImages.length, isPreviewVisible]);

  const fetchKitDetail = async () => {
    setLoading(true);
    try {
      const kitResponse = await api.get(`kits/${kitId}`);
      const kitData = kitResponse.data.details.data.kit;

      if (!kitData) {
        throw new Error("Không tìm thấy thông tin kit");
      }

      setKitDetail(kitData);
      setComponents(kitData.components || []);

      // Xử lý ảnh kit
      const images = kitData["kit-images"] || [];
      if (images.length > 0) {
        const imageUrls = images.slice(0, 5).map((img) => img.url);
        setKitImages(imageUrls);
        setKitImage(imageUrls[0]);
      }

      try {
        const packageResponse = await api.get(
          `kits/${kitId}/packages?package-status=true`
        );
        const packageData = packageResponse.data.details.data.packages;

        setPackages(packageData || []);
        setPackageDetail(packageData?.length > 0 ? packageData[0] : null);
      } catch (error) {
        console.error("Lỗi khi tải packages:", error);
        setPackages([]);
        setPackageDetail(null);
      }

      // Fetch related products
      try {
        await fetchRelatedProducts(kitData["kits-category"].name);
      } catch (error) {
        console.error("Lỗi khi tải sản phẩm liên quan:", error);
        setRelatedProducts([]);
      }
    } catch (error) {
      console.error("Lỗi khi tải thông tin kit:", error);
      setKitDetail(null);
      setPackages([]);
      setPackageDetail(null);
      setKitImages([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchRelatedProducts = async (categoryName) => {
    try {
      const response = await api.get(`/kits`, {
        params: { "category-name": categoryName },
      });
      const products = response.data.details.data.kits;
      // Lọc sản phẩm hiện tại khỏi danh sách sản phẩm cùng loại
      const filteredProducts = products.filter(
        (product) => product.id !== kitId
      );
      setRelatedProducts(filteredProducts);
    } catch (error) {
      console.error("Lỗi khi tải sản phẩm liên quan:", error);
    }
  };

  const fetchLabsByKit = async () => {
    try {
      const labResponse = await api.get(`/kits/${kitId}/lab`);
      const labData = labResponse.data.details.data.labs;
      setLabs(labData || []);
    } catch (error) {
      console.error("Lỗi khi tải danh sách bài lab:", error);
      setLabs([]);
    }
  };

  const handleProductClick = (relatedKitId) => {
    navigate(`/productdetail/${relatedKitId}`);
  };

  const handleQuantityChange = (value) => {
    setQuantity((prevQuantity) => {
      const newQuantity = prevQuantity + value;
      return newQuantity > 0 ? newQuantity : 1;
    });
  };

  const handleAddToCart = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      message.error("Bạn cần đăng nhập để thực hiện thao tác này.");
      localStorage.setItem("redirectAfterLogin", window.location.pathname);
      navigate("/login");
      return;
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
        // Thông báo thành công
        message.success(`Đã thêm ${quantity} vào giỏ hàng.`);

        // Gọi API get carts để lấy danh sách giỏ hàng cập nhật từ server
        const cartResponse = await api.get("carts");
        const updatedCartItems = cartResponse.data.details.data.carts;

        // Cập nhật badge ngay lập tức với sự kiện cartUpdate
        const cartEvent = new CustomEvent("cartUpdate", {
          detail: updatedCartItems.length, // Truyền số lượng package
        });
        window.dispatchEvent(cartEvent);

        // Đặt lại số lượng sau khi thêm sản phẩm
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

  const showPackageDetails = (pkg) => {
    setSelectedPackage(pkg); // Lưu package được chọn
    setIsModalVisible(true); // Hiển thị modal
  };

  const handleModalClose = () => {
    setIsModalVisible(false); // Đóng modal
    setSelectedPackage(null); // Xóa package được chọn
  };

  const handleThumbnailClick = (index) => {
    setSelectedImage(index);
    // Reset autoplay interval
    if (autoPlayInterval) {
      clearInterval(autoPlayInterval);
      setAutoPlayInterval(null);
    }
    // Chỉ tạo interval mới nếu không trong chế độ preview
    if (!isPreviewVisible) {
      const interval = setInterval(() => {
        setSelectedImage((current) => (current + 1) % kitImages.length);
      }, 10000);
      setAutoPlayInterval(interval);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <Spin size="large" />
      </div>
    );
  }

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
          {kitImages.length > 0 && (
            <div className="flex gap-4">
              <div className="w-24 flex flex-col gap-2">
                {kitImages.map((image, index) => (
                  <div key={index} className="relative aspect-square">
                    <img
                      src={image}
                      alt={`Thumbnail ${index + 1}`}
                      className={`absolute inset-0 w-full h-full object-cover rounded cursor-pointer hover:opacity-75 transition ${
                        selectedImage === index ? "border-2 border-red-500" : ""
                      }`}
                      onClick={() => handleThumbnailClick(index)}
                    />
                  </div>
                ))}
              </div>
              <div className="flex-1 relative aspect-square">
                <TransformWrapper>
                  <TransformComponent>
                    <Image
                      src={kitImage}
                      alt={kitDetail.name}
                      className="!w-[400px] !h-full object-contain rounded-lg"
                      preview={{
                        onVisibleChange: (visible) => {
                          setIsPreviewVisible(visible);
                          if (visible) {
                            // Khi mở preview
                            if (autoPlayInterval) {
                              clearInterval(autoPlayInterval);
                              setAutoPlayInterval(null);
                            }
                          }
                        },
                      }}
                    />
                  </TransformComponent>
                </TransformWrapper>
              </div>
            </div>
          )}
        </div>

        <div className="md:w-1/2">
          <h1 className="text-2xl font-semibold mb-2">{kitDetail.name}</h1>

          {packages.length > 0 ? (
            <div className="mb-6">
              <h3 className="font-semibold mb-2">Chọn gói:</h3>
              <Radio.Group
                onChange={(e) => handlePackageSelect(e.target.value)}
                value={packageDetail?.id}
                className="w-full space-y-2"
              >
                {packages.map((pkg) => (
                  <div
                    key={pkg.id}
                    className="flex justify-between items-center p-2 rounded-lg bg-gray-50 hover:bg-gray-100 transition"
                  >
                    <Radio value={pkg.id} className="flex-grow">
                      <span className="text-base font-medium">{pkg.name}</span>
                    </Radio>
                    <Button
                      type="link"
                      onClick={(e) => {
                        e.stopPropagation(); // Ngăn chặn sự kiện chọn radio
                        showPackageDetails(pkg);
                      }}
                    >
                      Xem chi tiết
                    </Button>
                  </div>
                ))}
              </Radio.Group>
            </div>
          ) : (
            <div className="mb-6 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
              <p className="text-yellow-700">
                Kit này hiện chưa có gói sản phẩm nào. Vui lòng quay lại sau.
              </p>
            </div>
          )}

          <Modal
            title={
              <span className="text-2xl font-semibold text-red-600 flex items-center">
                <InfoCircleOutlined className="mr-2" />
                Chi tiết gói
              </span>
            }
            visible={isModalVisible}
            onCancel={handleModalClose}
            footer={[
              <Button
                key="close"
                onClick={handleModalClose}
                className="bg-blue-500 hover:bg-blue-600 text-white rounded-lg"
              >
                Đóng
              </Button>,
            ]}
            className="p-6 rounded-lg shadow-lg"
          >
            {selectedPackage ? (
              <div className="text-gray-800 space-y-6 mt-4">
                <p className="text-xl font-semibold flex items-center">
                  <span className="mr-2 text-gray-700">Tên gói:</span>
                  <span className="text-gray-900 text-lg">
                    {selectedPackage.name}
                  </span>
                </p>
                <p className="text-xl font-semibold flex items-center">
                  <span className="mr-2 text-gray-700">Cấp độ:</span>
                  <Tag
                    color="blue"
                    className="text-lg font-semibold py-1 px-2 rounded"
                  >
                    {selectedPackage.level.name}
                  </Tag>
                </p>
                <p className="text-xl font-semibold flex items-center">
                  <span className="mr-2 text-gray-700">Trạng thái:</span>
                  {selectedPackage.status ? (
                    <Tag
                      color="green"
                      className="text-base font-semibold py-1 px-2 rounded"
                    >
                      Có sẵn
                    </Tag>
                  ) : (
                    <Tag
                      color="red"
                      className="text-base font-semibold py-1 px-2 rounded"
                    >
                      Không có sẵn
                    </Tag>
                  )}
                </p>
                <h4 className="text-2xl font-bold text-blue-600 flex items-center">
                  <ExperimentOutlined className="mr-2" />
                  Bài thực hành:
                </h4>
                {selectedPackage["package-labs"] &&
                selectedPackage["package-labs"].length > 0 ? (
                  <List
                    dataSource={selectedPackage["package-labs"]}
                    renderItem={(lab) => (
                      <List.Item className="bg-gray-50 hover:bg-gray-100 rounded-lg shadow p-4 mb-3 border border-gray-200 transition-transform transform hover:scale-105">
                        <List.Item.Meta
                          title={
                            <span className="text-lg font-semibold text-blue-700">
                              {lab.name}
                            </span>
                          }
                          description={
                            <div className="text-gray-600">
                              Số lần hỗ trợ: {lab["max-support-times"]}
                            </div>
                          }
                          className="ml-3"
                        />
                      </List.Item>
                    )}
                  />
                ) : (
                  <p className="text-gray-600">Không có bài thực hành nào.</p>
                )}
              </div>
            ) : (
              <p className="text-gray-600">Không có thông tin chi tiết.</p>
            )}
          </Modal>

          {packageDetail ? (
            <>
              <p className="text-2xl font-bold text-red-600 mb-4">
                {packageDetail.price.toLocaleString("vi-VN")} ₫
              </p>
              <p className="mb-6 text-sm text-gray-600">{kitDetail.brief}</p>
              {packageDetail && (
                <div className="border-t border-gray-200 pt-4">
                  <h3 className="font-semibold mb-2">Chi tiết gói đã chọn:</h3>
                  <p className="text-sm mb-2">Tên: {packageDetail.name}</p>
                  <p className="text-sm mb-2">
                    Cấp độ: {packageDetail.level.name}
                  </p>
                  <p className="text-sm">
                    Trạng thái:{" "}
                    {packageDetail.status ? "Có sẵn" : "Không có sẵn"}
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
                  type="red"
                  size="large"
                  className="bg-red-500 text-white hover:bg-red-600 border-none font-semibold"
                  onClick={handleAddToCart}
                >
                  Thêm vào giỏ hàng
                </Button>
                {/* <Tooltip title="Thêm vào danh sách yêu thích">
                  <Button
                    icon={<HeartOutlined />}
                    size="large"
                    className="border-gray-300"
                  />
                </Tooltip> */}
              </div>
            </>
          ) : (
            <p className="text-gray-500 italic">
              Không có thông tin giá cho sản phẩm này
            </p>
          )}
        </div>
      </div>
      <Tabs defaultActiveKey="1">
        <Tabs.TabPane
          tab={
            <span className="text-lg font-semibold">
              <ExperimentOutlined className="mr-2" />
              Bài thực hành
            </span>
          }
          key="1"
        >
          {labs.length > 0 ? (
            <List
              itemLayout="horizontal"
              dataSource={labs}
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
          ) : (
            <p>Không có bài thực hành nào.</p>
          )}
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span className="text-lg font-semibold">
              <ControlOutlined className="mr-2" />
              Linh kiện
            </span>
          }
          key="2"
        >
          <div className="mb-4">
            {components.length > 0 ? (
              <Row gutter={[16, 16]}>
                {components.map((component) => (
                  <Col xs={24} sm={12} md={8} key={component["component-id"]}>
                    <div className="bg-white rounded-lg shadow p-4 text-center border border-gray-200 transition-transform transform hover:scale-102 hover:shadow-md">
                      <h3 className="text-lg font-semibold mb-2">
                        {component["component-name"]}
                      </h3>
                      <p>Số lượng: {component["component-quantity"]}</p>
                    </div>
                  </Col>
                ))}
              </Row>
            ) : (
              <p>Không có linh kiện nào.</p>
            )}
          </div>
        </Tabs.TabPane>
        <Tabs.TabPane
          tab={
            <span className="text-lg font-semibold">
              <InfoCircleOutlined className="mr-2" />
              Mô tả Kit
            </span>
          }
          key="3"
        >
          <div className="bg-gradient-to-r from-blue-50 to-blue-100 border-l-4 border-blue-600 p-6 rounded-lg shadow-lg mb-4">
            <h3 className="text-xl font-bold text-blue-600 mb-4">
              Thông tin chi tiết
            </h3>
            <p className="text-gray-700 text-justify leading-relaxed tracking-wide">
              {kitDetail.description}
            </p>
          </div>
        </Tabs.TabPane>
      </Tabs>

      {/* Sản phẩm khác cùng loại */}
      <div className="mt-8 mb-8">
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <Spin size="large" />
          </div>
        ) : (
          <div>
            <h3 className="text-2xl font-semibold mb-4">Các sản phẩm khác</h3>
            <Carousel dots={false} arrows slidesToShow={4} slidesToScroll={1}>
              {relatedProducts.map((item) => (
                <div key={item.id} className="p-2">
                  <Card
                    hoverable
                    className="overflow-hidden rounded-lg shadow-md hover:shadow-xl transition-all duration-300"
                    cover={
                      <img
                        alt={item.name || "Hình ảnh sản phẩm"}
                        src={
                          item["kit-images"]?.length > 0
                            ? item["kit-images"][0].url
                            : ""
                        }
                        className="h-60 object-cover"
                        onError={(e) => {
                          e.target.src = "";
                        }}
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
                              {item["min-package-price"] ===
                              item["max-package-price"]
                                ? `${item["min-package-price"].toLocaleString()} VND`
                                : `${item["min-package-price"].toLocaleString()} - ${item["max-package-price"].toLocaleString()} VND`}
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
                  </Card>
                </div>
              ))}
            </Carousel>
          </div>
        )}
      </div>
    </div>
  );
};

export default ProductDetail;
