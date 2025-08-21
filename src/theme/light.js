import { colors } from './colors';

export const lightTheme = {
  dark: false,
  colors: {
    primary: colors.primary,
    background: colors.backgroundLight,
    text: colors.textLight,
    card: colors.backgroundLight,
    border: '#ddd',
    notification: colors.primary,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: 'normal' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: 'bold' },
    heavy: { fontFamily: 'System', fontWeight: '900' },
  },
};
