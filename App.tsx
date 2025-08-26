import React, { useEffect, useState, useRef } from 'react';
import { ActivityIndicator, View, Alert, AppState, AppStateStatus, ToastAndroid, Platform } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { getLocalStorage, getToken } from './src/utils';
import { initNotifySocket, disconnectNotifySocket } from './src/components/CallNotifier';
import { showIncomingCallUI } from './src/components/ShowIncomingCallUI';
import { NavigationContainer } from '@react-navigation/native';
import { navigationRef } from './src/components/RootNavigation';

const AppNavigator = () => {
  const [loading, setLoading] = useState(true);
  const [accessToken, setAccessToken] = useState<any>(null);
  const appState = useRef(AppState.currentState);
  const socketInitialized = useRef(false);
  const userIdRef = useRef<any>(null);

  const showReconnectionError = (message: any) => {
    if (Platform.OS === 'android') {
      ToastAndroid.show(message, ToastAndroid.LONG);
    } else {
      Alert.alert('Reconnection Failed', message);
    }
  };

  const connectSocket = async (token: any) => {
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
        (callData: any) => {
          showIncomingCallUI(callData); // Handle incoming call
        },
        (chatMessage: any) => {
          console.log('New chat message:', chatMessage); // Handle chat here
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
    const handleAppStateChange = async (nextAppState: any) => {
      if (
        appState.current.match(/inactive|background/) &&
        nextAppState === 'active'
      ) {
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

  // Optional: Disconnect on unmount (or on logout)
  useEffect(() => {
    return () => {
      disconnectNotifySocket();
    };
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <NavigationContainer ref={navigationRef}>
      <StackNavigator initialRouteName={accessToken ? 'Home' : 'Login'} />
    </NavigationContainer>
  );
};

export default AppNavigator;
