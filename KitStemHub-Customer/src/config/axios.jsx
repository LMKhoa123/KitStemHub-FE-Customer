import axios from "axios";
import { toast } from "react-toastify";
const baseUrl = "https://54.66.193.22:5000/api/";

// const baseUrl = "http://54.66.193.22:5001/api/";

const config = {
  baseUrl: baseUrl,
};

const api = axios.create(config);

api.defaults.baseURL = baseUrl;

// handle before call API
const handleBefore = (config) => {
  // handle hành động trước khi call API

  // lấy ra cái token và đính kèm theo cái request
  const token = localStorage.getItem("token")?.replaceAll('"', "");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
};

api.interceptors.request.use(handleBefore, (error) => Promise.reject(error));

//////////////////////////////////
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Xử lý lỗi 400
    if (error.response.status === 400) {
      const errorDetails = error.response.data.details;
      if (errorDetails && errorDetails.errors) {
        if (errorDetails.errors.password) {
          toast.error(errorDetails.errors.password, {
            autoClose: 3000,
          });
        } else if (errorDetails.errors["unavailable-username"]) {
          toast.error(errorDetails.errors["unavailable-username"], {
            autoClose: 3000,
          });
        } else {
          // Hiển thị thông báo lỗi chung nếu không có lỗi cụ thể
          toast.error(
            errorDetails.message || "Thông tin yêu cầu không chính xác!",
            {
              autoClose: 3000,
            }
          );
        }
      } else {
        toast.error(errorDetails.message || "Đã xảy ra lỗi!", {
          autoClose: 3000,
        });
      }
      return Promise.reject(error);
    }

    // Xử lý lỗi 401 (giữ nguyên phần code cũ)
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("Token expired or unauthorized - 401 error");
      // toast.error(error.response.data.details.errors.invalidCredentials);
      toast.error(error.response.data.details.errors["invalid-credentials"], {
        autoClose: 1500,
      });

      originalRequest._retry = true;

      try {
        const currentRefreshToken = localStorage.getItem("refreshToken");
        console.log(currentRefreshToken);
        const response = await axios.post(
          // `http://54.66.193.22:5001/api/users/refreshtoken/${currentRefreshToken}`

          `https://54.66.193.22:5000/api/users/refreshtoken/${currentRefreshToken}`
        );
        console.log("ggggg" + response.data);
        const { accessToken, refreshToken } = response.data.details;
        console.log(accessToken);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axios(originalRequest);
      } catch (error) {
        // Xử lý lỗi refresh token (ví dụ: chuyển hướng về trang đăng nhập)
        // window.location.href = "/";
        console.log(error);
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
