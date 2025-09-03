import AsyncStorage from '@react-native-async-storage/async-storage';
const ACCESS_TOKEN_KEY = 'accessToken';
const REFRESH_TOKEN_KEY = 'refreshToken';
const USER_KEY = 'user';

export const getLocalStorage = async (key) => {
    return await AsyncStorage.getItem(key);
}
export const setLocalStorage = async (key, value) => {
    const isString = typeof value === 'string';
    if (!isString) {
        value = JSON.stringify(value);
    }
    await AsyncStorage.setItem(key, value);
}

export const removeLocalStorage = async (key) => {
  await AsyncStorage.removeItem(key);
};

export const getAccessToken = async () => {
  return await AsyncStorage.getItem(ACCESS_TOKEN_KEY);
};

export const getRefreshToken = async () => {
  return await AsyncStorage.getItem(REFRESH_TOKEN_KEY);
};

export const getUserFromLocalStorage = async () => {
  const user = await AsyncStorage.getItem(USER_KEY);
  return user ? JSON.parse(user) : null;
};

export const setTokens = async (accessToken, refreshToken) => {
  await AsyncStorage.setItem(ACCESS_TOKEN_KEY, accessToken);
  if (refreshToken) {
    await AsyncStorage.setItem(REFRESH_TOKEN_KEY, refreshToken);
  }
};

export const clearTokens = async () => {
  await AsyncStorage.multiRemove([ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY]);
};

export { ACCESS_TOKEN_KEY, REFRESH_TOKEN_KEY, USER_KEY };