import { useState, useEffect, useMemo, useCallback } from 'react';
import { isLoggedIn, getUser, getToken } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = useCallback(() => {
    const currentToken = getToken();
    const currentUser = getUser();

    if (currentToken && currentUser) {
      setUser(currentUser);
      setToken(currentToken);
    } else {
      setUser(null);
      setToken(null);
    }

    setLoading(false);
  }, []);

  useEffect(() => {
    refreshAuth();
    const onVisibilityChange = () => {
      if (document.visibilityState === 'visible') {
        refreshAuth();
      }
    };

    const onStorage = () => {
      refreshAuth();
    };

    window.addEventListener('focus', refreshAuth);
    window.addEventListener('storage', onStorage);
    document.addEventListener('visibilitychange', onVisibilityChange);

    return () => {
      window.removeEventListener('focus', refreshAuth);
      window.removeEventListener('storage', onStorage);
      document.removeEventListener('visibilitychange', onVisibilityChange);
    };
  }, [refreshAuth]);

  const isAuthenticated = useMemo(() => {
    return Boolean(user && token && isLoggedIn());
  }, [user, token]);

  return { 
    user, 
    token,
    loading, 
    isAuthenticated,
    refreshAuth
  };
};