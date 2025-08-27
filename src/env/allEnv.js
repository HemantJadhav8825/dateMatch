import { Platform } from "react-native";

const localUrl =
    Platform.OS === 'android'
        ? 'http://10.0.2.2' // Android
        : 'http://localhost'; // iOS

export const baseURL = `${localUrl}:4000`;
// export const baseURL = 'https://gateway-gklf.onrender.com';

export const socketURL = `${localUrl}:5004`;
// export const socketURL = 'https://socket-gklf.onrender.com';