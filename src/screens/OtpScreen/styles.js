import { StyleSheet, Platform } from 'react-native';

export default function createStyles(mode = 'light') {
  const isDark = mode === 'dark';

  return StyleSheet.create({
    container: {
      flex: 1,
      width: '100%',
      height: '100%',
      justifyContent: 'center',
      alignItems: 'center',
    },
    title: {
      fontSize: 28,
      color: isDark ? '#fff' : '#fff', // white for both here since gradient bg
      marginBottom: 30,
      fontWeight: 'bold',
    },
    otpContainer: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      width: '80%',
      marginBottom: 30,
    },
    otpInput: {
      width: 60,
      height: 60,
      backgroundColor: isDark ? '#222' : '#fff',
      borderRadius: 10,
      fontSize: 20,
      color: isDark ? '#fff' : '#000',
      textAlign: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.2,
          shadowRadius: 3,
        },
        android: {
          elevation: 3,
        },
      }),
    },
    inputDisabled: {
      backgroundColor: isDark ? '#333' : '#ddd',
    },
    submitButton: {
      backgroundColor: isDark ? '#333' : '#fff',
      paddingVertical: 15,
      paddingHorizontal: 50,
      borderRadius: 25,
      alignItems: 'center',
      ...Platform.select({
        ios: {
          shadowColor: '#000',
          shadowOffset: { width: 0, height: 2 },
          shadowOpacity: 0.15,
          shadowRadius: 2,
        },
        android: {
          elevation: 2,
        },
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
  });
}
