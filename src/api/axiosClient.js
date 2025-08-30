// services/axiosClient.js
import axios from 'axios';
import { baseURL } from '../env/allEnv';
import { getAccessToken } from '../utils/index';
import { refreshTokenFlow, addRefreshSubscriber } from '../utils/tokenUtils';

const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: { 'Content-Type': 'application/json' },
});

// Request Interceptor
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method.toUpperCase(), baseURL + config.url, config.data || config.params);
    return config;
  },
  (error) => Promise.reject(error)
);

// Response Interceptor
axiosClient.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.data);
    return response;
  },
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      return new Promise((resolve, reject) => {
        addRefreshSubscriber((newToken) => {
          if (!newToken) return reject(error);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          resolve(axiosClient(originalRequest));
        });

        refreshTokenFlow().catch(reject);
      });
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
