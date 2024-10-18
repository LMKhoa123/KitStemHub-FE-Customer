import { useEffect, useState } from "react";
import {
  Radio,
  Select,
  Button,
  Steps,
  Divider,
  message,
  Checkbox,
  notification,
} from "antd";
import {
  CreditCardOutlined,
  HomeOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import { useLocation, useNavigate } from "react-router-dom";
import api from "../../config/axios";

const { Option } = Select;
const { Step } = Steps;

const CheckOut = () => {
  const [paymentMethod, setPaymentMethod] = useState("cash");
  const [currentStep, setCurrentStep] = useState(0);
  const [shippingAddress, setShippingAddress] = useState(""); // Địa chỉ giao hàng
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState(""); // Số điện thoại đã chọn
  const [newPhoneNumber, setNewPhoneNumber] = useState(""); // Số điện thoại mới nhập
  const [useNewPhoneNumber, setUseNewPhoneNumber] = useState(false); // Kiểm tra có dùng số điện thoại mới không
  const [useNewAddress, setUseNewAddress] = useState(false); // Kiểm tra có dùng địa chỉ mới không
  const [newAddress, setNewAddress] = useState(""); // Địa chỉ mới
  const [note, setNote] = useState(""); // Ghi chú
  const [profileData, setProfileData] = useState({}); // Dữ liệu từ profile API
  const location = useLocation();
  const { cartItems } = location.state || { cartItems: [] }; // Nhận cartItems từ state

  const [usePoints, setUsePoints] = useState(false); // Xác định có sử dụng điểm không
  const [points, setPoints] = useState(0); // Số điểm của user, fetch từ API profile
  const [errors, setErrors] = useState({}); // Lưu trữ lỗi
  const navigate = useNavigate();

  // Fetch dữ liệu profile (bao gồm điểm)
  const fetchUserProfile = async () => {
    try {
      const response = await api.get("users/profile");
      const userProfile = response.data.details.data["user-profile-dto"];

      if (!userProfile) {
        throw new Error("Dữ liệu người dùng không tồn tại");
      }

      setPoints(userProfile.points || 0); // Đảm bảo số điểm không undefined
      setProfileData(userProfile);
      setShippingAddress(userProfile.address || ""); // Đảm bảo địa chỉ không undefined
      setSelectedPhoneNumber(userProfile["phone-number"] || ""); // Đảm bảo số điện thoại không undefined
    } catch (error) {
      console.error("Lỗi khi tải thông tin người dùng:", error);
    }
  };

  useEffect(() => {
    fetchUserProfile();
  }, []);

  const subtotal = cartItems.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );
  const pointsToMoney = usePoints ? Math.min(points, subtotal) : 0; // Quy đổi điểm thành tiền, tối đa không vượt quá subtotal
  const total = subtotal - pointsToMoney; // Tổng tiền sau khi sử dụng điểm

  // Hàm kiểm tra lỗi và đánh dấu ô trống
  const handleValidation = () => {
    let tempErrors = {};

    // Kiểm tra nếu người dùng yêu cầu nhập địa chỉ mới
    if (useNewAddress && !newAddress) {
      tempErrors.address = "Vui lòng nhập địa chỉ mới";
    }
    // Kiểm tra nếu địa chỉ đã lưu không tồn tại khi chọn địa chỉ đã lưu
    else if (!useNewAddress && !shippingAddress) {
      tempErrors.address = "Vui lòng nhập địa chỉ mới trước khi thanh toán";
    }

    // Kiểm tra nếu người dùng yêu cầu nhập số điện thoại mới
    if (useNewPhoneNumber && !newPhoneNumber) {
      tempErrors.phone = "Vui lòng nhập số điện thoại mới";
    }
    // Kiểm tra nếu số điện thoại đã lưu không tồn tại khi chọn số điện thoại đã lưu
    else if (!useNewPhoneNumber && !selectedPhoneNumber) {
      tempErrors.phone = "Vui lòng nhập số điện thoại của bạn";
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0; // Kiểm tra nếu không có lỗi nào
  };

  // Xoá lỗi khi bắt đầu nhập địa chỉ mới
  const handleAddressChange = (e) => {
    setNewAddress(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, address: "" }));
    }
  };

  // Xoá lỗi khi bắt đầu nhập số điện thoại mới
  const handlePhoneChange = (e) => {
    setNewPhoneNumber(e.target.value);
    if (e.target.value) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" }));
    }
  };

  const handlePlaceOrder = async () => {
    if (!handleValidation()) {
      message.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await fetchUserProfile();

      const shippingAddr = useNewAddress
        ? newAddress
        : shippingAddress || "Địa chỉ không xác định";
      const phoneNumber = useNewPhoneNumber
        ? newPhoneNumber
        : selectedPhoneNumber || "Số điện thoại không xác định";

      const response = await api.post("orders", null, {
        params: {
          "is-use-point": usePoints,
          "shipping-address": shippingAddr,
          "phone-number": phoneNumber,
          note: note,
        },
      });

      console.log("Thông tin phản hồi:", response.headers);

      // Kiểm tra headers (chữ thường và chữ hoa)
      const locationHeader =
        response.headers["location"] || response.headers["Location"];
      console.log(locationHeader);
      if (locationHeader) {
        const orderId = locationHeader.split("/").pop(); // Tách orderId từ URL trong header 'location'
        console.log("Mã đơn hàng:", orderId);

        if (paymentMethod === "bank") {
          // khúc này gọi api  tạo ra đường link rồi mở qua trang đó với url đucojw trả ra
          const paymentResponse = await api.post("/payments/vnpay", {
            "order-id": orderId,
          });

          // Kiểm tra nếu API thanh toán trả về URL giao dịch thành công
          if (
            paymentResponse.data &&
            paymentResponse.data.details &&
            paymentResponse.data.details.data &&
            paymentResponse.data.details.data.url
          ) {
            const paymentUrl = paymentResponse.data.details.data.url;
            console.log("URL thanh toán:", paymentUrl);

            // Chuyển hướng người dùng đến trang thanh toán
            window.location.href = paymentUrl;
            notification.destroy();
            notification.success({
              message: "Đơn hàng đã được đặt thành công!",
              duration: 3,
            });
            setCurrentStep(2);
          } else {
            notification.destroy();
            notification.error({
              message:
                "Không lấy được URL giao dịch thanh toán. Vui lòng thử lại.",
              duration: 3,
            });
          }
        } else if (paymentMethod === "cash") {
          // Nếu thanh toán bằng COD
          const cashResponse = await api.post("payments/cash", {
            "order-id": orderId,
          });

          if (cashResponse.data && cashResponse.data.status === "success") {
            notification.destroy();
            notification.success({
              message: "Đơn hàng COD đã được đặt thành công!",
              duration: 3,
            });
            // Chuyển hướng sang trang kết quả sau khi đặt hàng COD thành công
            navigate("/order/result", { state: { orderId } });
            setCurrentStep(2);
          } else {
            notification.destroy();
            notification.error({
              message: "Đặt hàng COD thất bại. Vui lòng thử lại!",
              duration: 3,
            });
          }
        }
      } else {
        console.error("Không tìm thấy location trong response headers.");
        notification.destroy();
        notification.error({
          message: "Không tìm thấy Mã đơn hàng. Vui lòng thử lại!",
          duration: 3,
        });
      }
    } catch (error) {
      console.error("Lỗi khi tạo đơn hàng:", error);
      notification.destroy();
      notification.error({
        message: "Đặt hàng thất bại, vui lòng thử lại!",
        duration: 3,
      });
    }
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

      <h1 className="text-4xl font-bold mb-8 text-gray-800">
        Chi tiết thanh toán
      </h1>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
        <motion.div
          className="shipping-details"
          initial={{ x: -20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.2 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Thông tin giao hàng
          </h2>
          {/* Địa chỉ giao hàng */}
          <Radio.Group
            className="space-y-2"
            onChange={(e) => setUseNewAddress(e.target.value === "new")}
            defaultValue={"saved"} // Sử dụng địa chỉ đã lưu mặc định
          >
            <Radio value="saved" className="block">
              Sử dụng địa chỉ đã lưu
              <Select
                className={`w-full ${errors.address ? "border-red-500" : ""}`}
                value={shippingAddress || ""}
                disabled={!shippingAddress}
                placeholder="Không có địa chỉ đã lưu"
                onChange={(value) => setShippingAddress(value)}
                size="large"
              >
                <Option value={shippingAddress}>{shippingAddress}</Option>
              </Select>
            </Radio>

            <Radio value="new" className="block">
              Nhập địa chỉ giao hàng mới
              <input
                type="text"
                placeholder="VD: 123 Đường ABC, Phường 1, Quận 1, TP. Hồ Chí Minh"
                className={`w-full p-3 border rounded-md mb-2 focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.address ? "border-red-500" : ""
                }`}
                value={newAddress}
                onChange={handleAddressChange}
                disabled={!useNewAddress}
              />
              {useNewAddress && errors.address && (
                <p className="text-red-500">{errors.address}</p>
              )}
            </Radio>
          </Radio.Group>

          {/* Số điện thoại */}
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Số điện thoại
          </h2>
          <Radio.Group
            className="space-y-2"
            onChange={(e) => setUseNewPhoneNumber(e.target.value === "new")}
            defaultValue={"saved"} // Sử dụng số điện thoại đã lưu mặc định
          >
            <Radio value="saved" className="block">
              Số điện thoại đã lưu
              <Select
                className={`w-full ${errors.phone ? "border-red-500" : ""}`}
                value={selectedPhoneNumber || ""}
                disabled={!selectedPhoneNumber}
                placeholder="Không có số điện thoại đã lưu"
                onChange={(value) => setSelectedPhoneNumber(value)}
                size="large"
              >
                <Option value={selectedPhoneNumber}>
                  {selectedPhoneNumber}
                </Option>
              </Select>
            </Radio>

            <Radio value="new" className="block">
              Nhập số điện thoại mới
              <input
                type="text"
                placeholder="VD: 0912345678"
                className={`w-full p-3 border rounded-md mb-2 focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.phone ? "border-red-500" : ""
                }`}
                value={newPhoneNumber}
                onChange={handlePhoneChange}
                disabled={!useNewPhoneNumber}
              />
              {useNewPhoneNumber && errors.phone && (
                <p className="text-red-500">{errors.phone}</p>
              )}
            </Radio>
          </Radio.Group>

          {/* Ghi chú */}
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">Ghi chú</h2>
          <textarea
            type="text"
            placeholder="VD: Ghi chú đơn hàng"
            className="w-full p-3 border rounded-md mb-2 focus:ring-2 focus:ring-primary focus:border-transparent"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          />
        </motion.div>

        <motion.div
          className="order-summary bg-gray-50 p-6 rounded-lg"
          initial={{ x: 20, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ delay: 0.4 }}
        >
          <h2 className="text-2xl font-semibold mb-6 text-gray-700">
            Tóm tắt đơn hàng
          </h2>
          {cartItems.map((item) => (
            <div
              key={item.id}
              className="flex justify-between items-center mb-4 bg-white p-4 rounded-md shadow-sm"
            >
              <div className="flex items-center">
                <img
                  src={item.imageUrl}
                  alt={item.product}
                  className="w-16 h-16 object-cover rounded-md mr-4"
                />
                <div>
                  <h3 className="font-semibold text-gray-800">
                    {item.product}
                  </h3>
                  <p className="text-sm text-gray-500">
                    Số lượng: {item.quantity}
                  </p>
                  <p className="text-sm text-gray-500">Gói: {item.package}</p>
                </div>
              </div>
              <span className="font-bold text-lg text-primary">
                {(item.price * item.quantity).toLocaleString("vi-VN")} VND
              </span>
            </div>
          ))}

          <Divider />

          <div className="space-y-2">
            <div className="flex justify-between text-gray-600">
              <span>Tổng phụ:</span>
              <span>{subtotal.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between text-gray-600">
              <span>Phí vận chuyển:</span>
              <span>Miễn phí</span>
            </div>
            {/* Sử dụng điểm tích lũy */}
            <div className="flex justify-between items-center text-gray-600">
              <Checkbox
                checked={usePoints}
                onChange={() => setUsePoints(!usePoints)}
              >
                Sử dụng điểm ({points} điểm khả dụng)
              </Checkbox>
              <span>-{pointsToMoney.toLocaleString("vi-VN")} VND</span>
            </div>
            <div className="flex justify-between font-bold text-lg text-gray-800">
              <span>Tổng cộng:</span>
              <span>{total.toLocaleString("vi-VN")} VND</span>
            </div>
          </div>

          <Divider />

          <h3 className="text-xl font-semibold mb-4 text-gray-700">
            Phương thức thanh toán
          </h3>
          <Radio.Group
            className="space-y-2"
            onChange={(e) => setPaymentMethod(e.target.value)}
            value={paymentMethod}
          >
            <Radio value="bank" className="flex">
              <img src="vnpayImage.svg" alt="" className="w-16 h-16" />
            </Radio>
            <Radio value="cash" className="block">
              Thanh toán khi nhận hàng
            </Radio>
          </Radio.Group>

          <Button
            type="primary"
            danger
            size="large"
            className="w-full mt-8 h-12 text-lg font-semibold"
            onClick={handlePlaceOrder}
          >
            Đặt hàng
          </Button>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CheckOut;
