import { StyleSheet, Platform } from 'react-native';

export default function createStyles(mode = 'light') {
  const isDark = mode === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      color: '#fff',
      marginBottom: 8,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 16,
      color: '#ccc',
      marginBottom: 20,
    },
    otpWrapper: {
      width: '75%',
      alignSelf: 'center',
      marginBottom: 30,
    },
    otpInput: {
      borderWidth: 1,
      borderColor: 'rgba(255,255,255,0.4)',
      borderRadius: 12,
      width: 55,
      height: 55,
      justifyContent: 'center',
      alignItems: 'center',
      backgroundColor: 'rgba(255,255,255,0.1)',
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 },
        android: { elevation: 3 },
      }),
    },
    otpInputActive: {
      borderColor: '#fff',
      backgroundColor: 'rgba(255,255,255,0.2)',
    },
    submitButton: {
      backgroundColor: isDark ? '#333' : '#fff',
      paddingVertical: 14,
      paddingHorizontal: 50,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 12,
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 3 },
        android: { elevation: 2 },
      }),
    },
    buttonDisabled: {
      backgroundColor: isDark ? '#555' : '#ccc',
    },
    submitText: {
      color: isDark ? '#fff' : '#4a00e0',
      fontWeight: 'bold',
      fontSize: 18,
    },
    resendText: {
      color: '#fff',
      fontSize: 14,
      marginTop: 10,
    },
  });
}
