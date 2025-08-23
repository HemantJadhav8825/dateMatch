import AsyncStorage from '@react-native-async-storage/async-storage';

export const getToken = async () => {
    return await AsyncStorage.getItem('accessToken');
}
export const getLocalStorage = async (key) => {
    return await AsyncStorage.getItem(key);
}
export const setLocalStorage = async (key, value) => {
    await AsyncStorage.setItem(key, value);
}