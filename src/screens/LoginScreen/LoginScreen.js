import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import axiosClient from '../../api/axiosClient';
import styles from './styles';

const LoginScreen = ({ navigation }) => {
  const [phone, setPhone] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSendOtp = async () => {
    if (phone.length === 10) {
      setLoading(true);
      try {
        await axiosClient.post('/otp/send', { phone });
        navigation.navigate('Otp', { phone });
      } catch (error) {
        console.error('Error:', error);
        alert('Failed to send OTP. Please try again.');
      } finally {
        setLoading(false);
      }
    } else {
      alert('Please enter a valid 10-digit phone number');
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.png')} // 👈 Replace with your image path
      style={styles.background}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.overlay}
      >
        <View style={styles.card}>
          <Text style={styles.title}>Welcome to MatchVoice</Text>
          <Text style={styles.subtitle}>Enter your phone number to continue</Text>

          <TextInput
            value={phone}
            onChangeText={setPhone}
            keyboardType="phone-pad"
            placeholder="Phone Number"
            placeholderTextColor="#aaa"
            maxLength={10}
            style={styles.input}
            editable={!loading}
          />

          <TouchableOpacity
            style={[styles.button, loading && styles.buttonDisabled]}
            onPress={handleSendOtp}
            disabled={loading}
          >
            {loading ? (
              <ActivityIndicator size="small" color="#fff" />
            ) : (
              <Text style={styles.buttonText}>Send OTP</Text>
            )}
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

export default LoginScreen;
