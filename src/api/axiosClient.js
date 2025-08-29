import axios from 'axios';
import { getAccessToken } from '../utils';
import { baseURL } from '../env/allEnv';

const axiosClient = axios.create({
  baseURL: baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add async interceptor to inject token
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getAccessToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method.toUpperCase(),baseURL + config.url, config.data || config.params);
    return config;
  },
  (error) => Promise.reject(error)
);

axiosClient.interceptors.response.use(
  (response) => {
    console.log('📥 Response:', response.data);
    return response;
  },
  (error) => {
    console.error('❌ API Error:', error?.response?.data || error.message);
    return Promise.reject(error);
  }
);

export default axiosClient;
