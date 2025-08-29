// src/hooks/useNotifySocket.js
import { useEffect, useRef, useState } from 'react';
import { AppState, Alert, ToastAndroid, Platform } from 'react-native';
import { getAccessToken, getLocalStorage } from '../utils';
import { initNotifySocket, disconnectNotifySocket, isNotifySocketAlive } from '../components/CallNotifier';
import { showIncomingCallUI } from '../components/ShowIncomingCallUI';

export function useNotifySocket() {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState(null);
  const appState = useRef(AppState.currentState);
  const socketInitialized = useRef(false);
  const userIdRef = useRef(null);

  const showReconnectionError = (message) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('Reconnection Failed', message);
    }
  };

  const connectSocket = async (token) => {
    if (socketInitialized.current || !token) return;
    try {
      const userId = await getLocalStorage('userId');
      if (!userId) {
        console.warn('User ID not found in local storage.');
        return;
      }
      userIdRef.current = userId;

      initNotifySocket(
        userId,
        token,
        (callData) => {
          showIncomingCallUI(callData);
        },
        (chatMessage) => {
          console.log('New chat message:', chatMessage);
        }
      );

      socketInitialized.current = true;
      console.log('Socket connected successfully');
    } catch (error) {
      console.error('Socket connection error:', error);
      showReconnectionError('Unable to reconnect to server. Calls and chat may not work.');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initialize = async () => {
      try {
        const token = await getAccessToken();
        if (!isMounted) return;

        setAccessToken(token);
        if (token) {
          await connectSocket(token);
        }
      } catch (error) {
        console.error('Initialization failed:', error);
        Alert.alert('Initialization failed', 'Please try restarting the app.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initialize();

    return () => { isMounted = false; };
  }, []);

  // Handle app state changes for reconnection
  useEffect(() => {
    const handleAppStateChange = async (nextAppState) => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (accessToken && userIdRef.current) {
          console.log('App resumed. Reconnecting socket...');
          socketInitialized.current = false;
          try {
            await connectSocket(accessToken);
          } catch {
            showReconnectionError('Reconnection failed. Please check your internet.');
          }
        }
      }
      appState.current = nextAppState;
    };

    const subscription = AppState.addEventListener('change', handleAppStateChange);
    return () => subscription.remove();
  }, [accessToken]);

  // Disconnect on unmount
  useEffect(() => {
    return () => {
      disconnectNotifySocket();
    };
  }, []);

  // Health check
  useEffect(() => {
    const interval = setInterval(() => {
      if (!isNotifySocketAlive()) {
        console.warn('Socket is not live! Attempting reconnection...');
      }
    }, 10000);
    return () => clearInterval(interval);
  }, []);

  return { loading, accessToken };
}
