import axios from "axios";
import { toast } from "react-toastify";

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

    // Handle 401 Unauthorized errors and attempt token refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      try {
        const currentRefreshToken = localStorage.getItem("refreshToken");
        if (!currentRefreshToken) {
          throw new Error("No refresh token available");
        }

        const response = await axios.post(
          `${baseUrl}users/refreshtoken/${currentRefreshToken}`
        );

        const { accessToken, refreshToken } = response.data.details;
        localStorage.setItem("token", accessToken);
        localStorage.setItem("refreshToken", refreshToken);

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;
        return api(originalRequest);
      } catch (refreshError) {
        // Clear tokens when refresh fails
        localStorage.removeItem("token");
        localStorage.removeItem("refreshToken");
        window.location.href = "/";

        return Promise.reject(error);
      }
    }

    return Promise.reject(error);
  }
);

export default api;
