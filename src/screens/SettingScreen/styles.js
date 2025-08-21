import { StyleSheet } from 'react-native';

export default function getStyles(theme) {
  return StyleSheet.create({
    container: {
      padding: 25,
      backgroundColor: theme.colors.background,
      flexGrow: 1,
    },
    title: {
      fontSize: 28,
      fontWeight: '700',
      marginBottom: 30,
      color: theme.colors.text,
    },
    settingRow: {
      flexDirection: 'row',
      justifyContent: 'space-between',
      alignItems: 'center',
      marginBottom: 25,
    },
    label: {
      fontSize: 16,
      color: theme.colors.text,
    },
    button: {
      backgroundColor: theme.colors.primary,
      paddingVertical: 15,
      borderRadius: 10,
      marginBottom: 15,
      alignItems: 'center',
    },
    buttonText: {
      color: theme.dark ? '#fff' : '#fff', // stays visible for both
      fontWeight: '600',
      fontSize: 16,
    },
    logoutButton: {
      backgroundColor: '#ff4d4d',
    },
    logoutButtonText: {
      fontWeight: '700',
      color: '#fff',
    },
  });
}
