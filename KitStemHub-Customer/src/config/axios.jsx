import axios from "axios";
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
    console.log(originalRequest);
    console.log("hello" + error.config);
    console.log("Error Config:", error.config);
    console.log("Error Response Status:", error.response.status);
    console.log("Error Message:", error.message);
    // If the error status is 401 and there is no originalRequest._retry flag,
    // it means the token has expired and we need to refresh it
    if (error.response.status === 401 && !originalRequest._retry) {
      console.log("Token expired or unauthorized - 401 error");
      originalRequest._retry = true;

      try {
        const currentRefreshToken = localStorage.getItem("refreshToken");
        console.log(currentRefreshToken);
        const response = await axios.post(
          `http://54.66.193.22:5001/api/Users/RefreshToken/${currentRefreshToken}`

          // `https://54.66.193.22:5000/api/Users/RefreshToken/${currentRefreshToken}`
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
