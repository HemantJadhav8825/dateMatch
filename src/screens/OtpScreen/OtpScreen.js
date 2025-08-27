import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import OTPInputView from '@twotalltotems/react-native-otp-input';
import axiosClient from '../../api/axiosClient';
import createStyles from './styles';
import { setLocalStorage } from '../../utils';
import { VERIFY_OTP_FOR_LOGIN, SEND_OTP_FOR_LOGIN } from '../../api/endpoints';
import Toast from 'react-native-toast-message';

const OtpScreen = ({ navigation = {}, route = {} }) => {
  const { phone = '9503760623', requestId: initialRequestId } = route.params || {};
  const scheme = useColorScheme();
  const styles = createStyles(scheme);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [requestId, setRequestId] = useState(initialRequestId);

  // Countdown timer for resend
  useEffect(() => {
    let countdown;
    if (timer > 0) {
      countdown = setTimeout(() => setTimer((t) => t - 1), 1000);
    }
    return () => clearTimeout(countdown);
  }, [timer]);

  const handleSubmit = async (code = otp) => {
    if (loading || code.length < 4) return;
    setLoading(true);
    try {
      const { data } = await axiosClient.post(VERIFY_OTP_FOR_LOGIN, {
        phone,
        requestId,
        code,
      });

      if (data) {
        await setLocalStorage('accessToken', data.accessToken);
        await setLocalStorage('refreshToken', data.refreshToken);
        await setLocalStorage('userId', data?.user?.id);
        navigation?.replace('Home');
      } else {
        Toast.show({ type: 'error', text1: 'Invalid OTP', text2: 'OTP verification failed' });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.error || 'Something went wrong. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  const resendOtp = async () => {
    if (timer > 0 || loading) return; // Block rapid resends
    setLoading(true);
    try {
      const { data } = await axiosClient.post(SEND_OTP_FOR_LOGIN, { phone });
      if (data?.requestId) {
        setRequestId(data.requestId);
        setTimer(30);
        Toast.show({ type: 'success', text1: 'OTP Sent', text2: `New OTP sent to ${phone}` });
      } else {
        Toast.show({ type: 'error', text1: 'Error', text2: 'Failed to send new OTP.' });
      }
    } catch (error) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: error?.response?.data?.error || 'Failed to send OTP. Please try again.',
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <LinearGradient
      colors={scheme === 'dark' ? ['#141E30', '#243B55'] : ['#8e2de2', '#4a00e0']}
      style={styles.container}
    >
      <Text style={styles.title}>Verify Your OTP</Text>
      <Text style={styles.subtitle}>Sent to +91 {phone}</Text>

      <OTPInputView
        style={styles.otpWrapper}
        pinCount={4}
        autoFocusOnLoad={Platform.OS === 'android'}
        codeInputFieldStyle={styles.otpInput}
        codeInputHighlightStyle={styles.otpInputActive}
        onCodeFilled={handleSubmit}
        keyboardType="number-pad"
        textContentType="oneTimeCode"
        autoComplete="sms-otp"
        importantForAutofill="yes"
      />

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

      <TouchableOpacity onPress={resendOtp} disabled={timer > 0 || loading}>
        <Text style={styles.resendText}>
          {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default OtpScreen;
