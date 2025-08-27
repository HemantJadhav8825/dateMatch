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
      marginBottom: 10,
      fontWeight: 'bold',
    },
    subtitle: {
      fontSize: 16,
      color: '#ccc',
      marginBottom: 20,
    },
    otpWrapper: {
      width: '80%',
      alignSelf: 'center',
      marginBottom: 30,
    },
    otpInput: {
      borderWidth: 1,
      borderColor: '#ccc',
      borderRadius: 10,
      width: 60,
      height: 60,
      justifyContent: 'center',
      alignItems: 'center',
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.2, shadowRadius: 3 },
        android: { elevation: 3 },
      }),
    },
    otpInputActive: {
      borderColor: '#fff',
      borderWidth: 2,
    },
    submitButton: {
      backgroundColor: isDark ? '#333' : '#fff',
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 25,
      alignItems: 'center',
      marginBottom: 15,
      ...Platform.select({
        ios: { shadowColor: '#000', shadowOffset: { width: 0, height: 2 }, shadowOpacity: 0.15, shadowRadius: 2 },
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
