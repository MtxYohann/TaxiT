export const isLoggedIn = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('isLoggedIn - token:', token);
        return token !== null;
    }
    console.log('isLoggedIn - côté serveur, retourne false');
    return false;
};

export const getUser = () => {
    if (typeof window !== 'undefined') {
        const user = localStorage.getItem('user');
        console.log('getUser - user string:', user);
        const parsedUser = user ? JSON.parse(user) : null;
        console.log('getUser - parsed user:', parsedUser);
        return parsedUser;
    }
    console.log('getUser - côté serveur, retourne null');
    return null;
};

export const getToken = () => {
    if (typeof window !== 'undefined') {
        const token = localStorage.getItem('token');
        console.log('getToken - token:', token);
        return token;
    }
    console.log('getToken - côté serveur, retourne null');
    return null;
};

export const logout = () => {
    if (typeof window !== 'undefined') {
        console.log('logout - suppression des données localStorage');
        localStorage.removeItem('token');
        localStorage.removeItem('user');
        console.log('logout - redirection vers /login');
        window.location.href = '/login';
    }
};