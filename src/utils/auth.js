export const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('isLoggedIn - token:', token);
        return token !== null && token !== 'undefined';
    }
    console.log('isLoggedIn - côté serveur, retourne false');
    return false;
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        console.log('getUser - user string:', user);
        
        // Vérification pour éviter l'erreur JSON.parse
        if (!user || user === 'undefined' || user === 'null') {
            console.log('getUser - pas de données utilisateur valides');
            return null;
        }
        
        try {
            const parsedUser = JSON.parse(user);
            console.log('getUser - parsed user:', parsedUser);
            return parsedUser;
        } catch (error) {
            console.error('Erreur lors du parsing JSON de l\'utilisateur:', error);
            // Nettoie les données corrompues
            localStorage.removeItem('user');
            localStorage.removeItem('token');
            return null;
        }
    }
    console.log('getUser - côté serveur, retourne null');
    return null;
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('getToken - token:', token);
        
        // Vérification pour éviter les tokens invalides
        if (!token || token === 'undefined' || token === 'null') {
            return null;
        }
        
        return token;
    }
    console.log('getToken - côté serveur, retourne null');
    return null;
};

export const logout = () => {
    if (typeof window !== 'undefined') {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('Déconnexion effectuée');
    }
};