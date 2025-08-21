import { colors } from './colors';

export const darkTheme = {
  dark: true,
  colors: {
    primary: colors.primary,
    background: colors.backgroundDark,
    text: colors.textDark,
    card: colors.backgroundDark,
    border: '#333',
    notification: colors.primary,
  },
  fonts: {
    regular: { fontFamily: 'System', fontWeight: 'normal' },
    medium: { fontFamily: 'System', fontWeight: '500' },
    bold: { fontFamily: 'System', fontWeight: 'bold' },
    heavy: { fontFamily: 'System', fontWeight: '900' },
  },
};
