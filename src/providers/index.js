import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, ThemeContext } from '../theme/ThemeContext';
import { navigationRef } from '../components/RootNavigation';
import AuthProvider from '../components/AuthProvider';
import App from '../../App.tsx';

const Providers = () => (
  <ThemeProvider>
    <AuthProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <NavigationContainer ref={navigationRef} theme={theme}>
            <App />
          </NavigationContainer>
        )}
      </ThemeContext.Consumer>
    </AuthProvider>
  </ThemeProvider>
);

export default Providers;
