import { useAuthStore } from "@/src/features/auth/store/authStore";
import axios from "axios";

const api = axios.create({
  baseURL: "https://booking-api.hyge.web.id",
  timeout: 10000,
});

api.interceptors.request.use(async (config) => {
  const { token } = useAuthStore.getState();

  const authEndpoints = ['/auth/login', '/auth/register', '/auth/refresh'];

  const isAuthEndpoint = authEndpoints.some((endpoint) =>
    config.url?.includes(endpoint)
  );

  if (token && !isAuthEndpoint) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});


api.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;
 
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const { refreshToken } = useAuthStore.getState();
        if (!refreshToken) {
          useAuthStore.getState().logout(); 
          return Promise.reject(error);
        }

        const response = await axios.post(
          "https://booking-api.hyge.web.id/auth/refresh",
          { refreshToken }
        );

        const { accessToken, refreshToken: newRefreshToken, user } = response.data;

        useAuthStore.setState({
          token: accessToken,
          refreshToken: newRefreshToken,
          name: user.name,
          email: user.email,
        });

        originalRequest.headers.Authorization = `Bearer ${accessToken}`;

        return api(originalRequest);
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        useAuthStore.getState().logout();
        return Promise.reject(refreshError);
      }
    }

    if (error.response) {
      console.error('API Error Response:', {
        status: error.response.status,
        data: error.response.data,
        url: error.config?.url
      });
    } else if (error.request) {
      console.error('API Network Error:', {
        message: 'No response received',
        url: error.config?.url,
        timeout: error.code === 'ECONNABORTED'
      });
    } else {
      console.error('API Error:', error.message);
    }

    return Promise.reject(error);
  }
);

export default api;
