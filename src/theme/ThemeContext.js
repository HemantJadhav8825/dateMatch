import React, { createContext, useEffect, useState } from 'react';
import { darkTheme, lightTheme } from './index';
import { getLocalStorage, setLocalStorage } from '../utils';

export const ThemeContext = createContext({
  isDark: false,
  theme: lightTheme,
  toggleTheme: () => {},
});

export const ThemeProvider = ({ children }) => {
  const [isDark, setIsDark] = useState(true);

  useEffect(() => {
    // Load saved theme from storage
    getLocalStorage('theme').then((storedTheme) => {
      if (storedTheme) {
        setIsDark(storedTheme === 'dark');
      }
    });
  }, []);

  const toggleTheme = async () => {
    const newTheme = !isDark;
    setIsDark(newTheme);
    await setLocalStorage('theme', newTheme ? 'dark' : 'light');
  };

  return (
    <ThemeContext.Provider
      value={{
        isDark,
        theme: isDark ? darkTheme : lightTheme,
        toggleTheme,
      }}
    >
      {children}
    </ThemeContext.Provider>
  );
};
