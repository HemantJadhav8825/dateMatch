// services/axiosClient.js
import axios from 'axios';
import { baseURL } from '../env/allEnv';
import { getAccessToken } from '../utils/index';
import { navigate } from '../components/RootNavigation';
import { STACK_ROUTES } from '../constants/routes';

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
    console.error('🔁 Response err:', error?.response?.data || error.message);

    // Directly redirect to login if unauthorized
    if (error.response?.status === 401) {
      navigate(STACK_ROUTES.LOGIN);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
