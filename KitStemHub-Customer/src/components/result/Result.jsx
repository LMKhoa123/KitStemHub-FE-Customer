import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, notification, Typography } from "antd";
import api from "../../config/axios";
import Confetti from "react-confetti";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false); // Hiệu ứng pháo hoa
  const orderId = location.state?.orderId; // Lấy orderId từ state (khi COD)

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
    // Nếu có orderId thì lưu vào localStorage
    if (orderId) {
      localStorage.setItem("orderId", orderId);
    }
    // Lấy các thông tin từ query parameters
    const queryParams = getQueryParams(location.search);

    // Nếu có thông tin thanh toán VNPay, gọi API để xác nhận thanh toán
    const confirmPayment = async () => {
      if (queryParams.vnp_TransactionStatus) {
        try {
          const response = await api.get("payments/vnpay/callback", {
            params: queryParams,
          });

          if (response.data.status === "success") {
            setPaymentStatus("success");
            setShowConfetti(true); // Hiển thị hiệu ứng pháo hoa
            notification.destroy();
            notification.success({
              message: "Thực hiện giao dịch thanh toán thành công!",
              duration: 3,
            });
          } else {
            setPaymentStatus("fail");
            notification.destroy();
            notification.error({
              message: "Thực hiện giao dịch thanh toán thất bại!",
              duration: 3,
            });
            navigate("/checkout"); // Điều hướng về trang checkout nếu thất bại
          }

          // Sau khi xử lý xong, xóa query string khỏi URL
          window.history.replaceState(null, "", "/order/result"); // Thay thế URL mà không có query string
        } catch (error) {
          console.log(error);
          setPaymentStatus("fail");
          notification.destroy();
          notification.error({
            message: "Đã có lỗi xảy ra khi thực hiện giao dịch thanh toán!",
            duration: 3,
          });
          navigate("/checkout"); // Điều hướng về trang checkout nếu thất bại
        }
      } else if (orderId) {
        // Nếu không phải VNPay mà là thanh toán COD (orderId có trong state)
        setPaymentStatus("success");
        setShowConfetti(true);
        notification.destroy();
        notification.success({
          message: "Đơn hàng COD đã được đặt thành công!",
          duration: 3,
        });
      }
    };

    confirmPayment();
  }, [location.search, navigate, orderId]);

  return (
    <div className="flex justify-center items-center min-h-screen bg-white">
      {/* Hiệu ứng pháo hoa */}
      {showConfetti && (
        <Confetti width={window.innerWidth} height={window.innerHeight} />
      )}

      <div className="bg-white border shadow-lg p-10 text-center max-w-xl rounded-lg">
        <div className="flex justify-center items-center mb-4">
          {paymentStatus === "success" && (
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
            onClick={() => navigate("/home")}
            className="bg-rose-500 hover:bg-rose-600 font-semibold"
            icon={<LeftOutlined />}
          >
            Quay về trang chủ
          </Button>
          <Button
            type="primary"
            onClick={() => {
              const storedOrderId = localStorage.getItem("orderId");
              navigate(`/order/${storedOrderId || orderId}`, {
                state: { orderId: storedOrderId || orderId },
              });
            }}
            className="bg-rose-500 hover:bg-rose-600 font-semibold"
          >
            Xem đơn hàng {<RightOutlined />}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default Result;
