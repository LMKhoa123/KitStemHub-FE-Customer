import React, { useState, useEffect } from "react";
import { useParams } from "react-router-dom";
import {
  Card,
  Steps,
  Button,
  Image,
  ConfigProvider,
  Space,
  Typography,
  Divider,
  Breadcrumb,
} from "antd";
import { motion } from "framer-motion";
import {
  DownloadOutlined,
  HomeOutlined,
  PhoneOutlined,
  ExclamationCircleOutlined,
  CloseCircleOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import api from "../../config/axios";
import Loading from "../Loading";
import { toast } from "react-toastify";

const { Step } = Steps;
const { Title, Text } = Typography;

function OrderDetail() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [labs, setLabs] = useState([]);

  const formatDate = (date) => {
    if (!date) return "Đang chờ";
    return new Date(date).toLocaleDateString("vi-VN", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  };

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const response = await api.get(`orders/${orderId}`);
        // console.log(response.data.details.data.order);
        setOrderData(response.data.details.data.order);

        const packageOrders =
          response.data.details.data.order["package-orders"];
        if (packageOrders && Array.isArray(packageOrders)) {
          const allLabs = packageOrders.flatMap(
            (po) => po.package["package-labs"] || []
          );
          setLabs(
            allLabs.map((lab) => ({
              id: lab.id,
              name: lab.name,
              price: lab.price,
              maxSupportTimes: lab["max-support-times"],
              author: lab.author,
              status: lab.status,
              level: lab.level ? lab.level.name : null,
            }))
          );
        } else {
          setLabs([]);
        }
        console.log(labs);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setLoading(false);
      }
    };

    if (orderId) {
      fetchOrderData();
    } else {
      console.log("No orderId found");
    }
  }, [orderId]);

  const handleLabDownload = async (labId, labName) => {
    try {
      const response = await api.get(
        `labs/${labId}/orders/${orderId}/download`,
        { responseType: "blob" }
      );

      // Sử dụng tên lab được truyền vào
      let filename = `${labName}.pdf`;

      // Extract filename from Content-Disposition header if available
      const contentDisposition = response.headers["content-disposition"];
      if (contentDisposition) {
        const filenameMatch = contentDisposition.match(/filename="?(.+)"?/i);
        if (filenameMatch && filenameMatch[1]) {
          filename = filenameMatch[1];
        }
      }

      // Tạo Blob URL cho file download và trigger việc tải xuống
      const url = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", filename);
      document.body.appendChild(link);
      link.click();
      link.remove();

      // Optionally, revoke the object URL after some time to free up memory
      setTimeout(() => window.URL.revokeObjectURL(url), 100);
    } catch (error) {
      console.error("Error downloading the lab:", error);
      toast.error("Không thể tải xuống bài lab. Vui lòng thử lại sau.");
    }
  };

  if (loading) {
    return <Loading />;
  }

  if (!orderData) {
    return <div>Order not found</div>;
  }

  const packageOrders = Array.isArray(orderData["package-orders"])
    ? orderData["package-orders"]
    : [];

  const orderSteps = [
    {
      title: "Chờ Xác Nhận",
      date: formatDate(orderData["created-at"]),
      icon: null,
    },
    {
      title: "Xác Nhận",
      date: "Đơn hàng đã duyệt",
      icon: null,
    },
    {
      title: "Giao Hàng",
      date: "Đang giao hàng",
      icon: null,
    },
    {
      title: "Trạng Thái Giao Hàng",
      date: formatDate(orderData["delivered-at"]),
      icon: null,
    },
  ];

  let currentStep;
  let stepStatus = "process";
  let failureReason = "";

  switch (orderData["shipping-status"]) {
    case "CHỜ XÁC NHẬN":
      currentStep = 1;
      break;
    case "ĐÃ XÁC NHẬN":
      currentStep = 2;
      break;
    case "ĐANG GIAO HÀNG":
      currentStep = 3;
      break;
    case "GIAO HÀNG THÀNH CÔNG":
      currentStep = 4;
      stepStatus = "finish";
      orderSteps[3] = {
        title: (
          <span className="text-green-500 font-medium">
            Giao Hàng Thành Công
          </span>
        ),
        date: (
          <div className="space-y-1">
            <div className="flex items-center text-green-500">
              <CheckCircleOutlined className="mr-1" />
              <span>{formatDate(orderData["delivered-at"])}</span>
            </div>
            <div className="text-green-400 text-sm">
              <span>Đã giao thành công</span>
            </div>
          </div>
        ),
        icon: (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-green-50">
            <CheckCircleOutlined className="text-green-500 text-lg" />
          </div>
        ),
      };
      break;
    case "GIAO HÀNG THẤT BẠI":
      currentStep = 4;
      stepStatus = "error";
      failureReason =
        orderData["failure-reason"] || "Không thể liên hệ với người nhận";
      orderSteps[3] = {
        title: (
          <span className="text-red-500 font-medium">Giao Hàng Thất Bại</span>
        ),
        date: (
          <div className="space-y-1">
            <div className="flex items-center text-red-500">
              <CloseCircleOutlined className="mr-1" />
              <span>{formatDate(orderData["delivered-at"])}</span>
            </div>
            <div className="text-red-400 text-sm">
              <ExclamationCircleOutlined className="mr-1" />
              {failureReason}
            </div>
          </div>
        ),
        icon: (
          <div className="flex items-center justify-center w-8 h-8 rounded-full bg-red-50">
            <CloseCircleOutlined className="text-red-500 text-lg" />
          </div>
        ),
      };
      break;
    default:
      currentStep = 0; // Mặc định là bước đầu tiên nếu status không khớp
  }

  // Nếu lab đã được tải xuống, đặt currentStep thành bước cuối cùng
  if (orderData["is-lab-downloaded"]) {
    currentStep = 3;
  }

  // Hàm định dạng số thành chuỗi tiền tệ VND
  const formatCurrency = (amount) => {
    return new Intl.NumberFormat("vi-VN", {
      style: "currency",
      currency: "VND",
    }).format(amount);
  };

  return (
    <ConfigProvider
      theme={{
        token: {
          colorPrimary: "#1890ff",
          borderRadius: 8,
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-6xl mx-auto p-6"
      >
        <Breadcrumb className="mb-6 text-sm">
          <Breadcrumb.Item>
            <Link
              to="/home"
              className="text-blue-500 hover:text-blue-700"
              onClick={() => localStorage.removeItem("cart")}
            >
              <HomeOutlined className="mr-1" />
              Trang chủ
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link
              to="/profile/cart"
              className="text-blue-500 hover:text-blue-700"
              onClick={() => localStorage.removeItem("cart")}
            >
              Đơn hàng
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Mã đơn hàng {orderData.id}</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="mb-8 shadow-lg rounded-lg overflow-hidden">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6 bg-gray-50 p-6 rounded-t-lg">
            <div>
              <Title level={3} className="mb-2 text-gray-800">
                Mã đơn hàng: {orderData.id}
              </Title>
              <Space direction="vertical" size="small">
                <Text type="secondary">
                  Ngày đặt hàng:{" "}
                  <span className="font-semibold">
                    {formatDate(orderData["created-at"])}
                  </span>
                </Text>
                <Text type="success">
                  Ngày chuẩn bị hàng:{" "}
                  <span className="font-semibold">
                    {formatDate(orderData["delivered-at"])}
                  </span>
                </Text>
              </Space>
            </div>
            {/* <Space className="mt-4 md:mt-0">
              <Button
                icon={<FilePdfOutlined />}
                className="bg-white hover:bg-gray-100"
              >
                Hóa đơn
              </Button>
              <Button
                type="primary"
                danger
                disabled={
                  orderData["shipping-status"] !== "GIAO HÀNG THÀNH CÔNG"
                }
                className="hover:opacity-90"
              >
                Yêu cầu hoàn tiền
              </Button>
            </Space> */}
          </div>

          <div className="relative">
            <Steps
              current={currentStep}
              status={stepStatus}
              className="my-8 px-6"
            >
              {orderSteps.map((step, index) => (
                <Step
                  key={index}
                  title={step.title}
                  description={index <= currentStep ? step.date : null}
                  icon={step.icon}
                />
              ))}
            </Steps>

            {/* Thông báo khi giao hàng thành công */}
            {orderData["shipping-status"] === "GIAO HÀNG THÀNH CÔNG" && (
              <div className="mt-4 p-4 bg-green-50 border border-green-200 rounded-lg mx-6 shadow-sm">
                <div className="flex items-start">
                  <CheckCircleOutlined className="text-green-500 text-lg mt-1 mr-2" />
                  <div>
                    <Text strong className="text-green-500 block mb-1">
                      Đơn hàng đã giao thành công
                    </Text>
                    <Text className="text-green-600">
                      Cảm ơn bạn đã tin tưởng và sử dụng dịch vụ của chúng tôi
                    </Text>
                    <div className="mt-2">
                      <Text type="success" className="text-sm">
                        Trân Trọng!
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Thông báo khi giao hàng thất bại */}
            {orderData["shipping-status"] === "GIAO HÀNG THẤT BẠI" && (
              <div className="mt-4 p-4 bg-red-50 border border-red-200 rounded-lg mx-6 shadow-sm">
                <div className="flex items-start">
                  <ExclamationCircleOutlined className="text-red-500 text-lg mt-1 mr-2" />
                  <div>
                    <Text strong className="text-red-500 block mb-1">
                      Đơn hàng giao không thành công
                    </Text>
                    <Text className="text-red-600">{failureReason}</Text>
                    <div className="mt-2">
                      <Text type="secondary" className="text-sm">
                        Vui lòng liên hệ hotline của cửa hàng để được hỗ trợ
                      </Text>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>

          <Divider className="my-6" />

          <div className="px-6">
            {packageOrders.length > 0 ? (
              packageOrders.map((packageOrder, index) => (
                <React.Fragment key={index}>
                  <div className="flex items-center py-6 hover:bg-gray-50 transition-colors duration-200 rounded-lg">
                    <div className="mr-6">
                      <Image
                        src={
                          packageOrder.package?.kit?.["kit-images"][0].url ||
                          "https://via.placeholder.com/100"
                        }
                        alt={packageOrder.package?.kit?.name || "Package Image"}
                        width={100}
                        height={100}
                        className="object-cover rounded-lg shadow-md"
                      />
                    </div>
                    <div className="flex-grow">
                      <Text strong className="text-xl mb-1 block text-gray-800">
                        {packageOrder.package?.kit?.name || "Unknown Package"}
                      </Text>
                      <Text type="secondary" className="text-base block mb-2">
                        {packageOrder.package?.name || "Unknown Name"}
                      </Text>
                      <Text className="text-lg text-gray-600">
                        {formatCurrency(packageOrder.package?.price || 0)} x{" "}
                        {packageOrder["package-quantity"] || 0}
                      </Text>
                    </div>
                    <div className="text-right">
                      <Text strong className="text-xl block text-gray-600">
                        {formatCurrency(
                          (packageOrder.package?.price || 0) *
                            (packageOrder["package-quantity"] || 0)
                        )}
                      </Text>
                    </div>
                  </div>
                  {index < packageOrders.length - 1 && (
                    <Divider className="my-4" />
                  )}
                </React.Fragment>
              ))
            ) : (
              <Text className="text-gray-500 italic">
                Không tìm thấy thông tin gói sản phẩm
              </Text>
            )}
          </div>

          <Divider className="my-6" />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8 px-6">
            <Card title="Thông tin thanh toán" className="h-full shadow-md">
              <Space align="center" size="large">
                {orderData.payment.method.name === "Cash" ? (
                  <>
                    <Text strong>Thanh toán bằng tiền mặt</Text>

                    <Image
                      src="/cash.svg"
                      alt="Cash Payment"
                      width={30}
                      height={30}
                    />
                  </>
                ) : (
                  <>
                    <Text strong>Thanh toán bằng</Text>
                    <Image
                      src="/vnpayImage.svg"
                      alt="VNPay"
                      width={80}
                      height={80}
                    />
                  </>
                )}
              </Space>
            </Card>

            <Card title="Thông tin giao hàng" className="h-full shadow-md">
              <Text strong className="block mb-2">
                Địa chỉ giao hàng:
              </Text>
              <Text className="block mb-4 text-gray-600">
                {orderData["shipping-address"]}
              </Text>
              <Text className="block mb-4">
                <PhoneOutlined className="mr-2 text-blue-500" />{" "}
                {orderData["phone-number"]}
              </Text>
              <Text strong className="block mb-2">
                Ghi chú:
              </Text>
              <Text className="text-gray-600">
                {orderData.note || "Không có ghi chú"}
              </Text>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row gap-8 px-6 mt-8">
            <div className="mb-6 flex-1 py-6 rounded-lg bg-white ">
              <Title level={4} className="mb-6 !text-gray-800 pb-2">
                Các bài lab có thể tải về:
              </Title>

              <div className="space-y-2">
                {labs.map((lab) => (
                  <div
                    key={lab.id}
                    className="flex items-center justify-between rounded-lg hover:bg-gray-100 transition-colors duration-300"
                  >
                    <p className="text-base !text-gray-700">{lab.name}</p>
                    <Button
                      type="primary"
                      icon={<DownloadOutlined />}
                      size="large"
                      className="bg-green-50 
                      !text-black hover:!text-white hover:!bg-green-600 border-none h-12 text-lg font-semibold transition-all duration-300 transform hover:scale-105 flex items-center justify-center !px-4"
                      disabled={
                        orderData["shipping-status"] !== "GIAO HÀNG THÀNH CÔNG"
                      }
                      onClick={() => handleLabDownload(lab.id, lab.name)}
                    />
                  </div>
                ))}
              </div>
            </div>

            <div className="mb-6 flex-1 py-6 rounded-lg ">
              <Title level={4} className="mb-4 text-gray-800">
                Tổng kết đơn hàng
              </Title>
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Tạm tính</Text>
                  <Text strong>{formatCurrency(orderData.price)}</Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Phí Vận Chuyển</Text>
                  <Text strong>
                    {formatCurrency(orderData["shipping-fee"])}
                  </Text>
                </div>
                <div className="flex justify-between items-center">
                  <Text className="text-gray-600">Giảm giá</Text>
                  <Text strong className="text-gray-500">
                    -{formatCurrency(orderData.discount)}
                  </Text>
                </div>
                <br />

                <Divider />
                <div className="flex justify-between items-center">
                  <Text strong className="text-xl text-gray-800 pt-4">
                    Tổng cộng
                  </Text>
                  <Text strong className="text-2xl text-green-600 pt-4">
                    {formatCurrency(orderData["total-price"])}
                  </Text>
                </div>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </ConfigProvider>
  );
}

export default OrderDetail;
