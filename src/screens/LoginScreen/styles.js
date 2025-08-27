// LoginScreen.styles.js
import { StyleSheet } from 'react-native';

export default (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
    },
    overlay: {
      flex: 1,
      justifyContent: 'center',
      paddingHorizontal: 20,
      backgroundColor: theme.isDark
        ? 'rgba(0,0,0,0.6)'
        : 'rgba(255,255,255,0.2)',
    },
    card: {
      backgroundColor: theme.colors.card,
      borderRadius: 12,
      padding: 25,
      shadowColor: theme.isDark ? '#000' : '#222',
      shadowOffset: { width: 0, height: 5 },
      shadowOpacity: 0.2,
      shadowRadius: 10,
      elevation: 8,
    },
    title: {
      fontSize: 26,
      fontWeight: '700',
      color: theme.colors.text,
      marginBottom: 10,
      textAlign: 'center',
    },
    subtitle: {
      fontSize: 15,
      color: theme.colors.subtext,
      marginBottom: 25,
      textAlign: 'center',
    },

    // For react-native-phone-number-input
    phoneInputContainer: {
      width: '100%',
      borderWidth: 1,
      borderColor: theme.colors.border,
      backgroundColor: theme.colors.inputBackground,
      borderRadius: 8,
      marginBottom: 20,
      overflow: 'hidden', // ensures no overflow of code area
    },
    phoneTextContainer: {
      backgroundColor: theme.colors.inputBackground,
      borderLeftWidth: 1,
      borderLeftColor: theme.colors.border,
      borderRadius: 0, // avoid double rounding with container
      paddingVertical: 0,
    },

    errorText: {
      color: theme.isDark ? '#ff6b6b' : '#d9534f',
      fontSize: 13,
      marginBottom: 10,
      textAlign: 'center',
    },

    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 14,
      borderRadius: 8,
      alignItems: 'center',
    },
    buttonDisabled: {
      backgroundColor: theme.colors.primaryDisabled,
    },
    buttonText: {
      color: theme.colors.buttonText,
      fontWeight: '600',
      fontSize: 16,
    },
  });
