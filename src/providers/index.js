import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, ThemeContext } from '../theme/ThemeContext';
import { navigationRef } from '../components/RootNavigation';
import AuthProvider from './AuthProvider';
import App from '../../App.tsx';
import { Provider } from 'react-redux';
import store from '../store';

const Providers = () => (
  <ThemeProvider>
    <AuthProvider>
      <ThemeContext.Consumer>
        {({ theme }) => (
          <NavigationContainer ref={navigationRef} theme={theme}>
            <Provider store={store}>
              <App />
            </Provider>
          </NavigationContainer>
        )}
      </ThemeContext.Consumer>
    </AuthProvider>
  </ThemeProvider>
);

export default Providers;
