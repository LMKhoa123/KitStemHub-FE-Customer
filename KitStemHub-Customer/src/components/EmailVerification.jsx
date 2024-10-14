import { useEffect, useState } from "react";
import api from "../config/axios";
import { toast } from "react-toastify";

function EmailVerification() {
  const [verificationStatus, setVerificationStatus] =
    useState("Đang xác thực...");

  useEffect(() => {
    const urlParams = window.location.search.substring(1).split("&");
    let email, token;

    urlParams.forEach((param) => {
      const [key, value] = param.split("=");
      if (key === "email") email = decodeURIComponent(value);
      if (key === "token") token = decodeURIComponent(value);
    });

    console.log("Email from URL:", email);
    console.log("Token from URL:", token);

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

  return (
    <div>
      <h2>Xác thực Email</h2>
      <p>{verificationStatus}</p>
    </div>
  );
}

export default EmailVerification;
