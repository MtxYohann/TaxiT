import { useState, useEffect } from 'react';
import { isLoggedIn, getUser, getToken } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Récupère automatiquement la session au chargement
    if (isLoggedIn()) {
      setUser(getUser());
    }
    setLoading(false);
  }, []);

  return { 
    user, 
    token: getToken(),
    loading, 
    isAuthenticated: isLoggedIn()
  };
};