import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Button, message, Typography } from "antd";
import api from "../../config/axios";
import Confetti from "react-confetti";
import { LeftOutlined, RightOutlined } from "@ant-design/icons";

const { Title, Text } = Typography;

const Result = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [paymentStatus, setPaymentStatus] = useState(null);
  const [showConfetti, setShowConfetti] = useState(false); // Hiệu ứng pháo hoa

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
    // Lấy các thông tin từ query parameters
    const queryParams = getQueryParams(location.search);

    // Gọi API để xác nhận kết quả thanh toán
    const confirmPayment = async () => {
      try {
        const response = await api.get("payments/vnpay/callback", {
          params: queryParams,
        });

        if (response.data.status === "success") {
          setPaymentStatus("success");
          setShowConfetti(true); // Hiển thị hiệu ứng pháo hoa
          message.destroy();
          message.success("Thực hiện giao dịch thanh toán thành công!");
        } else {
          setPaymentStatus("fail");
          message.destroy();
          message.error("Thực hiện giao dịch thanh toán thất bại!");
          navigate("/checkout"); // Điều hướng về trang checkout nếu thất bại
        }
        // Sau khi xử lý xong, xóa query string khỏi URL
        window.history.replaceState(null, "", "/order/result"); // Thay thế URL mà không có query string
      } catch (error) {
        console.log(error);
        setPaymentStatus("fail");
        message.destroy();
        message.error("Đã có lỗi xảy ra khi thực hiện giao dịch thanh toán!");
        navigate("/checkout"); // Điều hướng về trang checkout nếu thất bại
      }
    };

    confirmPayment();
  }, [location.search, navigate]);

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
          Thực hiện giao dịch thanh toán thành công!
        </Title>
        <Text className="text-black text-lg">
          Cảm ơn bạn đã đặt hàng với chúng tôi.
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
            onClick={() => navigate("/order")}
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
