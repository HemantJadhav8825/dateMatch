import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, View, Alert, AppState, AppStateStatus, ToastAndroid, Platform } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { getLocalStorage, getToken } from './src/utils';
import { initNotifySocket } from './src/components/CallNotifier';
import { showIncomingCallUI } from './src/components/ShowIncomingCallUI';

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const appState = useRef<AppStateStatus>(AppState.currentState);
  const socketInitialized = useRef(false);
  const userIdRef = useRef<string | null>(null);

  const showReconnectionError = (message: string) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('Reconnection Failed', message);
    }
  };

  const connectSocket = async (token: string) => {
    if (socketInitialized.current || !token) return;
    try {
      const userId = await getLocalStorage('userId');
      if (!userId) {
        console.warn('User ID not found in local storage.');
        return;
      }
      userIdRef.current = userId;

      initNotifySocket(userId, token, (data: any) => {
        showIncomingCallUI(data);
      });

      socketInitialized.current = true;
      console.log('Socket connected successfully');
    } catch (error) {
      console.error('Socket connection error:', error);
      showReconnectionError('Unable to reconnect to server. Calls may not work.');
    }
  };

  useEffect(() => {
    let isMounted = true;

    const initializeApp = async () => {
      try {
        const token = await getToken();
        if (!isMounted) return;

        setAccessToken(token);

        if (token) {
          await connectSocket(token);
        }
      } catch (error) {
        console.error('Error during initialization:', error);
        Alert.alert('Initialization failed', 'Please try restarting the app.');
      } finally {
        if (isMounted) setLoading(false);
      }
    };

    initializeApp();

    return () => {
      isMounted = false;
    };
  }, []);

  // Handle AppState for reconnection
  useEffect(() => {
    const handleAppStateChange = async (nextAppState: AppStateStatus) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
        // Reconnect if needed when app comes to foreground
        if (accessToken && userIdRef.current) {
          console.log('App came to foreground. Reconnecting socket...');
          socketInitialized.current = false; // Force reconnection
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

    return () => {
      subscription.remove();
    };
  }, [accessToken]);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StackNavigator initialRouteName={accessToken ? 'Home' : 'Login'} />
  );
};

export default AppNavigator;
