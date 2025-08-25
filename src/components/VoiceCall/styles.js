import { StyleSheet } from 'react-native';

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    content: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 20,
    },
    text: {
      fontSize: 20,
      color: theme.colors.text,
      marginBottom: 20,
      ...theme.fonts.medium,
    },
    button: {
      paddingVertical: 15,
      paddingHorizontal: 30,
      borderRadius: 12,
      alignItems: 'center',
      justifyContent: 'center',
    },
    buttonText: {
      fontSize: 16,
      ...theme.fonts.bold,
      color: theme.colors.text,
    },
  });
