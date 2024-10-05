import { useState } from "react";
import { Radio, Select, Button, Steps, Divider, message } from "antd";
import {
  CreditCardOutlined,
  HomeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";

const { Option } = Select;
const { Step } = Steps;

const CheckOut = () => {
  //   const [shippingAddress, setShippingAddress] = useState("");
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [currentStep, setCurrentStep] = useState(0);

  const cartItems = [
    {
      id: 1,
      name: "Bộ linh kiện STEM Kit V2",
      price: 650,
      image:
        "https://nshopvn.com/wp-content/uploads/2021/06/bo-linh-kien-stem-v2-gv93-1.jpg",
    },
    {
      id: 2,
      name: "Kit học tập phát triển 8051",
      price: 1100,
      image:
        "https://nshopvn.com/wp-content/uploads/2021/06/bo-linh-kien-stem-v2-gv93-1.jpg",
    },
  ];

  const subtotal = cartItems.reduce((sum, item) => sum + item.price, 0);

  const handlePlaceOrder = () => {
    message.success("Đơn hàng đã được đặt thành công!");
    setCurrentStep(2);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="max-w-6xl mx-auto p-6 bg-white shadow-lg rounded-lg"
    >
      <Steps current={currentStep} className="mb-8">
        <Step title="Thông tin giao hàng" icon={<HomeOutlined />} />
        <Step title="Thanh toán" icon={<CreditCardOutlined />} />
        <Step title="Xác nhận" icon={<CheckCircleOutlined />} />
      </Steps>

      <h1 className="text-4xl font-bold mb-8 text-gray-800">Billing Details</h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          className="shipping-details"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Shipping details
          </h2>
          <Radio.Group className=" space-y-2" defaultValue="saved">
            <Radio value="saved" className="block">
              Use saved address
              <Select
                className="w-full "
                placeholder="123 , Electric avenue"
                onChange={(value) => setShippingAddress(value)}
                size="large"
              >
                <Option value="123 , Electric avenue">
                  123 , Electric avenue
                </Option>
              </Select>
            </Radio>

            <Radio value="new" className="block">
              Or Enter a New Shipping Address
              <input
                type="text"
                placeholder="VD: 123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh"
                className="w-full p-3 border rounded-md mb-6 focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </Radio>
          </Radio.Group>

          <Select
            className="w-1/2 flex justify-start"
            defaultValue="free"
            placeholder="Select shipping"
            size="large"
          >
            <Option value="free">Free delivery</Option>
            <Option value="express">Express delivery (+$10)</Option>
          </Select>
        </motion.div>

        <motion.div
          className="order-summary bg-gray-50 p-6 rounded-lg"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Order Summary
          </h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4 bg-white p-4 rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <img
                  src={item.image}
                  alt={item.name}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">{item.name}</h3>
                  <p className="text-sm text-gray-500">Quantity: 1</p>
                </div>
              </div>
              <span className="font-bold text-lg text-primary">
                ${item.price}
              </span>
            </div>
          ))}

          <Divider />

          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Subtotal:</span>
              <span>${subtotal}</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Shipping:</span>
              <span>Free</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Total:</span>
              <span>${subtotal}</span>
            </div>
          </div>

          <Divider />

          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Payment Method
          </h3>
          <Radio.Group
            className="space-y-2"
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
          >
            <Radio value="bank" className="flex ">
              <img src="vnpayImage.svg" alt="" className="w-16 h-16" />
            </Radio>
            <Radio value="cash" className="block">
              Cash on delivery
            </Radio>
          </Radio.Group>

          <Button
            type="primary"
            danger
            size="large"
            className="w-full mt-8 h-12 text-lg font-semibold"
            onClick={handlePlaceOrder}
          >
            Place Order
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckOut;
