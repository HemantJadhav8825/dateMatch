import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ImageBackground,
  ActivityIndicator,
} from 'react-native';
import PhoneInput from 'react-native-phone-number-input';
import axiosClient from '../../api/axiosClient';
import { useTheme } from '@react-navigation/native';
import createStyles from './styles';
import { SEND_OTP_FOR_LOGIN } from '../../api/endpoints';
import { navigate } from '../../components/RootNavigation';

const LoginScreen = ({ /*navigation*/ }) => {
  const { colors, dark } = useTheme();

  const themeConfig = {
    colors: {
      ...colors,
      subtext: dark ? '#aaa' : '#666',
      inputBackground: dark ? '#1e1e1e' : '#f9f9f9',
      inputBorder: dark ? '#333' : '#ccc',
      primaryDisabled: dark ? '#444' : '#a3bffa',
      placeholder: dark ? '#888' : '#aaa',
    },
    isDark: dark,
  };

  const styles = createStyles(themeConfig);

  const [phone, setPhone] = useState('9503760623');
  const [formattedPhone, setFormattedPhone] = useState('+91');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const phoneInputRef = useRef(null);

  const handleSendOtp = async () => {
    if (phone.length !== 10) {
      setError('Please enter a valid 10-digit phone number');
      return;
    }

    setError('');
    setLoading(true);
    try {
      const { data } = await axiosClient.post(SEND_OTP_FOR_LOGIN, { phone });
      navigate('Otp', { phone: phone, requestId: data?.requestId });
    } catch (error) {
      console.error('Error:', error?.response || error);
      setError(error?.response?.data?.error || 'Failed to send OTP. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handlePhoneChange = (text) => {
    const digits = text.replace(/\D/g, ''); // Remove non-numeric characters
    if (digits.length <= 10) {
      setPhone(digits);
      setFormattedPhone(`+91${digits}`);
    }
  };

  return (
    <ImageBackground
      source={require('../../assets/bg.png')}
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

          <PhoneInput
            ref={phoneInputRef}
            defaultValue={phone}
            defaultCode="IN"
            layout="first"
            disableArrowIcon={true}
            countryPickerButtonStyle={{ display: 'none' }}
            containerStyle={[
              styles.phoneInputContainer,
              {
                backgroundColor: themeConfig.colors.inputBackground,
                borderColor: themeConfig.colors.inputBorder,
                height: 50,
                borderRadius: 8,
              },
            ]}
            textContainerStyle={{
              backgroundColor: themeConfig.colors.inputBackground,
              paddingVertical: 0,
              paddingHorizontal: 12, // horizontal padding added
              height: 50,
            }}
            textInputStyle={{
              color: dark ? '#fff' : '#000',
              paddingVertical: 0,
              // textAlign: 'center', // centers the number horizontally
              textAlignVertical: 'center', // aligns text vertically in Android
            }}
            codeTextStyle={{
              color: dark ? '#fff' : '#000',
            }}
            textInputProps={{
              editable: !loading,
              placeholderTextColor: themeConfig.colors.placeholder,
              maxLength: 10,
              autoFocus: true,
              keyboardType: 'number-pad',
            }}
            value={phone}
            onChangeText={handlePhoneChange}
          />

          {error ? <Text style={styles.errorText}>{error}</Text> : null}

          <TouchableOpacity
            style={[
              styles.button,
              (loading || phone.length !== 10) && styles.buttonDisabled,
            ]}
            onPress={handleSendOtp}
            disabled={loading || phone.length !== 10}
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
