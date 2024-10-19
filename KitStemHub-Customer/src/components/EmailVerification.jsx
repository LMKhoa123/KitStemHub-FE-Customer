import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import api from "../config/axios";
import { toast } from "react-toastify";

function EmailVerification() {
  const [verificationStatus, setVerificationStatus] = useState("Đang xác thực");

  useEffect(() => {
    const urlParams = window.location.search.substring(1).split("&");
    let email, token;

    urlParams.forEach((param) => {
      const [key, value] = param.split("=");
      if (key === "email") email = decodeURIComponent(value);
      if (key === "token") token = decodeURIComponent(value);
    });

    // console.log("Email from URL:", email);
    // console.log("Token from URL:", token);

    if (email && token) {
      verifyEmail(email, token);
    } else {
      setVerificationStatus("Thiếu thông tin xác thực email.");
    }
  }, []);

  const verifyEmail = async (email, token) => {
    try {
      const response = await api.get(
        `users/email/verify?email=${encodeURIComponent(email)}&token=${encodeURIComponent(token)}`
      );
      if (response.data.status === "success") {
        setVerificationStatus("Xác thực email thành công!");
        toast.success("Xác thực email thành công!");
      } else {
        setVerificationStatus("Xác thực email thất bại. Vui lòng thử lại.");
        toast.error("Xác thực email thất bại. Vui lòng thử lại.");
      }
    } catch (error) {
      console.error("Lỗi khi xác thực email:", error);
      setVerificationStatus("Đã xảy ra lỗi trong quá trình xác thực email.");
      toast.error("Đã xảy ra lỗi trong quá trình xác thực email.");
    }
  };

  const renderContent = () => {
    switch (verificationStatus) {
      case "Đang xác thực":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4">Đang xác thực email...</h2>
            <p className="text-gray-600">Vui lòng đợi trong giây lát.</p>
          </>
        );
      case "Xác thực email thành công!":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-green-600">
              Xác thực email thành công!
            </h2>
            <p className="text-gray-600 mb-4">
              Cảm ơn bạn đã xác thực email. Tài khoản của bạn đã được kích hoạt.
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Đăng nhập ngay
            </Link>
          </>
        );
      case "Xác thực email thất bại. Vui lòng thử lại.":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Xác thực email thất bại
            </h2>
            <p className="text-gray-600 mb-4">
              Rất tiếc, chúng tôi không thể xác thực email của bạn. Vui lòng thử
              lại hoặc liên hệ hỗ trợ.
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Quay lại trang đăng nhập
            </Link>
          </>
        );
      case "Đã xảy ra lỗi trong quá trình xác thực email.":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-red-600">
              Đã xảy ra lỗi
            </h2>
            <p className="text-gray-600 mb-4">
              Có lỗi xảy ra trong quá trình xác thực email. Vui lòng thử lại sau
              hoặc liên hệ hỗ trợ.
            </p>
            <Link
              to="/login"
              className="bg-blue-500 hover:bg-blue-600 text-white font-bold py-2 px-4 rounded"
            >
              Quay lại trang đăng nhập
            </Link>
          </>
        );
      case "Thiếu thông tin xác thực email.":
        return (
          <>
            <h2 className="text-2xl font-bold mb-4 text-yellow-600">
              Thiếu thông tin xác thực
            </h2>
            <p className="text-gray-600 mb-4">
              Không tìm thấy thông tin xác thực email. Vui lòng kiểm tra lại
              đường dẫn hoặc liên hệ hỗ trợ.
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

export default EmailVerification;
