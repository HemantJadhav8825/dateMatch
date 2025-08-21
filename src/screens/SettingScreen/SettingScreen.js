import React, { useState, useContext } from 'react';
import {
  View,
  Text,
  Switch,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import { ThemeContext } from '../../theme/ThemeContext';
import getStyles from './styles';

const SettingsScreen = ({ navigation }) => {
  const { isDark, theme, toggleTheme } = useContext(ThemeContext);
  const styles = getStyles(theme); // dynamic styles based on theme
  const [notificationsEnabled, setNotificationsEnabled] = useState(true);

  const onLogout = () => {
    Alert.alert('Logged out');
    navigation.navigate('Login');
  };

  const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <View style={styles.settingRow}>
        <Text style={styles.label}>Enable Notifications</Text>
        <Switch
          value={notificationsEnabled}
          onValueChange={toggleNotifications}
          thumbColor={notificationsEnabled ? theme.colors.primary : '#ccc'}
        />
      </View>

      <View style={styles.settingRow}>
        <Text style={styles.label}>Dark Theme</Text>
        <Switch
          value={isDark}
          onValueChange={toggleTheme}
          thumbColor={isDark ? theme.colors.primary : '#ccc'}
        />
      </View>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Account Info</Text>
      </TouchableOpacity>

      <TouchableOpacity style={styles.button}>
        <Text style={styles.buttonText}>Privacy Policy</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={[styles.button, styles.logoutButton]}
        onPress={onLogout}
      >
        <Text style={styles.logoutButtonText}>Logout</Text>
      </TouchableOpacity>
    </ScrollView>
  );
};

export default SettingsScreen;
