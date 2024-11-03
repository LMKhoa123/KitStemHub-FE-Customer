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
  const [paymentMethod, setPaymentMethod] = useState("");
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
  const [shippingFee, setShippingFee] = useState(0);
  ///
  const baseURL = "https://vn-public-apis.fpo.vn";
  const [provinceList, setProvinceList] = useState([]);
  const [districtList, setDistrictList] = useState([]);
  const [wardList, setWardList] = useState([]);

  const [selectedProvince, setSelectedProvince] = useState("");
  const [selectedDistrict, setSelectedDistrict] = useState("");
  const [selectedWard, setSelectedWard] = useState("");
  const [specificAddress, setSpecificAddress] = useState(""); // Địa chỉ nhà cụ thể
  const [fullAddress, setFullAddress] = useState(""); // Địa chỉ đầy đủ
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
      setShippingAddress(userProfile.address || "");
      setSelectedPhoneNumber(userProfile["phone-number"] || "");

      // Fetch shipping fee
      const responseShippingFee = await api.get(`orders/shippingfees`, {
        params: { address: userProfile.address || newAddress },
      });
      setShippingFee(responseShippingFee.data.details.data.price);
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
  const pointsToMoney = usePoints ? Math.min(points, subtotal) : 0;
  const total = subtotal + shippingFee - pointsToMoney; // Include shipping fee in total

  // Hàm kiểm tra lỗi và đánh dấu ô trống
  const handleValidation = () => {
    let tempErrors = {};

    // Kiểm tra địa chỉ giao hàng dựa trên radio đang được chọn
    if (useNewAddress) {
      if (!selectedProvince) {
        tempErrors.province = "Vui lòng chọn tỉnh/thành phố";
      }
      if (!selectedDistrict) {
        tempErrors.district = "Vui lòng chọn quận/huyện";
      }
      // if (!selectedWard) {
      //   tempErrors.ward = "Vui lòng chọn phường/xã";
      // }
      if (!specificAddress) {
        tempErrors.specificAddress = "Vui lòng nhập địa chỉ cụ thể";
      }
    } else {
      if (!shippingAddress) {
        tempErrors.address = "Vui lòng chọn địa chỉ giao hàng";
      }
    }

    // Kiểm tra số điện thoại
    if (useNewPhoneNumber) {
      if (
        !newPhoneNumber ||
        !/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(newPhoneNumber)
      ) {
        tempErrors.phone =
          "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam bắt đầu bằng 03, 05, 07, 08, 09";
      }
    } else {
      if (!selectedPhoneNumber) {
        tempErrors.phone =
          "Vui lòng nhập số điện thoại của bạn trong thông tin tài khoản";
      }
    }

    setErrors(tempErrors);
    return Object.keys(tempErrors).length === 0;
  };

  // Xoá lỗi khi bắt đầu nhập số điện thoại mới
  const handlePhoneChange = (e) => {
    const phoneValue = e.target.value;

    // Kiểm tra định dạng số điện thoại Việt Nam
    if (/^(0[3|5|7|8|9])+([0-9]{8})\b/.test(phoneValue)) {
      setErrors((prevErrors) => ({ ...prevErrors, phone: "" })); // Xoá lỗi nếu hợp lệ
    } else {
      setErrors((prevErrors) => ({
        ...prevErrors,
        phone:
          "Số điện thoại không hợp lệ. Vui lòng nhập số điện thoại Việt Nam bắt đầu bằng 03, 05, 07, 08, 09",
      }));
    }

    setNewPhoneNumber(phoneValue); // Cập nhật số điện thoại mới
  };

  // Fetch provinces
  const fetchProvinces = async () => {
    try {
      const response = await fetch(`${baseURL}/provinces/getAll?limit=-1`);
      const data = await response.json();
      const provincesArray = Array.isArray(data.data.data)
        ? data.data.data
        : [];
      setProvinceList(provincesArray);
      console.log("Updated provinceList:", provincesArray); // Debug log to verify data
    } catch (error) {
      console.error("Lỗi khi lấy danh sách tỉnh:", error);
    }
  };

  // Fetch districts based on provinceCode
  const fetchDistricts = async (provinceCode) => {
    try {
      const response = await fetch(
        `${baseURL}/districts/getByProvince?provinceCode=${provinceCode}&limit=-1`
      );
      const data = await response.json();
      const districtsArray = Array.isArray(data.data.data)
        ? data.data.data
        : [];
      setDistrictList(districtsArray);
      console.log("Updated districtList:", districtsArray);
    } catch (error) {
      console.error("Lỗi khi lấy danh sách quận:", error);
      setDistrictList([]); // Reset danh sách nếu có lỗi
    }
  };

  // Fetch wards based on districtCode
  const fetchWards = async (districtCode) => {
    try {
      const response = await fetch(
        `${baseURL}/wards/getByDistrict?districtCode=${districtCode}&limit=-1`
      );
      const data = await response.json();

      console.log("Wards API response:", data); // Kiểm tra phản hồi API

      const wardsArray = Array.isArray(data.data.data) ? data.data.data : []; // Truy cập đúng thuộc tính của API
      setWardList(wardsArray);
      console.log("Updated wardList:", wardsArray); // Kiểm tra dữ liệu danh sách phường
    } catch (error) {
      console.error("Lỗi khi lấy danh sách phường:", error);
      setWardList([]); // Đảm bảo đặt giá trị mặc định nếu có lỗi
    }
  };

  const handlePlaceOrder = async () => {
    if (!handleValidation()) {
      message.error("Vui lòng điền đầy đủ thông tin");
      return;
    }

    try {
      await fetchUserProfile();

      let shippingAddr;
      if (useNewAddress) {
        shippingAddr = buildFullAddress(true); // Sử dụng địa chỉ mới đầy đủ
      } else {
        shippingAddr = shippingAddress || "Địa chỉ không xác định";
      }

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

      console.log("Thông tin phản hồi:", response.data);

      // Kiểm tra headers (chữ thường và chữ hoa)
      const locationHeader =
        response.headers["location"] || response.headers["Location"];
      console.log(locationHeader);
      if (locationHeader) {
        const orderId = locationHeader.split("/").pop(); // Tách orderId từ URL trong header 'location'
        console.log("Mã đơn hàng:", orderId);

        // Lưu `orderId` vào `localStorage` để dùng khi người dùng quay lại từ VNPay
        localStorage.setItem("orderId", orderId);

        const orderKey = `order_${orderId}`;
        // Store order data
        localStorage.setItem(
          orderKey,
          JSON.stringify({ paymentMethod, orderId })
        );

        if (paymentMethod === "bank") {
          // khúc này gọi api  tạo ra đường link rồi mở qua trang đó với url đucojw trả ra
          const paymentResponse = await api.post("payments/vnpay", {
            "order-id": orderId,
          });
          console.log("Payment Response:", paymentResponse);
          const paymentUrl = paymentResponse?.data?.details?.data?.url;
          console.log(paymentUrl);
          if (paymentUrl) {
            window.location.href = paymentUrl;
          } else {
            notification.error({
              message: "Không lấy được URL thanh toán. Vui lòng thử lại.",
            });
          }
        } else if (paymentMethod === "cash") {
          try {
            await api.post("payments/cash", { "order-id": orderId });
            navigate("/order/result");
          } catch (error) {
            console.error("Lỗi khi gọi API thanh toán COD:", error);
            notification.error({
              message: "Đặt hàng thất bại, vui lòng thử lại!",
            });
          }
        }
      } else {
        notification.error({ message: "Không tìm thấy Mã đơn hàng." });
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

  useEffect(() => {
    fetchProvinces();
  }, []);

  useEffect(() => {
    if (selectedProvince) {
      fetchDistricts(selectedProvince);
      setSelectedDistrict("");
      setSelectedWard("");
    }
  }, [selectedProvince]);

  useEffect(() => {
    if (selectedDistrict) {
      fetchWards(selectedDistrict);
      setSelectedWard("");
    }
  }, [selectedDistrict]);

  useEffect(() => {
    if (useNewAddress) {
      // Chỉ cập nhật phí vận chuyển khi địa chỉ mới thay đổi và đã đầy đủ
      if (fullAddress) {
        updateShippingFee(fullAddress);
      }
    } else {
      // Sử dụng địa chỉ đã lưu
      updateShippingFee(shippingAddress);
    }
  }, [useNewAddress, fullAddress, shippingAddress]);

  const updateShippingFee = async (address) => {
    try {
      const addressForApi = useNewAddress ? buildFullAddress(false) : address;
      const responseShippingFee = await api.get(`orders/shippingfees`, {
        params: { address: addressForApi },
      });
      setShippingFee(responseShippingFee.data.details.data.price);
    } catch (error) {
      console.error("Lỗi khi cập nhật phí vận chuyển:", error);
      // Có thể thêm xử lý lỗi ở đây, ví dụ hiển thị thông báo cho người dùng
    }
  };

  const buildFullAddress = (includeSpecific = true) => {
    const province =
      provinceList.find((p) => p.code === selectedProvince)?.name_with_type ||
      "";
    const district =
      districtList.find((d) => d.code === selectedDistrict)?.name_with_type ||
      "";
    const ward =
      wardList.find((w) => w.code === selectedWard)?.name_with_type || "";
    const parts = includeSpecific
      ? [specificAddress, ward, district, province]
      : [ward, district, province];
    return parts.filter(Boolean).join(", ");
  };

  useEffect(() => {
    if (useNewAddress) {
      const newFullAddress = buildFullAddress(true);
      setFullAddress(newFullAddress);
      if (selectedProvince && selectedDistrict && selectedWard) {
        updateShippingFee(buildFullAddress(false));
      }
    }
  }, [
    useNewAddress,
    selectedProvince,
    selectedDistrict,
    selectedWard,
    specificAddress,
  ]);

  const handleAddressTypeChange = (e) => {
    const isNewAddress = e.target.value === "new";
    setUseNewAddress(isNewAddress);
    setErrors({ ...errors, address: "" });

    if (isNewAddress) {
      if (selectedProvince && selectedDistrict && selectedWard) {
        updateShippingFee(buildFullAddress(false));
      }
    } else {
      updateShippingFee(shippingAddress);
    }
  };

  // Cập nhật hàm này để gọi updateShippingFee khi địa chỉ mới thay đổi
  const handleNewAddressChange = (type, value) => {
    switch (type) {
      case "province":
        setSelectedProvince(value);
        setSelectedDistrict("");
        setSelectedWard("");
        break;
      case "district":
        setSelectedDistrict(value);
        setSelectedWard("");
        break;
      case "ward":
        setSelectedWard(value);
        break;
      case "specific":
        if (value.length > 0 && /^[a-zA-Z0-9À-ỹ\s,.-]+$/.test(value)) {
          setSpecificAddress(value);
          setErrors((prev) => ({ ...prev, specificAddress: "" }));
        } else if (value.length === 0) {
          setSpecificAddress(value);
          setErrors((prev) => ({
            ...prev,
            specificAddress: "Vui lòng nhập địa chỉ cụ thể.",
          }));
        } else {
          setSpecificAddress(value);
          setErrors((prev) => ({
            ...prev,
            specificAddress:
              "Địa chỉ cụ thể không hợp lệ. Vui lòng chỉ sử dụng chữ cái, số, dấu phẩy, dấu chấm và dấu cách.",
          }));
        }
        break;
    }

    if (useNewAddress && type !== "specific") {
      const newFullAddress = buildFullAddress(true);
      setFullAddress(newFullAddress);
      if (selectedProvince && selectedDistrict && selectedWard) {
        updateShippingFee(buildFullAddress(false));
      }
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

      <h1 className="text-4xl font-bold mb-3 text-gray-800">
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
          <div className="space-y-4 ">
            <Radio.Group
              className="space-y-2 "
              onChange={handleAddressTypeChange}
              value={useNewAddress ? "new" : "saved"}
            >
              <Radio value="saved" className="flex items-center ">
                <span>Sử dụng địa chỉ đã lưu</span>
                <input
                  type="text"
                  className="w-full p-4 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent"
                  value={shippingAddress || ""}
                  onChange={(e) => setShippingAddress(e.target.value)}
                  disabled={useNewAddress}
                  placeholder="Không có địa chỉ đã lưu"
                  readOnly
                />
              </Radio>
              <Radio value="new" className="block">
                Nhập địa chỉ giao hàng mới
              </Radio>
            </Radio.Group>

            {
              <div className="space-y-4 ml-6">
                <div className="grid grid-cols-3 gap-4">
                  <Select
                    className="w-full"
                    value={selectedProvince || "Chọn tỉnh/thành phố"}
                    onChange={(value) =>
                      handleNewAddressChange("province", value)
                    }
                    size="large"
                  >
                    {provinceList.map((province) => (
                      <Option key={province.code} value={province.code}>
                        {province.name_with_type}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    className="w-full"
                    value={selectedDistrict || "Chọn quận/huyện"}
                    onChange={(value) =>
                      handleNewAddressChange("district", value)
                    }
                    size="large"
                    disabled={!selectedProvince}
                  >
                    {districtList.map((district) => (
                      <Option key={district.code} value={district.code}>
                        {district.name_with_type}
                      </Option>
                    ))}
                  </Select>
                  <Select
                    className="w-full"
                    value={selectedWard || "Chọn phường/xã"}
                    onChange={(value) => handleNewAddressChange("ward", value)}
                    size="large"
                    disabled={!selectedDistrict}
                  >
                    {wardList.map((ward) => (
                      <Option key={ward.code} value={ward.code}>
                        {ward.name_with_type}
                      </Option>
                    ))}
                  </Select>
                </div>
                <input
                  type="text"
                  placeholder="Số nhà, tên đường"
                  className={`w-full p-3 border rounded-md focus:ring-2 focus:ring-primary focus:border-transparent ${
                    errors.specificAddress ? "border-red-500" : ""
                  }`}
                  value={specificAddress}
                  onChange={(e) =>
                    handleNewAddressChange("specific", e.target.value)
                  }
                />
                {errors.specificAddress && (
                  <p className="text-red-500 text-sm">
                    {errors.specificAddress}
                  </p>
                )}
                {/* {fullAddress && (
                  <div className="bg-white p-3 border rounded-md">
                    
                    <p className="text-gray-600">{fullAddress}</p>
                  </div>
                )} */}
              </div>
            }
          </div>

          {/* Số điện thoại */}
          <h2 className="text-2xl font-semibold mb-4 text-gray-700 mt-4">
            Số điện thoại
          </h2>
          <Radio.Group
            className=""
            onChange={(e) => {
              setUseNewPhoneNumber(e.target.value === "new");
              setErrors({ ...errors, phone: "" }); // Reset lỗi cho phone khi thay đổi lựa chọn
            }}
            value={useNewPhoneNumber ? "new" : "saved"} // Sử dụng số điện thoại đã lưu mặc định
          >
            <Radio value="saved" className="block">
              Số điện thoại đã lưu
              <input
                type="text"
                className={`w-full p-3 border rounded-md  focus:ring-2 focus:ring-primary focus:border-transparent ${errors.phone && !useNewPhoneNumber ? "border-red-500" : ""}`}
                value={selectedPhoneNumber || ""}
                placeholder="Không có số điện thoại đã lưu"
                disabled={useNewPhoneNumber}
                readOnly
              />
              {/* Hiển thị thông báo lỗi nếu có lỗi và đang sử dụng số điện thoại đã lưu */}
              {!useNewPhoneNumber && errors.phone && (
                <p className="text-red-500">{errors.phone}</p>
              )}
            </Radio>

            <Radio value="new" className="block">
              Nhập số điện thoại mới
              <input
                type="tel"
                placeholder="VD: 0912345678"
                className={`w-full p-3 border rounded-md  focus:ring-2 focus:ring-primary focus:border-transparent ${
                  errors.phone && useNewPhoneNumber ? "border-red-500" : ""
                }`}
                value={newPhoneNumber}
                onChange={(e) => {
                  const value = e.target.value;
                  if (/^\d*$/.test(value)) {
                    handlePhoneChange(e);
                  }
                }}
                disabled={!useNewPhoneNumber}
                pattern="[0-9]*"
              />
              {useNewPhoneNumber && errors.phone && (
                <p className="text-red-500">{errors.phone}</p>
              )}
            </Radio>
          </Radio.Group>

          {/* Ghi chú */}
          <h2 className="text-2xl font-semibold mb-2 text-gray-700">Ghi chú</h2>
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
              <span>{shippingFee.toLocaleString("vi-VN")} VND</span>
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
