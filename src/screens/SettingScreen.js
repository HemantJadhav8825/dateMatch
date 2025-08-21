import React, { useState, useContext } from 'react';
import {
    View,
    Text,
    Switch,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    Alert,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { ThemeContext } from '../theme/ThemeContext'; // adjust path as needed

const SettingsScreen = ({ navigation }) => {
    const { isDark, toggleTheme } = useContext(ThemeContext);
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    const onLogout = () => {
        AsyncStorage.clear()
            .then(() => {
                navigation.navigate('Login');
            })
            .catch((error) => console.error("Error clearing AsyncStorage", error));
    };

    const onViewPrivacy = () => {
        Alert.alert('Privacy Policy', 'Feature coming soon!');
    };

    const toggleNotifications = () => setNotificationsEnabled((prev) => !prev);

    return (
        <ScrollView contentContainerStyle={styles.container}>
            <View style={styles.settingRow}>
                <Text style={styles.label}>Enable Notifications</Text>
                <Switch
                    value={notificationsEnabled}
                    onValueChange={toggleNotifications}
                    thumbColor={notificationsEnabled ? '#4a00e0' : '#ccc'}
                />
            </View>

            <View style={styles.settingRow}>
                <Text style={styles.label}>Dark Theme</Text>
                <Switch
                    value={isDark}
                    onValueChange={toggleTheme}
                    thumbColor={isDark ? '#4a00e0' : '#ccc'}
                />
            </View>

            <TouchableOpacity style={styles.button} onPress={() => Alert.alert('Account Info', 'Feature coming soon!')}>
                <Text style={styles.buttonText}>Account Info</Text>
            </TouchableOpacity>

            <TouchableOpacity style={styles.button} onPress={onViewPrivacy}>
                <Text style={styles.buttonText}>Privacy Policy</Text>
            </TouchableOpacity>

            <TouchableOpacity style={[styles.button, styles.logoutButton]} onPress={onLogout}>
                <Text style={[styles.buttonText, styles.logoutButtonText]}>Logout</Text>
            </TouchableOpacity>
        </ScrollView>
    );
};

export default SettingsScreen;

const styles = StyleSheet.create({
    container: {
        padding: 25,
        backgroundColor: '#fff',
        flexGrow: 1,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 30,
        color: '#222',
    },
    settingRow: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 25,
    },
    label: {
        fontSize: 16,
        color: '#444',
    },
    button: {
        backgroundColor: '#4a00e0',
        paddingVertical: 15,
        borderRadius: 10,
        marginBottom: 15,
        alignItems: 'center',
    },
    buttonText: {
        color: '#fff',
        fontWeight: '600',
        fontSize: 16,
    },
    logoutButton: {
        backgroundColor: '#ff4d4d',
    },
    logoutButtonText: {
        fontWeight: '700',
    },
});
