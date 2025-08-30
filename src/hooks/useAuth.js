import { useState, useEffect } from 'react';
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

  // ← AJOUTÉ : Recalcule isAuthenticated en temps réel
  const isAuthenticated = user !== null && isLoggedIn();

  console.log('🔍 useAuth state:', {
    user,
    userRole: user?.role,
    loading,
    isAuthenticated,
    token: getToken() ? 'présent' : 'absent'
  });

  return { 
    user, 
    token: getToken(),
    loading, 
    isAuthenticated, // ← CHANGÉ : Utilise la variable calculée
    refreshAuth // ← AJOUTÉ : Pour forcer le refresh si besoin
  };
};