import { StyleSheet } from 'react-native';

export const createStyles = (theme) =>
  StyleSheet.create({
    container: {
      flex: 1,
      backgroundColor: theme.colors.background,
      justifyContent: 'space-between',
      paddingVertical: 40,
    },
    callerSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: 120,
      height: 120,
      borderRadius: 60,
      marginBottom: 20,
    },
    callerName: {
      fontSize: 24,
      fontWeight: '600',
      color: theme.colors.text,
      marginBottom: 8,
    },
    callStatus: {
      fontSize: 16,
      color: theme.colors.text,
      opacity: 0.7,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      alignItems: 'center',
      paddingHorizontal: 30,
      marginBottom: 40,
    },
    controlButton: {
      alignItems: 'center',
    },
    controlLabel: {
      color: theme.colors.text,
      marginTop: 6,
      fontSize: 14,
      opacity: 0.8,
    },
    endCallButton: {
      width: 70,
      height: 70,
      borderRadius: 35,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
