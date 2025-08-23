import React, { useRef, useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  useColorScheme,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import axiosClient from '../../api/axiosClient';
import createStyles from './styles';
import { setLocalStorage } from '../../utils';

const OtpScreen = ({ navigation = {}, route = {} }) => {
  const { phone = '9503760623', requestId } = route.params || {};
  const scheme = useColorScheme(); // 👈 Detects light or dark mode
  const styles = createStyles(scheme); // 👈 Generate theme-based styles

  const inputRefs = useRef([]);
  const [otp, setOtp] = useState(['', '', '', '']);
  const [loading, setLoading] = useState(false);

  const handleChange = (text, index) => {
    if (loading) return;
    let newOtp = [...otp];

    if (text === '' && otp[index] === '' && index > 0) {
      inputRefs.current[index - 1].focus();
      return;
    }

    if (text.length > 1) {
      newOtp = text.split('').slice(0, 4);
      setOtp(newOtp);
      if (newOtp.join('').length === 4) handleSubmit(newOtp.join(''));
      return;
    }

    newOtp[index] = text;
    setOtp(newOtp);

    if (text && index < 3) {
      inputRefs.current[index + 1].focus();
    }

    if (newOtp.join('').length === 4) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyPress = ({ nativeEvent }, index) => {
    if (loading) return;
    if (nativeEvent.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handleSubmit = async (code = otp.join('')) => {
    if (loading) return;
    setLoading(true);
    try {
      const { data } = await axiosClient.post('/auth/otp/verify', { phone, requestId, code });

      if (data) {
        await setLocalStorage('accessToken', data.accessToken);
        await setLocalStorage('refreshToken', data.refreshToken);
        await setLocalStorage('userId', data?.user?.id);
        navigation?.replace('Home');
      } else {
        Alert.alert('Invalid OTP', 'OTP verification failed');
      }
    } catch (error) {
      console.log(error);
      Alert.alert('Invalid OTP', 'Please check and try again');
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={scheme === 'dark' ? ['#141E30', '#243B55'] : ['#8e2de2', '#4a00e0']}
      style={styles.container}
    >
      <Text style={styles.title}>Enter OTP</Text>

      <View style={styles.otpContainer}>
        {otp.map((digit, index) => (
          <TextInput
            key={index}
            ref={(ref) => (inputRefs.current[index] = ref)}
            style={[styles.otpInput, loading && styles.inputDisabled]}
            maxLength={1}
            keyboardType="number-pad"
            onChangeText={(text) => handleChange(text, index)}
            onKeyPress={(e) => handleKeyPress(e, index)}
            value={digit}
            textAlign="center"
            editable={!loading}
          />
        ))}
      </View>

      <TouchableOpacity
        style={[styles.submitButton, loading && styles.buttonDisabled]}
        onPress={() => handleSubmit()}
        disabled={loading}
      >
        {loading ? (
          <ActivityIndicator size="small" color={scheme === 'dark' ? '#fff' : '#4a00e0'} />
        ) : (
          <Text style={styles.submitText}>Verify</Text>
        )}
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default OtpScreen;
