import axios from "axios";
import { toast } from "react-toastify";
const baseUrl = "https://54.66.193.22:5000/api/";

// const baseUrl = "http://54.66.193.22:5001/api/";

const api = axios.create({
  baseURL: baseUrl,
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token")?.replaceAll('"', "");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

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
            autoClose: 1500,
          });
        } else if (errorDetails.errors["unavailable-username"]) {
          toast.error(errorDetails.errors["unavailable-username"], {
            autoClose: 1500,
          });
        } else {
          // Hiển thị thông báo lỗi chung nếu không có lỗi cụ thể
          toast.error(
            errorDetails.message || "Thông tin yêu cầu không chính xác!",
            {
              autoClose: 1500,
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
      originalRequest._retry = true;

      toast.error(error.response.data.details.errors["invalid-credentials"], {
        autoClose: 1500,
      });

      try {
        const currentRefreshToken = localStorage.getItem("refreshToken");

        const response = await axios.post(
          // `http://54.66.193.22:5001/api/users/refreshtoken/${currentRefreshToken}`

          `${baseUrl}Users/RefreshToken/${currentRefreshToken}`
        );
        const { accessToken, refreshToken } = response.data.details;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return axios(originalRequest);
      } catch (error) {
        // console.error("Error refreshing token:", refreshError);
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
