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
  Spin,
} from "antd";
import { motion } from "framer-motion";
import {
  DownloadOutlined,
  FilePdfOutlined,
  HomeOutlined,
} from "@ant-design/icons";
import { Link } from "react-router-dom";

import api from "../../config/axios";

const { Step } = Steps;
const { Title, Text } = Typography;

function OrderDetail() {
  const { orderId } = useParams();
  const [orderData, setOrderData] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrderData = async () => {
      try {
        const response = await api.get(
          `orders/d7664f0d-4f7f-487e-874e-4a518579d8eb`
        );
        // console.log(response.data);
        setOrderData(response.data.details.data.order);
        setLoading(false);
      } catch (error) {
        console.error("Error fetching order data:", error);
        setLoading(false);
      }
    };

    fetchOrderData();
  }, [orderId]);

  if (loading) {
    return <Spin size="large" />;
  }

  if (!orderData) {
    return <div>Order not found</div>;
  }

  const orderSteps = [
    {
      title: "Chờ Xác Nhận",
      date: new Date(orderData["created-at"]).toLocaleDateString(),
    },
    { title: "Đã Xác Nhận", date: "Pending" },
    { title: "Đang Giao Hàng", date: "Pending" },
    {
      title: "Giao Hàng Thành Công",
      date: orderData["delivered-at"]
        ? new Date(orderData["delivered-at"]).toLocaleDateString()
        : "Expected",
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
          // có thể tùy chỉnh theme ở đây nếu cần
        },
      }}
    >
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="max-w-4xl mx-auto p-6"
      >
        <Breadcrumb className="mb-6">
          <Breadcrumb.Item>
            <Link to="/">
              <HomeOutlined />
            </Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>
            <Link to="/profile/cart">Orders</Link>
          </Breadcrumb.Item>
          <Breadcrumb.Item>ID {orderData.id}</Breadcrumb.Item>
        </Breadcrumb>

        <Card className="mb-6">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-4">
            <div>
              <Title level={4} className="mb-1">
                Order ID: {orderData.id}
              </Title>
              <div className="flex flex-col sm:flex-row sm:space-x-4">
                <Text type="secondary" className="text-sm">
                  Order date:{" "}
                  {new Date(orderData["created-at"]).toLocaleDateString()}
                </Text>
                <Text type="success" className="text-sm">
                  Dự kiến giao hàng:{" "}
                  {orderData["deliveried-at"] !== null
                    ? ""
                    : new Date(orderData["deliveried-at"]).toLocaleDateString()}
                </Text>
              </div>
            </div>
            <Space className="mt-4 md:mt-0">
              <Button icon={<FilePdfOutlined />} size="small">
                Invoice
              </Button>
              <Button type="primary" danger size="small">
                Order Refund
              </Button>
            </Space>
          </div>

          <Steps current={currentStep} className="mt-6" size="small">
            {orderSteps.map((step, index) => (
              <Step key={index} title={step.title} description={step.date} />
            ))}
          </Steps>
        </Card>

        <Card className="mb-8">
          {orderData["package-orders"].map((packageOrder, index) => (
            <React.Fragment key={index}>
              <div className="flex items-center py-4 ">
                <div className="mr-4">
                  <Image
                    src={
                      packageOrder.package.kit.image ||
                      "https://via.placeholder.com/80"
                    }
                    alt={packageOrder.package.kit.name}
                    width={80}
                    height={80}
                    className="object-cover rounded-md mr-4"
                  />
                </div>

                <div className="flex-grow">
                  <Text strong className="text-lg">
                    {packageOrder.package.kit.name}
                  </Text>
                  <Text type="secondary" className="block">
                    {packageOrder.package.name}
                  </Text>
                </div>
                <div className="text-right">
                  <Text strong className="text-lg">
                    {formatCurrency(packageOrder.package.price)}
                  </Text>
                  <Text type="secondary" className="block">
                    Qty: {packageOrder["package-quantity"]}
                  </Text>
                </div>
              </div>
              {index < orderData["package-orders"].length - 1 && <Divider />}
            </React.Fragment>
          ))}
        </Card>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card title="Payment" className="h-full">
            <Space align="center"></Space>
          </Card>
          <Card title="Delivery" className="h-full">
            <Text>Address</Text>
            <Text strong className="block">
              Số nhà 123, Đường Lê Lợi
            </Text>
            <Text strong className="block">
              Thành phố Hồ Chí Minh
            </Text>
            <Text strong className="block">
              Việt Nam
            </Text>
            <Text strong className="block">
              0912-345-678
            </Text>
            <Text>Note: {orderData.note}</Text>
          </Card>
        </div>

        <Card className="mb-8">
          <Title level={4} className="mb-4">
            Order Summary
          </Title>
          <div className="flex justify-between mb-2">
            <Text>Subtotal</Text>
            <Text strong>{formatCurrency(orderData.price)}</Text>
          </div>
          <div className="flex justify-between mb-2">
            <Text>Discount</Text>
            <Text strong>-{formatCurrency(orderData.discount)}</Text>
          </div>
          <Divider />
          <div className="flex justify-between items-center">
            <Text strong className="text-lg">
              Total
            </Text>
            <Text strong className="text-2xl">
              {formatCurrency(orderData["total-price"])}
            </Text>
          </div>
        </Card>

        <Button
          type="primary"
          icon={<DownloadOutlined />}
          size="large"
          className="w-full bg-green-500 hover:bg-green-600 border-none h-12 text-lg font-semibold"
          disabled={!orderData["is-lab-downloaded"]}
        >
          Download labs
        </Button>
      </motion.div>
    </ConfigProvider>
  );
}

export default OrderDetail;
