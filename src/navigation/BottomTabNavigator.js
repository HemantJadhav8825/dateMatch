import React from 'react';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import Icon from 'react-native-vector-icons/Ionicons';
import { TAB_ROUTES } from '../constants/routes'; // <-- import routes
import HomeScreen from '../screens/HomeScreen/HomeScreen';
import ProfileScreen from '../screens/ProfleScreen/ProfleScreen';
import SettingsScreen from '../screens/SettingScreen/SettingScreen';

const Tab = createBottomTabNavigator();

const BottomTabNavigator = () => {
  return (
    <Tab.Navigator
      screenOptions={({ route }) => ({
        tabBarIcon: ({ focused, color, size }) => {
          let iconName;
          if (route.name === TAB_ROUTES.HOME) iconName = focused ? 'home' : 'home-outline';
          else if (route.name === TAB_ROUTES.PROFILE) iconName = focused ? 'person' : 'person-outline';
          else if (route.name === TAB_ROUTES.SETTINGS) iconName = focused ? 'settings' : 'settings-outline';
          return <Icon name={iconName} size={size} color={color} />;
        },
        tabBarActiveTintColor: '#4a00e0',
        tabBarInactiveTintColor: 'gray',
      })}
    >
      <Tab.Screen name={TAB_ROUTES.HOME} component={HomeScreen} />
      <Tab.Screen name={TAB_ROUTES.PROFILE} component={ProfileScreen} />
      <Tab.Screen name={TAB_ROUTES.SETTINGS} component={SettingsScreen} />
    </Tab.Navigator>
  );
};

export default BottomTabNavigator;
