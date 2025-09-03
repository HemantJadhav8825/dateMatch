// src/hooks/useNotifySocket.js
import { useEffect, useRef, useState, useCallback } from 'react';
import { AppState } from 'react-native';
import { getAccessToken, getUserFromLocalStorage } from '../utils';
import {
  initNotifySocket,
  disconnectNotifySocket,
  getNotifySocket
} from '../components/CallNotifier';

export function useNotifySocket() {
  const [loading, setLoading] = useState(true);
  const [socketStatus, setSocketStatus] = useState('disconnected'); // 'connected' | 'reconnecting' | 'disconnected'
  const [accessToken, setAccessToken] = useState(null);
  const appState = useRef(AppState.currentState);
  const socketInitialized = useRef(false);
  const userIdRef = useRef(null);

  const setupSocketListeners = (socket) => {
    socket.on('connect', () => setSocketStatus('connected'));
    socket.on('disconnect', () => setSocketStatus('disconnected'));
    socket.on('reconnect_attempt', () => setSocketStatus('reconnecting'));
    socket.on('connect_error', () => setSocketStatus('disconnected'));
  };

  const connectSocket = useCallback(async (token) => {
    if (socketInitialized.current || !token) return;
    try {
      const userId = (await getUserFromLocalStorage())?._id;
      if (!userId) return console.warn('User ID not found in local storage.');

      userIdRef.current = userId;
      const socket = initNotifySocket(userId, token, () => {}, () => {});
      setupSocketListeners(socket);

      socketInitialized.current = true;
    } catch (error) {
      console.error('Socket connection error:', error);
      setSocketStatus('disconnected');
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    (async () => {
      try {
        const token = await getAccessToken();
        if (!isMounted) return;

        setAccessToken(token);
        if (token) {
          await connectSocket(token);
        }
      } finally {
        if (isMounted) setLoading(false);
      }
    })();

    return () => {
      isMounted = false;
    };
  }, [connectSocket]);

  // App resume handling
  useEffect(() => {
    const subscription = AppState.addEventListener('change', async nextAppState => {
      if (appState.current.match(/inactive|background/) && nextAppState === 'active') {
        if (accessToken && userIdRef.current) {
          setSocketStatus('reconnecting');
          socketInitialized.current = false;
          await connectSocket(accessToken);
        }
      }
      appState.current = nextAppState;
    });
    return () => subscription.remove();
  }, [accessToken, connectSocket]);

  useEffect(() => {
    return () => {
      disconnectNotifySocket();
      setSocketStatus('disconnected');
    };
  }, []);

const manualReconnect = useCallback(async () => {
  let socket = getNotifySocket();
  console.log('Manual reconnect triggered', socket);

  if (socket?.connected) {
    // Re-attach listeners in case they were lost
    setupSocketListeners(socket);
    setSocketStatus('connected'); // Force sync
    return;
  }

  setSocketStatus('reconnecting');
  socketInitialized.current = false;
  await connectSocket(accessToken);
}, [accessToken, connectSocket]);


  return { loading, socketStatus, manualReconnect };
}
