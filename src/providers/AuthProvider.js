import React, { createContext, useEffect, useState, useCallback, useMemo, useRef } from 'react';
import jwtDecode from 'jwt-decode';
import {
  getAccessToken,
  setTokens,
  clearTokens
} from '../utils'; // Same utils as before

export const AuthContext = createContext({
  isLoggedIn: false,
  loading: true,
  user: null,
  login: async () => {},
  logout: async () => {},
  refresh: async () => {}, // Now just a state recheck
});

const decodeAndValidateToken = (token) => {
  try {
    const decoded = jwtDecode(token);
    if (!decoded?.exp || Date.now() >= decoded.exp * 1000) return null;
    return decoded;
  } catch {
    return null;
  }
};

const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const lastTokenRef = useRef(null);

  const checkLoginStatus = useCallback(async () => {
    const token = await getAccessToken();
    if (token === lastTokenRef.current) return isLoggedIn;

    lastTokenRef.current = token;

    if (!token) {
      if (isLoggedIn || user) {
        setIsLoggedIn(false);
        setUser(null);
      }
      return false;
    }

    const decoded = decodeAndValidateToken(token);
    if (!decoded) {
      setIsLoggedIn(false);
      setUser(null);
      return false;
    }

    if (!isLoggedIn || JSON.stringify(user) !== JSON.stringify(decoded)) {
      setIsLoggedIn(true);
      setUser(decoded);
    }
    return true;
  }, [isLoggedIn, user]);

  const login = useCallback(async (accessToken, refreshToken) => {
    await setTokens(accessToken, refreshToken);
    await checkLoginStatus();
  }, [checkLoginStatus]);

  const logout = useCallback(async () => {
    await clearTokens();
    lastTokenRef.current = null;
    setIsLoggedIn(false);
    setUser(null);
  }, []);

  const refresh = useCallback(async () => {
    // Just re-validate current tokens after axios interceptor refresh
    await checkLoginStatus();
  }, [checkLoginStatus]);

  useEffect(() => {
    (async () => {
      await checkLoginStatus();
      setLoading(false);
    })();
  }, [checkLoginStatus]);

  const value = useMemo(() => ({
    isLoggedIn,
    loading,
    user,
    login,
    logout,
    refresh,
  }), [isLoggedIn, loading, user, login, logout, refresh]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthProvider;
