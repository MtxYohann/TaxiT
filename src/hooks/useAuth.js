import { useState, useEffect, useMemo } from 'react';

export const useAuth = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  const refreshAuth = async () => {
    console.log('🔄 Refresh auth...');
    setLoading(true);

    try {

      const response = await fetch('/api/me', {
        method: 'GET',
        credentials: 'include'
      });

      if (response.ok) {
        const userData = await response.json();
        console.log('✅ User récupéré:', userData);
        setUser(userData);
      } else {
        console.log('❌ Pas connecté ou session expirée');
        setUser(null);
      }
    } catch (error) {
      console.error('Erreur lors de la vérification auth:', error);
      setUser(null);
    }

    setLoading(false);
  };

  useEffect(() => {
    console.log('🚀 useAuth useEffect - Premier chargement');
    refreshAuth();
  }, []);

  const isAuthenticated = useMemo(() => {
    return user !== null;
  }, [user]);

  console.log('🔍 useAuth state:', {
    user,
    userRole: user?.role,
    loading,
    isAuthenticated
  });

  return {
    user,
    loading,
    isAuthenticated,
    refreshAuth
  };
};