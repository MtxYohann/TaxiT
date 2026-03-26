import { getUser, getToken } from './auth';

// Fonction pour récupérer les données utilisateur (adaptée)
export const fetchUserData = async (setUser, setReservations, setError) => {
    try {
        // Récupérer l'utilisateur depuis localStorage
        const userData = getUser();
        const token = getToken();

        if (!userData || !token) {
            throw new Error("Utilisateur non connecté");
        }

        console.log("Données utilisateur depuis localStorage :", userData);
        setUser(userData);

        // Récupérer les réservations avec le token
        const resResa = await fetch(`process.env.next_public_api_url/api/reservations/${userData.id}`, {
            headers: {
                "Authorization": `Bearer ${token}`,
                "Content-Type": "application/json"
            }
        });

        if (!resResa.ok) throw new Error("Impossible de récupérer les réservations.");
        const reservationsData = await resResa.json();
        console.log("Données réservations :", reservationsData);
        setReservations(reservationsData);

    } catch (err) {
        setError(err.message);
    }
};

// Fonction pour supprimer le compte (adaptée)
export const deleteAccount = async (router, setError) => {
    if (confirm("Êtes-vous sûr de vouloir supprimer votre compte ?")) {
        try {
            const userData = getUser();
            const token = getToken();

            if (!userData || !token) {
                throw new Error("Utilisateur non connecté");
            }

            const res = await fetch("process.env.next_public_api_url/api/delete", {
                method: "DELETE",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}`
                },
                body: JSON.stringify({ email: userData.email }),
            });

            if (!res.ok) {
                throw new Error("Erreur lors de la suppression du compte.");
            }

            // Nettoyer le localStorage après suppression
            localStorage.removeItem('token');
            localStorage.removeItem('user');

            alert("Compte supprimé avec succès.");
            router.push("/register");
        } catch (err) {
            setError(err.message);
        }
    }
};

// Fonction pour modifier les données utilisateur
export const editAccount = (router) => {
    router.push("/edit-account");
};

export async function getAddressFromCoords(lat, lng) {
    const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
    const res = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
    );
    if (!res.ok) return `${lat}, ${lng}`;
    const data = await res.json();
    if (data.status === "OK" && data.results.length > 0) {
        return data.results[0].formatted_address;
    }
    return `${lat}, ${lng}`;
}