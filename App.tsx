import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { getLocalStorage, getToken } from './src/utils/index';
import { initNotifySocket } from './src/components/CallNotifier';
import { showIncomingCallUI } from './src/components/showIncomingCallUI';

const AppNavigator = () => {
  const [loading, setLoading] = useState(false);
  const [accessToken, setAccessToken] = useState<any>(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await getToken();
        setAccessToken(token);
      } catch (e) {
        console.error('Failed to load token');
      } finally {
        setLoading(false);
      }
    };
    checkToken().then(async () => {
      const token = await getToken();
      const userId = await getLocalStorage('userId')
      initNotifySocket(userId, token, (data: any) => {
        // This callback runs when "incoming_call" arrives
        showIncomingCallUI(data);
      });
    });
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StackNavigator initialRouteName={accessToken ? 'Home' : 'Home'} />
  );
};

export default AppNavigator;
