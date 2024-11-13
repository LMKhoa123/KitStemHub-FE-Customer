import axios from "axios";

const baseUrl = "https://54.66.193.22:5000/api/";
// const baseUrl = "http://54.66.193.22:5001/api/";

const api = axios.create({
  baseURL: baseUrl,
});

// Interceptor for requests
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

// Interceptor for responses
api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Kiểm tra nếu là lỗi 401 và chưa thử refresh token
    if (error.response?.status === 401 && !originalRequest._retry) {
      if (error.response?.data?.details?.errors?.["invalid-credentials"]) {
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
      }

      originalRequest._retry = true;

      try {
        const currentRefreshToken = localStorage.getItem("refreshToken");
        if (!currentRefreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await api.post(
          `${baseUrl}users/refreshtoken/${currentRefreshToken}`
        );

        const accessToken = response.data.details["access-token"];
        const refreshToken = response.data.details["refresh-token"];

        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (error) {
        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
