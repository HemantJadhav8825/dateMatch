import { AppRegistry } from 'react-native';
import App from './App';
import { name as appName } from './app.json';
import { NavigationContainer } from '@react-navigation/native';
import { ThemeProvider, ThemeContext } from './src/theme/ThemeContext';
import { navigationRef } from './src/components/RootNavigation';
import AuthProvider from './src/components/AuthProvider';

const ThemedApp = () => (
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

AppRegistry.registerComponent(appName, () => ThemedApp);
