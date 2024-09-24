import axios from "axios";
const baseUrl = "http://54.66.193.22:5000/api/";

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
    // config.headers["Authorization"] = `Bearer ${token}`;
    // console.log(config.headers.Authorization);
  }
  return config;
};

api.interceptors.request.use(handleBefore, (error) => Promise.reject(error));

//// Add a response interceptor
api.interceptors.response.use(
  (response) => {
    // console.log("API Response:", response.data); // Kiểm tra dữ liệu phản hồi ở đây
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const refreshToken = localStorage.getItem("refreshToken");
        const response = await axios.post("RefreshToken", { refreshToken });
        // console.log(response.data);
        const { accessToken, newRefreshToken } = response.data.details;
        console.log(accessToken);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", newRefreshToken);

        // Retry the original request with the new token
        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return axios(originalRequest);
      } catch (error) {
        // Xử lý lỗi refresh token (ví dụ: chuyển hướng về trang đăng nhập)
        window.location.href = "/login";
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);
export default api;
