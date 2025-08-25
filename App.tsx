import React, { useEffect, useState } from 'react';
import { ActivityIndicator, View } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { getToken } from './src/utils/index'

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
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <StackNavigator initialRouteName={accessToken ? 'Home' : 'VoiceCall'} />
  );
};

export default AppNavigator;
