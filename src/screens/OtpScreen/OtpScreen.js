import React, { useState, useEffect, useContext } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  useColorScheme,
  Platform,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { OtpInput } from 'react-native-otp-entry';
import axiosClient from '../../api/axiosClient';
import createStyles from './styles';
import { setLocalStorage, setTokens } from '../../utils';
import { VERIFY_OTP_FOR_LOGIN, SEND_OTP_FOR_LOGIN } from '../../api/endpoints';
import Toast from 'react-native-toast-message';
import { navigate } from '../../components/RootNavigation';
import { AuthContext } from '../../providers/AuthProvider';
import { STACK_ROUTES } from '../../constants/routes';

const OtpScreen = ({ route = {} }) => {
  const { phone, requestId: initialRequestId } = route.params || {};
  const scheme = useColorScheme();
  const styles = createStyles(scheme);

  const [otp, setOtp] = useState('');
  const [loading, setLoading] = useState(false);
  const [timer, setTimer] = useState(30);
  const [requestId, setRequestId] = useState(initialRequestId);
  const { login } = useContext(AuthContext);

  // Countdown timer
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

      if (data?.accessToken && data?.refreshToken) {
        await setLocalStorage('user', data?.user);

        // Let AuthProvider handle tokens and auth state
        await login(data.accessToken, data.refreshToken);

        // Navigation logic
        const isNewUser = !data?.user?.nickname;

        navigate(isNewUser ? STACK_ROUTES.USER_INFO : STACK_ROUTES.HOME);
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
    if (timer > 0 || loading) {
      Toast.show({
        type: 'info',
        text1: 'Please wait',
        text2: `You can resend OTP after ${timer}s`,
      });
      return;
    }
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

      <OtpInput
        numberOfDigits={4}
        focusColor={scheme === 'dark' ? '#fff' : '#4a00e0'}
        onTextChange={setOtp}
        onFilled={handleSubmit}
        theme={{
          containerStyle: styles.otpWrapper,
          pinCodeContainerStyle: styles.otpInput,
          focusedPinCodeContainerStyle: styles.otpInputActive,
          pinCodeTextStyle: { color: scheme === 'dark' ? '#fff' : '#000', fontSize: 22 },
        }}
        autoFocus
        keyboardType="number-pad"
      />

      <TouchableOpacity
        style={[
          styles.submitButton,
          (loading || otp.length < 4) && styles.buttonDisabled
        ]}
        onPress={() => handleSubmit()}
        disabled={loading || otp.length < 4}
      >
        {loading ? (
          <ActivityIndicator size="small" color={scheme === 'dark' ? '#fff' : '#4a00e0'} />
        ) : (
          <Text style={styles.submitText}>Verify</Text>
        )}
      </TouchableOpacity>

      <TouchableOpacity onPress={resendOtp} disabled={loading}>
        <Text style={styles.resendText}>
          {timer > 0 ? `Resend OTP in ${timer}s` : 'Resend OTP'}
        </Text>
      </TouchableOpacity>
    </LinearGradient>
  );
};

export default OtpScreen;
