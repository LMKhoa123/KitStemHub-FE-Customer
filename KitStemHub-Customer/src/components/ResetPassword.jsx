import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import api from "../config/axios";
import { toast } from "react-toastify";
import { Form, Input, Button } from "antd";

function ResetPassword() {
  const [notification, setNotification] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const location = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const email = searchParams.get("email");
    const token = searchParams.get("token");

    if (email && token) {
      setNotification("Vui lòng nhập mật khẩu mới");
      setIsLoading(false);
    } else {
      setNotification("Thiếu thông tin xác thực email.");
      setIsLoading(false);
    }
  }, [location]);

  const handleResetPassword = async (values) => {
    setIsLoading(true);
    try {
      const searchParams = new URLSearchParams(location.search);
      const email = searchParams.get("email");
      const token = searchParams.get("token");

      const response = await api.post("users/resetpassword", {
        email: email,
        token: token,
        "new-password": values["new-password"],
      });

      if (response.data.status === "success") {
        toast.success(
          "Mật khẩu đã được đặt lại thành công. Vui lòng đăng nhập lại."
        );
        setNotification("Đặt lại mật khẩu thành công!");
      } else {
        toast.error("Không thể đặt lại mật khẩu. Vui lòng thử lại.");
        setNotification("Đặt lại mật khẩu thất bại.");
      }
    } catch (error) {
      console.error("Lỗi khi đặt lại mật khẩu:", error);
      toast.error("Đã xảy ra lỗi. Vui lòng thử lại sau.");
      setNotification("Đã xảy ra lỗi khi đặt lại mật khẩu.");
    } finally {
      setIsLoading(false);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return <p className="text-gray-600">Đang xử lý...</p>;
    }

    switch (notification) {
      case "Vui lòng nhập mật khẩu mới":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-blue-600">
              Đặt lại mật khẩu
            </h2>
            <p className="text-gray-600 mb-4">
              Vui lòng nhập mật khẩu mới của bạn.
            </p>
            <Form onFinish={handleResetPassword}>
              <Form.Item
                name="new-password"
                rules={[
                  { required: true, message: "Vui lòng nhập mật khẩu mới!" },
                  { min: 6, message: "Mật khẩu phải có ít nhất 6 ký tự!" },
                ]}
              >
                <Input.Password placeholder="Mật khẩu mới" />
              </Form.Item>
              <Form.Item>
                <Button type="primary" htmlType="submit">
                  Đặt lại mật khẩu
                </Button>
              </Form.Item>
            </Form>
          </>
        );
      case "Đặt lại mật khẩu thành công!":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Đặt lại mật khẩu thành công!
            </h2>
            <p className="text-gray-600 mb-4">
              Mật khẩu của bạn đã được đặt lại. Bạn có thể đăng nhập bằng mật
              khẩu mới.
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Đăng nhập ngay
            </Link>
          </>
        );
      case "Đặt lại mật khẩu thất bại.":
      case "Đã xảy ra lỗi khi đặt lại mật khẩu.":
      case "Thiếu thông tin xác thực email.":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              {notification}
            </h2>
            <p className="text-gray-600 mb-4">
              Vui lòng kiểm tra lại đường dẫn hoặc liên hệ hỗ trợ.
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Quay lại trang đăng nhập
            </Link>
          </>
        );
      default:
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-yellow-600">
              Trạng thái không xác định
            </h2>
            <p className="text-gray-600 mb-4">
              Đã xảy ra lỗi không xác định. Vui lòng thử lại sau hoặc liên hệ hỗ
              trợ.
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Quay lại trang đăng nhập
            </Link>
          </>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 flex flex-col justify-center items-center px-4">
      <div className="max-w-md w-full bg-white shadow-lg rounded-lg p-8 text-center">
        {renderContent()}
      </div>
    </div>
  );
}

export default ResetPassword;
