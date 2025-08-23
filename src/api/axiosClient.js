import axios from 'axios';
import { getToken } from '../utils';

const baseURL = 'http://localhost:4000';
// const baseURL = 'https://date-match-be.onrender.com/api';

const axiosClient = axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add async interceptor to inject token from AsyncStorage
axiosClient.interceptors.request.use(
  async (config) => {
    const token = await getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    console.log('📤 Request:', config.method.toUpperCase(), config.url, config.data || config.params);
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
    console.error('❌ API Error:', error);
    return Promise.reject(error);
  }
);

export default axiosClient;
