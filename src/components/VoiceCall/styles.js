import { StyleSheet } from 'react-native';

export const createStyles = (theme) =>
  StyleSheet.create({
    background: {
      flex: 1,
      resizeMode: 'cover',
      justifyContent: 'space-between',
    },
    container: {
      flex: 1,
      backgroundColor: 'rgba(0,0,0,0.5)', // overlay to improve readability
    },
    callerSection: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
    },
    avatar: {
      width: 100,
      height: 100,
      borderRadius: 50,
      marginBottom: 16,
      borderWidth: 2,
      borderColor: '#fff',
    },
    callerName: {
      fontSize: 24,
      fontWeight: 'bold',
      color: theme.colors.text,
      marginBottom: 4,
    },
    callStatus: {
      fontSize: 16,
      color: theme.colors.text,
      opacity: 0.8,
    },
    controls: {
      flexDirection: 'row',
      justifyContent: 'space-evenly',
      alignItems: 'center',
      padding: 24,
    },
    controlButton: {
      alignItems: 'center',
    },
    controlLabel: {
      marginTop: 8,
      fontSize: 14,
      color: theme.colors.text,
    },
    endCallButton: {
      width: 64,
      height: 64,
      borderRadius: 32,
      justifyContent: 'center',
      alignItems: 'center',
    },
  });
