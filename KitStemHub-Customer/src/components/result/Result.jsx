import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, notification, Spin, Typography } from "antd";
import api from "../../config/axios";
import Confetti from "react-confetti";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false); // Hiệu ứng pháo hoa
  const [loading, setLoading] = useState(true); // Trạng thái loading
  // Lấy orderId và paymentMethod từ localStorage
  const orderId = localStorage.getItem("orderId");
  const paymentMethod = localStorage.getItem("paymentMethod");
  console.log("Order ID:", orderId); // Log ra orderId để kiểm tra giá trị
  console.log(paymentMethod);

  // Hàm để lấy query parameters từ URL
  const getQueryParams = (search) => {
    const params = new URLSearchParams(search);
    return {
      vnp_Amount: params.get("vnp_Amount"),
      vnp_BankCode: params.get("vnp_BankCode"),
      vnp_BankTranNo: params.get("vnp_BankTranNo"),
      vnp_CardType: params.get("vnp_CardType"),
      vnp_OrderInfo: params.get("vnp_OrderInfo"),
      vnp_PayDate: params.get("vnp_PayDate"),
      vnp_ResponseCode: params.get("vnp_ResponseCode"),
      vnp_TmnCode: params.get("vnp_TmnCode"),
      vnp_TransactionNo: params.get("vnp_TransactionNo"),
      vnp_TransactionStatus: params.get("vnp_TransactionStatus"),
      vnp_TxnRef: params.get("vnp_TxnRef"),
      vnp_SecureHash: params.get("vnp_SecureHash"),
    };
  };

  useEffect(() => {
    if (!orderId) {
      console.error("Order ID is missing!");
      navigate("/checkout"); // Quay lại trang checkout nếu không có orderId
      return;
    }

    const confirmPayment = async () => {
      setLoading(true);
      try {
        if (paymentMethod === "vnpay") {
          const response = await api.get("payments/vnpay/callback", {
            params: getQueryParams(window.location.search),
          });

          if (response.data.status === "success") {
            setPaymentStatus("success");
            setShowConfetti(true);
            notification.success({ message: "Thanh toán thành công!" });
          } else {
            setPaymentStatus("fail");
            notification.error({ message: "Thanh toán thất bại!" });
          }
        } else {
          setPaymentStatus("success");
          setShowConfetti(true);
          notification.success({ message: "Đơn hàng đặt thành công!" });
        }
      } catch (error) {
        setPaymentStatus("fail");
        notification.error({
          message: "Thanh toán thất bại, vui lòng thử lại!",
        });
      } finally {
        setLoading(false);
      }
    };

    confirmPayment();
  }, [orderId, paymentMethod, navigate]);

  // Hàm xử lý khi bấm "Quay về trang chủ"
  const handleGoHome = () => {
    // Chỉ xóa cart khi bấm "Quay về trang chủ"
    localStorage.removeItem("cart");
    navigate("/home");
  };

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      {/* Hiệu ứng pháo hoa */}
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <div className="bg-white border shadow-lg p-10 text-center max-w-xl rounded-lg">
        {loading ? (
          <div className="flex justify-center items-center">
            <Spin size="large" tip="Đang xử lý thanh toán..." />
          </div>
        ) : (
          <>
            <div className="flex justify-center items-center mb-4">
              {paymentStatus === "success" ? (
                <div className="w-16 h-16 bg-green-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M5 13l4 4L19 7"
                    />
                  </svg>
                </div>
              ) : (
                <div className="w-16 h-16 bg-red-500 rounded-full flex items-center justify-center">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    className="h-10 w-10 text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth="2"
                      d="M6 18L18 6M6 6l12 12"
                    />
                  </svg>
                </div>
              )}
            </div>

            <Title level={2} className="text-rose-500">
              {paymentStatus === "success"
                ? "Thực hiện giao dịch thanh toán thành công!"
                : "Đã có lỗi xảy ra khi thanh toán!"}
            </Title>
            <Text className="text-black text-lg">
              {paymentStatus === "success"
                ? "Cảm ơn bạn đã đặt hàng với chúng tôi."
                : "Vui lòng thử lại."}
            </Text>
            <br />
            <br />
            <div className="flex justify-around items-center gap-4">
              <Button
                type="primary"
                onClick={handleGoHome}
                className="bg-rose-500 hover:bg-rose-600 font-semibold"
                icon={<LeftOutlined />}
              >
                Quay về trang chủ
              </Button>
              <Button
                type="primary"
                onClick={() => {
                  navigate(`/order/${orderId}`, {
                    state: { orderId, paymentMethod },
                  });
                }}
                className="bg-rose-500 hover:bg-rose-600 font-semibold"
              >
                Xem đơn hàng {<RightOutlined />}
              </Button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Result;
