import { useState, useEffect, useMemo } from 'react';
import { isLoggedIn, getUser, getToken } from '../utils/auth';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = () => {
    console.log('🔄 Refresh auth...');
    if (isLoggedIn()) {
      const userData = getUser();
      console.log('✅ User récupéré:', userData);
      setUser(userData);
    } else {
      console.log('❌ Pas connecté');
      setUser(null);
    }
    setLoading(false);
  };

  useEffect(() => {
    console.log('🚀 useAuth useEffect - Premier chargement');
    refreshAuth();
  }, []);

  // ← CHANGÉ : useMemo pour éviter les re-calculs
  const isAuthenticated = useMemo(() => {
    return user !== null && isLoggedIn();
  }, [user]);

  const token = useMemo(() => {
    return getToken();
  }, []);

  console.log('🔍 useAuth state (une seule fois):', {
    user,
    userRole: user?.role,
    loading,
    isAuthenticated,
    token: token ? 'présent' : 'absent'
  });

  return { 
    user, 
    token,
    loading, 
    isAuthenticated,
    refreshAuth
  };
};