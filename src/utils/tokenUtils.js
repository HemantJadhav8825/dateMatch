import axios from 'axios';
import { baseURL } from '../env/allEnv';
import { getRefreshToken, setTokens, clearTokens } from '../utils/index';

let isRefreshing = false;
let subscribers = [];

const notifySubscribers = (token) => {
  subscribers.forEach(cb => cb(token));
  subscribers = [];
};

export const refreshTokenFlow = async () => {
  if (isRefreshing) return;

  isRefreshing = true;

  try {
    const refreshToken = await getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axios.post(`${baseURL}/auth/token/refresh`, { refreshToken });
    const { accessToken, refreshToken: newRefreshToken } = response.data;

    await setTokens(accessToken, newRefreshToken);
    notifySubscribers(accessToken);
    return accessToken;
  } catch (err) {
    console.error('🔁 Refresh failed:', err?.response?.data || err.message);
    await clearTokens();
    throw err;
  } finally {
    isRefreshing = false;
  }
};

export const addRefreshSubscriber = (callback) => {
  subscribers.push(callback);
};
