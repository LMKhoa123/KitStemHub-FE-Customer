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
  FilePdfOutlined,
  HomeOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import api from "../../config/axios";
import Loading from "../Loading";

const { Step } = Steps;
const { Title, Text } = Typography;

function OrderDetail() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      setLoading(true);
      try {
        const response = await api.get(
          // `orders/d7664f0d-4f7f-487e-874e-4a518579d8eb`
          `orders/${orderId}`
        );
        console.log(response.data.details.data.order);
        setOrderData(response.data.details.data.order);
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
      date: new Date(orderData["created-at"]).toLocaleDateString(),
    },
    { title: "Đã Xác Nhận", date: "Đang chờ" },
    { title: "Đang Giao Hàng", date: "Đang chờ" },
    {
      title: "Giao Hàng Thành Công",
      date: orderData["delivered-at"]
        ? new Date(orderData["delivered-at"]).toLocaleDateString()
        : "Dự kiến",
    },
  ];

  let currentStep;
  switch (orderData["shipping-status"]) {
    case "CHỜ XÁC NHẬN":
      currentStep = 0;
      break;
    case "ĐÃ XÁC NHẬN":
      currentStep = 1;
      break;
    case "ĐANG GIAO HÀNG":
      currentStep = 2;
      break;
    case "GIAO HÀNG THÀNH CÔNG":
      currentStep = 3;
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
        className="max-w-5xl mx-auto p-6"
      >
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/profile/cart">Đơn hàng</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>Mã đơn hàng {orderData.id}</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="mb-6 shadow-md">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
            <div>
              <Title level={3} className="mb-2">
                Mã đơn hàng: {orderData.id}
              </Title>
              <Space direction="vertical" size="small">
                <Text type="secondary">
                  Ngày đặt hàng:{" "}
                  {new Date(orderData["created-at"]).toLocaleDateString()}
                </Text>
                <Text type="success">
                  Ngày giao hàng dự kiến:{" "}
                  {orderData["deliveried-at"] !== null
                    ? new Date(orderData["deliveried-at"]).toLocaleDateString()
                    : "Đang chờ"}
                </Text>
              </Space>
            </div>
            <Space className="mt-4 md:mt-0">
              <Button icon={<FilePdfOutlined />}>Hóa đơn</Button>
              <Button
                type="primary"
                danger
                disabled={!orderData["is-lab-downloaded"]}
              >
                Yêu cầu hoàn tiền
              </Button>
            </Space>
          </div>

          <Steps current={currentStep} className="my-8">
            {orderSteps.map((step, index) => (
              <Step key={index} title={step.title} description={step.date} />
            ))}
          </Steps>

          <Divider />

          {packageOrders.length > 0 ? (
            packageOrders.map((packageOrder, index) => (
              <React.Fragment key={index}>
                <div className="flex items-center py-6">
                  <div className="mr-4">
                    <Image
                      src={
                        packageOrder.package?.kit?.image ||
                        "https://via.placeholder.com/100"
                      }
                      alt={packageOrder.package?.kit?.name || "Package Image"}
                      width={100}
                      height={100}
                      className="object-cover rounded-lg mr-6"
                    />
                  </div>

                  <div className="flex-grow">
                    <Text strong className="text-xl mb-1 block">
                      {packageOrder.package?.kit?.name || "Unknown Package"}
                    </Text>
                    <Text type="secondary" className="text-base block mb-2">
                      {packageOrder.package?.name || "Unknown Name"}
                    </Text>
                    <Text className="text-lg">
                      {formatCurrency(packageOrder.package?.price || 0)} x{" "}
                      {packageOrder["package-quantity"] || 0}
                    </Text>
                  </div>
                  <div className="text-right">
                    <Text strong className="text-xl block">
                      {formatCurrency(
                        (packageOrder.package?.price || 0) *
                          (packageOrder["package-quantity"] || 0)
                      )}
                    </Text>
                  </div>
                </div>
                {index < packageOrders.length - 1 && <Divider />}
              </React.Fragment>
            ))
          ) : (
            <Text>No package orders found</Text>
          )}

          <Divider />

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-8">
            <Card title="Thông tin thanh toán" className="h-full">
              <Space align="center" size="large">
                <Text strong>Thẻ kết thúc bằng ***123</Text>
                <Image
                  src="vnpayImage.svg"
                  alt="VNPay"
                  width={80}
                  height={80}
                />
              </Space>
            </Card>

            <Card title="Thông tin giao hàng" className="h-full">
              <Text strong className="block mb-2">
                Địa chỉ giao hàng:
              </Text>
              <Text className="block mb-4">
                {orderData["shipping-address"]}
              </Text>
              <Text className="block mb-4">
                <PhoneOutlined /> {orderData["phone-number"]}
              </Text>
              <Text strong className="block mb-2">
                Ghi chú:
              </Text>
              <Text>{orderData.note || ""}</Text>
            </Card>
          </div>

          <div className="flex flex-col md:flex-row items-start md:items-end justify-between">
            <Button
              type="primary"
              icon={<DownloadOutlined />}
              size="large"
              className="bg-green-500  border-none h-12 text-lg font-semibold mb-4 md:mb-0"
              disabled={!orderData["is-lab-downloaded"]}
            >
              Tải xuống bài lab
            </Button>
            <div className="w-full md:w-1/2">
              <Title level={4} className="mb-4">
                Tổng kết đơn hàng
              </Title>
              <div className="flex justify-between mb-2">
                <Text>Tạm tính</Text>
                <Text strong>{formatCurrency(orderData.price)}</Text>
              </div>
              <div className="flex justify-between mb-2">
                <Text>Giảm giá</Text>
                <Text strong className="text-green-500">
                  -{formatCurrency(orderData.discount)}
                </Text>
              </div>
              <Divider />
              <div className="flex justify-between items-center">
                <Text strong className="text-xl">
                  Tổng cộng
                </Text>
                <Text strong className="text-2xl text-primary">
                  {formatCurrency(orderData["total-price"])}
                </Text>
              </div>
            </div>
          </div>
        </Card>
      </motion.div>
    </ConfigProvider>
  );
}

export default OrderDetail;
