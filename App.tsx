import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import StackNavigator from './src/navigation/StackNavigator';
import { useNotifySocket } from './src/hooks/useNotifySocket';

const AppNavigator = () => {
  const { loading, accessToken } = useNotifySocket();

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
