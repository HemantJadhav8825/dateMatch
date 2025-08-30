import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { STACK_ROUTES } from '../constants/routes'; // <-- import routes
import LoginScreen from '../screens/LoginScreen/LoginScreen';
import OtpScreen from '../screens/OtpScreen/OtpScreen';
import BottomTabNavigator from './BottomTabNavigator';
import VoiceCall from '../screens/VoiceCall/VoiceCall';
import VideoCall from '../screens/VideoCall/VideoCall';
import UserInfoScreen from '../screens/UserInfoScreen/UserInfoScreen';

const Stack = createNativeStackNavigator();

const StackNavigator = ({ initialRouteName }) => (
  <Stack.Navigator initialRouteName={initialRouteName}>
    <Stack.Screen name={STACK_ROUTES.LOGIN} component={LoginScreen} options={{ headerShown: false }} />
    <Stack.Screen name={STACK_ROUTES.OTP} component={OtpScreen} options={{ headerShown: false }} />
    <Stack.Screen name={STACK_ROUTES.HOME} component={BottomTabNavigator} options={{ headerShown: false }} />
    <Stack.Screen name={STACK_ROUTES.VOICE_CALL} component={VoiceCall} options={{ headerShown: false }} />
    <Stack.Screen name={STACK_ROUTES.VIDEO_CALL} component={VideoCall} options={{ headerShown: false }} />
    <Stack.Screen name={STACK_ROUTES.USER_INFO} component={UserInfoScreen} options={{ headerShown: false }} />
  </Stack.Navigator>
);

export default StackNavigator;
